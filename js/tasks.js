import { canWearClothingPiece, canRemoveClothingPiece } from "./clothing.js";
import { deepCopy } from "./utils.js";
import {
  SEX_ENUM,
  STAGE_ENUM,
  INTENSITY_ENUM,
  EXTREMITY_ENUM,
  PLAYERTARGET_ENUM,
  ACT_ON_ENUM,
  ACT_WITH_ENUM,
} from "./enums.js";
import { getRoundResult } from "./game.js";

import { tasks_undress_self } from "./tasks/undress_self.js";
import { tasks_undress_other_self } from "./tasks/undress_other_self.js";
import { tasks_undress_self_other } from "./tasks/undress_self_other.js";
import { tasks_dress_self } from "./tasks/dress_self.js";
import { tasks_dress_other_self } from "./tasks/dress_other_self.js";
import { tasks_dress_self_other } from "./tasks/dress_self_other.js";

export const TASKS_MODEL = {
  undress_self: {
    enabled: true,
    weight: 10,
    tasks: tasks_undress_self,
  },

  undress_other_self: {
    enabled: true,
    weight: 8,
    tasks: tasks_undress_other_self,
  },

  undress_self_other: {
    enabled: true,
    weight: 8,
    tasks: tasks_undress_self_other,
  },

  dress_self: {
    enabled: true,
    weight: 6,
    tasks: tasks_dress_self,
  },

  dress_other_self: {
    enabled: true,
    weight: 4,
    tasks: tasks_dress_other_self,
  },

  dress_self_other: {
    enabled: true,
    weight: 4,
    tasks: tasks_dress_self_other,
  },

  expose: {
    enabled: true,
    weight: 10,
    tasks: [],
  },
};

// ——— helpers ———
function arraysIntersect(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length === 0 || b.length === 0) return false;
  const setB = new Set(b);
  return a.some((x) => setB.has(x));
}

function optionAllowed(taskVals, settingVals) {
  // Lege lijst = geen beperking => toegestaan
  if (!Array.isArray(taskVals) || taskVals.length === 0) return true;
  // Minstens één overlap met ingestelde opties
  return arraysIntersect(
    taskVals,
    Array.isArray(settingVals) ? settingVals : []
  );
}

function matchesConditions(task, gameSettings) {
  const conds = task?.conditions || {};
  if (!gameSettings) return true;

  // Loop dynamisch over alle keys in de conditions
  for (const [key, values] of Object.entries(conds)) {
    if (!Array.isArray(values) || values.length === 0) continue; // geen beperking = automatisch goed
    const settingValues = gameSettings[key];
    if (!optionAllowed(values, settingValues)) return false;
  }

  return true;
}

function sexMatches(requiredSexArr, playerSex) {
  // Leeg = altijd goed
  if (!Array.isArray(requiredSexArr) || requiredSexArr.length === 0)
    return true;
  // Player moet in de lijst passen
  return requiredSexArr.includes(playerSex);
}

function preferSexOk(preferSex, otherSex) {
  // Leeg/undefined telt als "alles ok", net als Both
  if (!preferSex || preferSex === SEX_ENUM.Both) return true;
  return preferSex === otherSex;
}

function weightedPick(items) {
  // items: [{task, weight}]
  const total = items.reduce((s, x) => s + (x.weight || 0), 0);
  if (total <= 0) return null;
  let r = Math.random() * total;
  for (const x of items) {
    r -= x.weight || 0;
    if (r <= 0) return x;
  }
  return items[items.length - 1] || null;
}

function buildParticipantCandidates(participants, loser, winners) {
  // Maak per participant een lijst mogelijke spelers
  const out = participants.map((p) => ({
    ...p,
    players: [], // vul nieuw, we overschrijven niet het origineel
  }));

  for (const part of out) {
    if (part.target === PLAYERTARGET_ENUM.loser) {
      // Loser moet exact matchen op sex-regel (indien opgegeven)
      if (sexMatches(part.sex, loser.sex)) {
        part.players = [loser];
      } else {
        part.players = []; // force fail upstream
      }
      continue;
    }

    // winnerslot: begin met alle winnaars die niet loser zijn
    const pool = Array.isArray(winners) ? winners : [];
    part.players = pool.filter((w) => sexMatches(part.sex, w.sex));
  }

  return out;
}

function assignParticipants(participants) {
  // Greedy: kleinste candidates eerst
  const parts = participants.map((p) => ({
    ...p,
    players: [...(p.players || [])],
    player: null,
  }));
  const used = new Set();

  // Sorteer dynamisch bij elke stap: kies slot met minst opties die nog niet used zijn
  for (let i = 0; i < parts.length; i++) {
    // Herbereken counts excl. al gebruikte
    const selectable = parts
      .filter((p) => !p.player)
      .map((p) => {
        const cand = p.players.filter((pl) => !used.has(pl.id));
        return { part: p, cand };
      })
      .sort((a, b) => a.cand.length - b.cand.length);

    if (selectable.length === 0) break;

    const { part, cand } = selectable[0];

    if (cand.length === 0) {
      // Onoplosbaar
      return null;
    }

    // Kies random uit de beschikbare kandidaten
    const pick = cand[Math.floor(Math.random() * cand.length)];
    part.player = pick;
    used.add(pick.id);

    // verwijder pick impliciet doordat we telkens cand herberekenen
  }

  // Check dat alles gevuld is
  if (parts.some((p) => !p.player)) return null;

  return parts;
}

function preferSexMatrixOk(partsAssigned) {
  // Voor elk koppel: i vs j -> beide kanten moeten ok zijn
  for (let i = 0; i < partsAssigned.length; i++) {
    for (let j = 0; j < partsAssigned.length; j++) {
      if (i === j) continue;
      const A = partsAssigned[i].player;
      const B = partsAssigned[j].player;
      if (!preferSexOk(A.preferSex, B.sex)) return false;
    }
  }
  return true;
}

function findParticipantBySlot(partsAssigned, slotName) {
  return partsAssigned.find((p) => p.slot === slotName) || null;
}

// Berekent de uiteindelijke taak-weight:
// per condition key neem je het GEMIDDELDE van de bijbehorende enum-weights,
// en vermenigvuldig je de categoryWeight met elke key-multiplier.
function effectiveCategoryWeight(categoryWeight, task, gameWeights) {
  const conds = task?.conditions || {};
  let multiplier = 1;

  // Loop dynamisch over alle condition-keys die dit task-object heeft
  for (const [key, condValues] of Object.entries(conds)) {
    if (!Array.isArray(condValues) || condValues.length === 0) continue;

    const groupWeights = gameWeights?.[key] || [];
    if (!Array.isArray(groupWeights) || groupWeights.length === 0) continue;

    // Verzamel de weights van alle enum values die in deze key-condition staan
    const matched = condValues
      .map((v) => groupWeights.find((gw) => gw?.value === v)?.weight)
      .filter((w) => typeof w === "number" && Number.isFinite(w));

    if (matched.length > 0) {
      // Gemiddelde per key
      const avg = matched.reduce((a, b) => a + b, 0) / matched.length;
      multiplier *= avg;
    }
    // Als er geen match is, laat je multiplier onveranderd (factor 1)
  }

  return (Number(categoryWeight) || 0) * multiplier;
}

// Taak bepaalt zelf of preferSex gecontroleerd wordt
function needsPreferSex(task) {
  return task?.flags?.checkPreferSex === true;
}

// Main

export function getTasksModel() {
  return deepCopy(TASKS_MODEL);
}

export function generateTasks() {
  const tasksModel = window.GAME?.tasks ?? {};
  const gameSettings = window.GAME?.game?.settings ?? {};
  const gameWeights = window.GAME?.game?.weights ?? {};
  const { loser, winners } = getRoundResult();

  const pool = [];

  for (const [catKey, cat] of Object.entries(tasksModel)) {
    if (!cat?.enabled) continue;
    if (!Array.isArray(cat.tasks) || cat.tasks.length === 0) continue;

    const categoryWeight = Number(cat.weight) || 0;

    for (const task of cat.tasks) {
      if (task?.enabled === false) continue;
      if (!(task?.participants?.length > 0)) continue;

      // Definitieve taak-weight: categorie × per-key-gemiddelden
      const catWeightEffective = effectiveCategoryWeight(
        categoryWeight,
        task,
        gameWeights
      );

      // 1) conditions
      if (!matchesConditions(task, gameSettings)) continue;

      // 2) participants -> candidates
      const partsWithCandidates = buildParticipantCandidates(
        task.participants,
        loser,
        winners
      );

      // Loser slot moet exact 1 mogelijke hebben (de echte loser), anders skip
      const loserPart = partsWithCandidates.find(
        (p) => p.target === PLAYERTARGET_ENUM.loser
      );
      if (
        !loserPart ||
        loserPart.players.length !== 1 ||
        loserPart.players[0].id !== loser.id
      )
        continue;

      // 3) greedy assignment
      const assigned = assignParticipants(partsWithCandidates);
      if (!assigned) continue;

      // 4) preferSex alleen afdwingen als de taak seksueel is
      if (needsPreferSex(task) && !preferSexMatrixOk(assigned)) continue;

      // 5) effects mogelijk?
      if (!evaluateTaskEffects(task, assigned)) continue;

      // 6) taak is uitvoerbaar → in pool
      const taskCopy = structuredClone(task);
      taskCopy.participants = assigned; // ingevulde spelers
      pool.push({
        task: taskCopy,
        category: catKey,
        weight: catWeightEffective, // per taak het cat-gewicht
      });
    }
  }

  // Kies nu 1 taak; wil je de hele pool bewaren, sla dan pool op in state
  const picked = weightedPick(pool);
  return {
    pool,
    picked: picked ? picked.task : null,
  };
}

function evaluateTaskEffects(task, partsAssigned) {
  if (!task || !(task?.effects?.length > 0)) return false;

  for (const effect of task.effects) {
    switch (effect.type) {
      case "clothing.remove": {
        const part = findParticipantBySlot(partsAssigned, effect.slot);
        if (!part?.player?.clothing) return false;
        if (!canRemoveClothingPiece(effect.item, part.player.clothing))
          return false;
        break;
      }
      case "clothing.add": {
        const part = findParticipantBySlot(partsAssigned, effect.slot);
        if (!part?.player?.clothing) return false;
        if (!canWearClothingPiece(effect.item, part.player.clothing))
          return false;
        break;
      }
      default:
        return false;
    }
  }
  return true;
}

// let op: pas koppelen aan UI-knop "uitgevoerd" als je ready bent
function executeTaskEffects(task, partsAssigned) {
  if (!task || !(task?.effects?.length > 0)) return;

  for (const effect of task.effects) {
    const part = findParticipantBySlot(partsAssigned, effect.slot);
    if (!part?.player?.clothing) continue;

    const model = part.player.clothing;
    switch (effect.type) {
      case "clothing.remove": {
        // assumptie: je hebt een mutator; zo niet, toggle hier direct:
        const piece = model[effect.item];
        if (piece) piece.worn = false;
        break;
      }
      case "clothing.add": {
        const piece = model[effect.item];
        if (piece) piece.worn = true;
        break;
      }
    }
  }
}
