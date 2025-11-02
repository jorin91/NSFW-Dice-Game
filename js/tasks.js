import { canWearClothingPiece, canRemoveClothingPiece } from "./clothing.js";
import { deepCopy, makeSeperator } from "./utils.js";
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
import { switchPanel } from "./panelnavigation.js";
import { buildTaskExecutionElement } from "./tasks_execution.js";
import { setI18n } from "./lang_i18n.js";

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
    weight: 6,
    tasks: tasks_undress_other_self,
  },

  undress_self_other: {
    enabled: true,
    weight: 4,
    tasks: tasks_undress_self_other,
  },

  dress_self: {
    enabled: true,
    weight: 5,
    tasks: tasks_dress_self,
  },

  dress_other_self: {
    enabled: true,
    weight: 3,
    tasks: tasks_dress_other_self,
  },

  dress_self_other: {
    enabled: true,
    weight: 2,
    tasks: tasks_dress_self_other,
  },

  expose: {
    enabled: true,
    weight: 10,
    tasks: [],
  },
};

// ——— helpers ———
// Gewogen pick van [{ value, weight }, ...]
function weightedRandomEntry(entries) {
  const list = Array.isArray(entries)
    ? entries.filter((e) => (e?.weight ?? 0) > 0)
    : [];
  if (list.length === 0) return null;
  const total = list.reduce((s, e) => s + (e.weight || 0), 0);
  let r = Math.random() * total;
  for (const e of list) {
    r -= e.weight || 0;
    if (r <= 0) return e;
  }
  return list[list.length - 1];
}

function pickFromWeights(arr) {
  const valid = Array.isArray(arr)
    ? arr.filter(
        (x) =>
          Number(x?.weight) > 0 &&
          (x?.value !== undefined || x?.key !== undefined)
      )
    : [];

  if (valid.length === 0) return null;

  const total = valid.reduce((s, x) => s + Number(x.weight), 0);
  let roll = Math.random() * total;

  for (const it of valid) {
    roll -= Number(it.weight);
    if (roll <= 0) {
      // return een betekenisvolle payload; bij jou is .value "STAGE_ENUM.*"
      return it.value ?? it.key ?? it;
    }
  }
  const last = valid[valid.length - 1];
  return last.value ?? last.key ?? last;
}

function getRandomGameContext(gameWeights = {}) {
  const pick = (arr) =>
    Array.isArray(arr) && arr.length > 0 ? pickFromWeights(arr) : null;

  return {
    stage: pick(gameWeights.stage),
    intensity: pick(gameWeights.intensity),
    extremity: pick(gameWeights.extremity),
    act_with: pick(gameWeights.act_with),
    act_on: pick(gameWeights.act_on),
  };
}

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

function matchesConditions(task, gameSettings, chosenCtx) {
  const conds = task?.conditions || {};
  if (!gameSettings) return true;

  // Helpers
  const mustContainOrEmpty = (key, selectedVal) => {
    const vals = conds[key];
    if (!Array.isArray(vals) || vals.length === 0) return true; // leeg = altijd oké
    return vals.includes(selectedVal);
  };

  const mustBeSubset = (key) => {
    const req = conds[key];
    if (!Array.isArray(req) || req.length === 0) return true;
    const enabled = new Set(
      Array.isArray(gameSettings[key]) ? gameSettings[key] : []
    );
    return req.every((v) => enabled.has(v));
  };

  const orOverlap = (key) => {
    const vals = conds[key];
    if (!Array.isArray(vals) || vals.length === 0) return true;
    const enabled = Array.isArray(gameSettings[key]) ? gameSettings[key] : [];
    return arraysIntersect(vals, enabled);
  };

  // 1) Specifieke eis: gekozen stage/intensity/extremity moeten in taak staan óf taak is leeg op die sleutel
  if (chosenCtx?.stage && !mustContainOrEmpty("stage", chosenCtx.stage))
    return false;
  if (
    chosenCtx?.intensity &&
    !mustContainOrEmpty("intensity", chosenCtx.intensity)
  )
    return false;
  if (
    chosenCtx?.extremity &&
    !mustContainOrEmpty("extremity", chosenCtx.extremity)
  )
    return false;

  // 2) Specifieke eis: act_with / act_on moeten SUBSET zijn van settings
  if (!mustBeSubset("act_with")) return false;
  if (!mustBeSubset("act_on")) return false;

  // 3) Overige keys blijven de oude logica (OR binnen de key)
  for (const [key, values] of Object.entries(conds)) {
    if (
      key === "stage" ||
      key === "intensity" ||
      key === "extremity" ||
      key === "act_with" ||
      key === "act_on"
    ) {
      continue; // al gedaan
    }
    if (!Array.isArray(values) || values.length === 0) continue;
    if (!orOverlap(key)) return false;
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

function fillInstructionArgsForParticipants(task) {
  for (const part of task.participants) {
    const slot = part.slot ?? "none";
    task.instruction_args[slot] = part.player.name;
  }
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helpers: clamp, operation, afronding
function clampMin(v, min = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(min, n) : min;
}

function roundDecimals(value, decimals = 3) {
  const f = Math.pow(10, decimals);
  return Math.round((Number(value) || 0) * f) / f;
}

function clampRange(v, min = 1, max = 10) {
  const n = Number(v);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function applyOp(current, op, value) {
  const x = Number(current) || 0;
  const v = Number(value) || 0;
  switch (op) {
    case "add":
      return x + v;
    case "sub":
      return x - v;
    case "mult":
      return x * v;
    default:
      return x;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  applyGameWeightDelta(bucket, match, op, value, min, max, range, includeSelf, decimals)
//  ----------------------------------------------------
//  Wijzigt één of meerdere gewichten in window.GAME.game.weights[bucket],
//  gebaseerd op een specifieke match of een bereik ten opzichte van die match.
//
//  • bucket       → de contextgroep (stage/intensity/extremity/act_with/act_on)
//  • match        → enum-key of -value als pivot
//  • op           → "add" | "sub" | "mult"
//  • value        → numerieke operand
//  • min/max      → clamps (standaard 1–10)
//  • range        → null = enkel match, "higher" = boven pivot, "lower" = onder pivot
//  • includeSelf  → bepaalt of de match zelf ook meedoet in de range
//  • decimals     → aantal decimalen voor afronding (default 3)
//
//  Het gebruikt de volgorde van de bijbehorende enum uit enums.js
//  (bijv. STAGE_ENUM) om te bepalen wat “hoger” of “lager” betekent.
//  Ontbrekende enum-entries in game.weights worden automatisch genegeerd.
//  Wordt aangeroepen door het effecttype "weight.game".
// ─────────────────────────────────────────────────────────────────────────────
function applyGameWeightDelta(
  bucket,
  match,
  op,
  value,
  min = 1,
  max = 10,
  range = null,
  includeSelf = false,
  decimals = 3
) {
  const arr = window?.GAME?.game?.weights?.[bucket];
  if (!Array.isArray(arr) || arr.length === 0) return;

  const enumOrder = getEnumOrder(bucket);
  if (enumOrder.keys.length === 0) return;

  const pivotIdx = getEnumIndex(bucket, match);
  if ((range === "higher" || range === "lower") && pivotIdx < 0) return;

  // ➊ Bepaal de hoogste aanwezige enum-index in deze bucket
  const presentIdxs = [];
  for (const it of arr) {
    const idx = enumOrder.indexByKey.has(it?.key)
      ? enumOrder.indexByKey.get(it.key)
      : enumOrder.indexByValue.has(it?.value)
      ? enumOrder.indexByValue.get(it.value)
      : -1;
    if (idx >= 0) presentIdxs.push(idx);
  }
  const maxPresentIdx = presentIdxs.length ? Math.max(...presentIdxs) : -1;

  for (const item of arr) {
    const itemIdx = enumOrder.indexByKey.has(item?.key)
      ? enumOrder.indexByKey.get(item.key)
      : enumOrder.indexByValue.has(item?.value)
      ? enumOrder.indexByValue.get(item.value)
      : -1;
    if (itemIdx < 0) continue;

    let eligible = false;
    if (range === "higher") {
      eligible = includeSelf ? itemIdx >= pivotIdx : itemIdx > pivotIdx;
    } else if (range === "lower") {
      eligible = includeSelf ? itemIdx <= pivotIdx : itemIdx < pivotIdx;
    } else {
      eligible = item?.key === match || item?.value === match;
    }
    if (!eligible) continue;

    // ➋ Bereken nieuw gewicht
    const current = Number(item.weight) || 0;
    let nextRaw = applyOp(current, op, value);

    // ➌ Als dit de hoogste aanwezige enum is, blokkeer elke daling
    //    (ongeacht op: add/sub/mult). Vergelijk op raw voor eerlijke check.
    if (itemIdx === maxPresentIdx && nextRaw < current) {
      nextRaw = current; // geen vermindering toestaan
    }

    const next = clampRange(roundDecimals(nextRaw, decimals), min, max);
    item.weight = next;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
//  applyCategoryWeightDelta(category, op, value, min, max, decimals)
//  ----------------------------------------------------
//  Past het gewicht van één categorie in window.GAME.tasks aan.
//
//  • category → string, categorie-sleutel (bijv. "undress_other_self")
//  • op       → "add" | "sub" | "mult"
//  • value    → numerieke operand voor de operatie
//  • min/max  → clamps (standaard 1–10)
//  • decimals → aantal decimalen om te behouden (default 3)
//
//  Wordt aangeroepen door het effecttype "weight.category".
// ─────────────────────────────────────────────────────────────────────────────
function applyCategoryWeightDelta(
  category,
  op,
  value,
  min = 1,
  max = 10,
  decimals = 3
) {
  const cat = window?.GAME?.tasks?.[category];
  if (!cat) return;
  const nextRaw = applyOp(cat.weight, op, value);
  const next = clampRange(roundDecimals(nextRaw, decimals), min, max);
  cat.weight = next;
}

// enum-volgorde ophalen (keys én values)
function getEnumForBucket(bucket) {
  // importeer je enums bovenin tasks.js:
  // import { STAGE_ENUM, INTENSITY_ENUM, EXTREMITY_ENUM, ACT_WITH_ENUM, ACT_ON_ENUM } from "./enums.js";
  switch (bucket) {
    case "stage":
      return STAGE_ENUM;
    case "intensity":
      return INTENSITY_ENUM;
    case "extremity":
      return EXTREMITY_ENUM;
    case "act_with":
      return ACT_WITH_ENUM;
    case "act_on":
      return ACT_ON_ENUM;
    default:
      return null;
  }
}

function getEnumOrder(bucket) {
  const E = getEnumForBucket(bucket);
  if (!E)
    return {
      keys: [],
      values: [],
      indexByKey: new Map(),
      indexByValue: new Map(),
    };

  // behoudt declaratie-volgorde
  const keys = Object.keys(E); // ["INNOCENT","PLAYFUL",...]
  const values = Object.values(E); // ["STAGE_ENUM.INNOCENT", "STAGE_ENUM.PLAYFUL", ...]
  const indexByKey = new Map(keys.map((k, i) => [k, i]));
  const indexByValue = new Map(values.map((v, i) => [v, i]));
  return { keys, values, indexByKey, indexByValue };
}

function getEnumIndex(bucket, match) {
  const { indexByKey, indexByValue } = getEnumOrder(bucket);
  if (indexByKey.has(match)) return indexByKey.get(match);
  if (indexByValue.has(match)) return indexByValue.get(match);
  return -1;
}

// Main
export function getTasksModel() {
  return deepCopy(TASKS_MODEL);
}

export function generateTasks() {
  const storedTask = window.GAME?.game?.currentTask ?? null;
  if (storedTask) return storedTask;

  const tasksModel = window.GAME?.tasks ?? {};
  const gameSettings = window.GAME?.game?.settings ?? {};
  const gameWeights = window.GAME?.game?.weights ?? {};
  const { loser, winners } = getRoundResult();

  // lokaal hulpfunctietje om de pool te bouwen voor een gegeven ctx
  const buildPoolForCtx = (ctx) => {
    const pool = [];

    for (const [catKey, cat] of Object.entries(tasksModel)) {
      if (!cat?.enabled) continue;
      if (!Array.isArray(cat.tasks) || cat.tasks.length === 0) continue;

      const categoryWeight = Number(cat.weight) || 0;

      for (const task of cat.tasks) {
        if (task?.enabled === false) continue;
        if (!(task?.participants?.length > 0)) continue;

        const catWeightEffective = effectiveCategoryWeight(
          categoryWeight,
          task,
          gameWeights
        );

        // 1) conditions
        if (!matchesConditions(task, gameSettings, ctx)) continue;

        // 2) participants -> candidates
        const partsWithCandidates = buildParticipantCandidates(
          task.participants,
          loser,
          winners
        );

        // loser-slot moet exact de echte loser zijn
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

        // 4) preferSex (alleen als taak dit eist)
        if (needsPreferSex(task) && !preferSexMatrixOk(assigned)) continue;

        // 5) effects haalbaar?
        if (!evaluateTaskEffects(task, assigned)) continue;

        // 6) uitvoerbaar -> in pool
        const taskCopy = structuredClone(task);
        taskCopy.participants = assigned;
        fillInstructionArgsForParticipants(taskCopy);

        pool.push({
          task: taskCopy,
          category: catKey,
          weight: catWeightEffective,
        });
      }
    }
    return pool;
  };

  const maxAttempts = 3; // 1 + 2 retries
  let attempts = 0;
  let chosenCtx = null;
  let pool = [];

  // probeer met (nieuwe) chosenCtx
  while (attempts < maxAttempts) {
    chosenCtx = getRandomGameContext(gameWeights);
    pool = buildPoolForCtx(chosenCtx);
    if (pool.length > 0) break;
    attempts++;
  }

  // fallback: lege ctx (match alles)
  if (pool.length === 0) {
    chosenCtx = {}; // geen filters
    pool = buildPoolForCtx(chosenCtx);
  }

  // pick (optioneel: shuffleInPlace(pool) als je ooit gaat slicen/croppen)
  const pickedEntry = weightedPick(pool);
  return {
    chosenCtx,
    picked: pickedEntry ? pickedEntry.task : null,
    pool,
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
      // weight effects blokkeren nooit de uitvoerbaarheid
      case "weight.category":
      case "weight.game":
        // altijd “pass”
        break;
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
    switch (effect.type) {
      case "clothing.remove": {
        const part = findParticipantBySlot(partsAssigned, effect.slot);
        if (!part?.player?.clothing) continue;
        const piece = part.player.clothing[effect.item];
        if (piece) piece.worn = false;
        break;
      }
      case "clothing.add": {
        const part = findParticipantBySlot(partsAssigned, effect.slot);
        if (!part?.player?.clothing) continue;
        const piece = part.player.clothing[effect.item];
        if (piece) piece.worn = true;
        break;
      }
      case "weight.category": {
        // ─────────────────────────────────────────────────────────────────────────────
        //  Effect type: weight.category
        //  ----------------------------------------------------
        //  Past het gewicht van een specifieke taken-categorie aan in window.GAME.tasks.
        //  Gebruik om de kans op taken uit een categorie te verhogen of te verlagen.
        //
        //  Voorbeeld:
        //    { type: "weight.category", category: "undress_other_self", op: "add", value: 0.5 }
        //
        //  Parameters:
        //    category   → de sleutelnaam van de categorie (zoals in window.GAME.tasks).
        //    op         → "add" | "sub" | "mult"  → bepaalt de bewerking.
        //    value      → numerieke waarde voor de operatie.
        //    min, max   → optioneel bereik (standaard 1.0–10.0) waar de uitkomst binnen blijft.
        //    decimals   → aantal decimalen (default 3) voor afronding.
        // ─────────────────────────────────────────────────────────────────────────────
        const {
          category,
          op,
          value,
          min = 0.1,
          max = 10,
          decimals = 3,
        } = effect || {};
        if (category && op)
          applyCategoryWeightDelta(category, op, value, min, max, decimals);
        break;
      }
      case "weight.game": {
        // ─────────────────────────────────────────────────────────────────────────────
        //  Effect type: weight.game
        //  ----------------------------------------------------
        //  Past het gewicht aan van een context-bucket binnen window.GAME.game.weights.
        //  Hiermee beïnvloed je bijvoorbeeld de kans op bepaalde stages of intensities.
        //
        //  Voorbeelden:
        //    - Exacte match (alleen deze entry aanpassen):
        //        { type:"weight.game", bucket:"stage", match:"STAGE_ENUM.PLAYFUL", op:"add", value:0.25 }
        //
        //    - Alles boven een pivot (op basis van enum-volgorde) verlagen:
        //        { type:"weight.game", bucket:"stage", match:"PLAYFUL", range:"higher", op:"mult", value:0.8 }
        //
        //  Parameters:
        //    bucket       → "stage" | "intensity" | "extremity" | "act_with" | "act_on"
        //    match        → key of value van de enum (zoals "PLAYFUL" of "STAGE_ENUM.PLAYFUL")
        //    op           → "add" | "sub" | "mult"
        //    value        → numerieke waarde voor de operatie
        //    range        → optioneel "higher" of "lower" om alles boven/onder de match te bewerken
        //    includeSelf  → true/false (of de match zelf ook mee moet doen in de range)
        //    min, max     → optioneel bereik (standaard 1.0–10.0)
        //    decimals     → aantal decimalen (default 3) voor afronding
        // ─────────────────────────────────────────────────────────────────────────────
        const {
          bucket,
          match,
          op,
          value,
          min = 0.1,
          max = 10,
          range = null,
          includeSelf = false,
          decimals = 3,
        } = effect || {};
        if (bucket && op) {
          if (!match && !range) break; // exacte match vereist als geen range
          applyGameWeightDelta(
            bucket,
            match,
            op,
            value,
            min,
            max,
            range,
            includeSelf,
            decimals
          );
        }
        break;
      }
    }
  }
}

function createSecretTaskElement(task) {
  const wrapper = document.createElement("div");
  wrapper.className = "col";
  wrapper.id = "secretTaskContainer";

  // loser panel
  const loserSpan = document.createElement("span");
  loserSpan.setAttribute("data-i18n", "app.task.secret.loser");
  loserSpan.setAttribute("data-i18n-target", "html");

  // task details
  const taskDetailsWrapper = document.createElement("div");
  taskDetailsWrapper.id = "taskDetailsContainer";
  taskDetailsWrapper.className = "row muted";

  // task detail explanation
  const taskDetailsExWrapper = document.createElement("div");
  taskDetailsExWrapper.id = "taskDetailsExContainer";
  taskDetailsExWrapper.className = "col muted";

  // Fill task details and explanation
  const taskID = document.createElement("span");
  taskID.setAttribute("data-i18n-auto", "app.task.detail.id");
  taskID.setAttribute("data-i18n-args", JSON.stringify({ taskID: task.id }));
  taskDetailsWrapper.append(taskID);

  const ctx = window.GAME?.game?.currentTask?.chosenCtx;

  if (ctx?.stage) {
    const stage = document.createElement("span");
    stage.setAttribute("data-i18n-auto", "app.task.detail.stage");
    stage.setAttribute(
      "data-i18n-args",
      JSON.stringify({ taskStage: `{${ctx.stage}.name}` })
    );
    taskDetailsWrapper.append(stage);

    const stageEx = document.createElement("span");
    stageEx.setAttribute("data-i18n", "app.task.detail.explanation");
    stageEx.setAttribute("data-i18n-target", "html");
    stageEx.setAttribute(
      "data-i18n-args",
      JSON.stringify({
        taskDetail: `{${ctx.stage}.name}`,
        taskDetailDesc: `{${ctx.stage}.desc}`,
      })
    );
    taskDetailsExWrapper.append(stageEx);
  }

  if (ctx?.intensity) {
    const intensity = document.createElement("span");
    intensity.setAttribute("data-i18n-auto", "app.task.detail.intensity");
    intensity.setAttribute(
      "data-i18n-args",
      JSON.stringify({ taskIntensity: `{${ctx.intensity}.name}` })
    );
    taskDetailsWrapper.append(intensity);

    const intensityEx = document.createElement("span");
    intensityEx.setAttribute("data-i18n", "app.task.detail.explanation");
    intensityEx.setAttribute("data-i18n-target", "html");
    intensityEx.setAttribute(
      "data-i18n-args",
      JSON.stringify({
        taskDetail: `{${ctx.intensity}.name}`,
        taskDetailDesc: `{${ctx.intensity}.desc}`,
      })
    );
    taskDetailsExWrapper.append(intensityEx);
  }

  if (ctx?.extremity) {
    const extremity = document.createElement("span");
    extremity.setAttribute("data-i18n-auto", "app.task.detail.extremity");
    extremity.setAttribute(
      "data-i18n-args",
      JSON.stringify({ taskExtremity: `{${ctx.extremity}.name}` })
    );
    taskDetailsWrapper.append(extremity);

    const extremityEx = document.createElement("span");
    extremityEx.setAttribute("data-i18n", "app.task.detail.explanation");
    extremityEx.setAttribute("data-i18n-target", "html");
    extremityEx.setAttribute(
      "data-i18n-args",
      JSON.stringify({
        taskDetail: `{${ctx.extremity}.name}`,
        taskDetailDesc: `{${ctx.extremity}.desc}`,
      })
    );
    taskDetailsExWrapper.append(extremityEx);
  }

  // secretInstruction
  const secretTaskInstruction = document.createElement("p");
  secretTaskInstruction.setAttribute(
    "data-i18n",
    "app.task.secret.taskInstruction"
  );
  secretTaskInstruction.setAttribute("data-i18n-target", "html");

  // participating players
  const participatingPlayers = document.createElement("div");
  participatingPlayers.className = "row";

  const participatingPlayersLabel = document.createElement("span");
  participatingPlayersLabel.setAttribute(
    "data-i18n-auto",
    "app.task.secret.participatingPlayers"
  );

  participatingPlayers.append(participatingPlayersLabel);

  // instruction per participant
  const secretWrapper = document.createElement("div");
  secretWrapper.id = "secretInstructionContainer";
  secretWrapper.className = "col";

  for (const part of task.participants) {
    if (part.secretInstructionKey) {
      const details = document.createElement("details");
      details.className = "col";

      const summary = document.createElement("summary");
      summary.setAttribute("data-i18n", "app.task.secret.summary");
      summary.setAttribute("data-i18n-target", "html");
      summary.setAttribute(
        "data-i18n-args",
        JSON.stringify({ player: part.player.name })
      );

      const p = document.createElement("p");
      p.setAttribute("data-i18n-auto", part.secretInstructionKey);
      p.setAttribute("data-i18n-args", JSON.stringify(task.instruction_args));

      // Body content
      const b = document.createElement("div");
      b.className = "col";

      b.append(taskDetailsWrapper, p, taskDetailsExWrapper);

      details.append(summary, b);

      secretWrapper.append(details);
    }

    // participatingPlayers
    const partPlayerLabel = document.createElement("span");
    partPlayerLabel.innerHTML = `<b>${part.player.name}</b>`;
    participatingPlayers.append(partPlayerLabel);

    // loser label
    if (part.slot === "loser") {
      loserSpan.setAttribute(
        "data-i18n-args",
        JSON.stringify({ loser: part.player.name })
      );
    }
  }

  // Execution element
  const execElement = buildTaskExecutionElement(task);

  // Finish
  wrapper.append(
    loserSpan,
    makeSeperator(),
    secretTaskInstruction,
    makeSeperator(),
    participatingPlayers,
    makeSeperator(),
    secretWrapper,
    makeSeperator(),
    execElement,
  );
  return wrapper;
}

function createTaskElement(task) {
  const wrapper = document.createElement("div");
  wrapper.className = "col";
  wrapper.id = "secretTaskContainer";

  // loser panel
  const loserWrap = document.createElement("div");
  loserWrap.className = "col small";
  loserWrap.id = "loserContainer";

  const loserHeader = document.createElement("h3");
  setI18n(loserHeader, "app.task.global.loser.header");

  const loserContent = document.createElement("p");

  loserWrap.append(loserHeader, loserContent);

  // task details
  const taskDetailsWrapper = document.createElement("div");
  taskDetailsWrapper.id = "taskDetailsContainer";
  taskDetailsWrapper.className = "row muted";

  // task detail explanation
  const taskDetailsExWrapper = document.createElement("div");
  taskDetailsExWrapper.id = "taskDetailsExContainer";
  taskDetailsExWrapper.className = "col muted";

  // Fill task details and explanation
  const taskID = document.createElement("span");
  setI18n(taskID, "app.task.detail.id", { taskID: task.id });
  taskDetailsWrapper.append(taskID);

  const ctx = window.GAME?.game?.currentTask?.chosenCtx;

  if (ctx?.stage) {
    const stage = document.createElement("span");
    setI18n(stage, "app.task.detail.stage", {
      taskStage: `{${ctx.stage}.name}`,
    });
    taskDetailsWrapper.append(stage);

    const stageEx = document.createElement("span");
    setI18n(
      stageEx,
      "app.task.detail.explanation",
      {
        taskDetail: `{${ctx.stage}.name}`,
        taskDetailDesc: `{${ctx.stage}.desc}`,
      },
      "html"
    );
    taskDetailsExWrapper.append(stageEx);
  }

  if (ctx?.intensity) {
    const intensity = document.createElement("span");
    setI18n(intensity, "app.task.detail.intensity", {
      taskIntensity: `{${ctx.intensity}.name}`,
    });
    taskDetailsWrapper.append(intensity);

    const intensityEx = document.createElement("span");
    setI18n(
      intensityEx,
      "app.task.detail.explanation",
      {
        taskDetail: `{${ctx.intensity}.name}`,
        taskDetailDesc: `{${ctx.intensity}.desc}`,
      },
      "html"
    );
    taskDetailsExWrapper.append(intensityEx);
  }

  if (ctx?.extremity) {
    const extremity = document.createElement("span");
    setI18n(extremity, "app.task.detail.extremity", {
      taskExtremity: `{${ctx.extremity}.name}`,
    });
    taskDetailsWrapper.append(extremity);

    const extremityEx = document.createElement("span");
    setI18n(
      extremityEx,
      "app.task.detail.explanation",
      {
        taskDetail: `{${ctx.extremity}.name}`,
        taskDetailDesc: `{${ctx.extremity}.desc}`,
      },
      "html"
    );
    taskDetailsExWrapper.append(extremityEx);
  }

  // participating players
  const participatingPlayers = document.createElement("div");
  participatingPlayers.className = "row";

  const participatingPlayersLabel = document.createElement("span");
  setI18n(participatingPlayersLabel, "app.task.secret.participatingPlayers");

  participatingPlayers.append(participatingPlayersLabel);

  // global instruction
  const globalWrapper = document.createElement("div");
  globalWrapper.id = "globalInstructionContainer";
  globalWrapper.className = "col";

  const p = document.createElement("p");
  setI18n(
    p,
    "app.task.global.instruction",
    {
      globalTaskInstruction: `{${task.instructionKey}}`,
      ...task.instruction_args,
    },
    "html"
  );

  // Find loser
  for (const part of task.participants) {
    // participatingPlayers
    const partPlayerLabel = document.createElement("span");
    partPlayerLabel.innerHTML = `${part.player.name}`;
    participatingPlayers.append(partPlayerLabel);

    // loser label
    if (part.slot === "loser") {
      loserContent.textContent = part.player.name;
    }
  }

  globalWrapper.append(taskDetailsWrapper, p, taskDetailsExWrapper);

  // Execution element
  const execElement = buildTaskExecutionElement(task);

  // Finish
  wrapper.append(
    loserWrap,
    makeSeperator(),
    participatingPlayers,
    makeSeperator(),
    globalWrapper,
    makeSeperator(),
    execElement,
  );
  return wrapper;
}

export function buildTaskPanel(targetId = "task_content") {
  const root = document.getElementById(targetId);
  if (!root) return;

  root.innerHTML = "";

  const generatedTask = generateTasks();
  if (!generatedTask.picked) return;

  // secret or normal
  const useSecret = window.GAME?.game?.settings?.secretTasks ?? false;
  if (useSecret) {
    root.append(createSecretTaskElement(generatedTask.picked));
  } else {
    root.append(createTaskElement(generatedTask.picked));
  }

  // Store current task to gamestate
  window.GAME.game.currentTask = generatedTask;

  switchPanel("task");
}
