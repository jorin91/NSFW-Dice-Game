import { deepCopy } from "./utils.js";
import { storageSave, storageLoad, storageClear } from "./localstorage.js";
import { showPanel } from "./panelnavigation.js";
import {
  getSettingStages,
  getSettingIntensity,
  getSettingExtremity,
  getSettingAct,
} from "./settings.js";
import { SEX_ENUM } from "./enums.js";
import { CLOTHING_MODEL } from "./clothing.js";
import { getTasksModel } from "./tasks.js";

const LS_KEY_GAMESTATE = "NSFWDiceGame_GameState";

export const GAME_FLOW_MODEL = {
  version: 1,
  activePanel: "mainmenu",
  players: [
    {
      id: 111,
      name: "Debug1",
      age: 21,
      sex: SEX_ENUM.Male,
      preferSex: SEX_ENUM.Both,
      consent: true,
      score: 0,
      safe: false,
      clothing: deepCopy(CLOTHING_MODEL),
    },
    {
      id: 222,
      name: "Debug2",
      age: 22,
      sex: SEX_ENUM.Female,
      preferSex: SEX_ENUM.Both,
      consent: true,
      score: 1,
      safe: false,
      clothing: deepCopy(CLOTHING_MODEL),
    },
    {
      id: 333,
      name: "Debug3",
      age: 23,
      sex: SEX_ENUM.Male,
      preferSex: SEX_ENUM.Both,
      consent: true,
      score: 2,
      safe: false,
      clothing: deepCopy(CLOTHING_MODEL),
    },
    {
      id: 444,
      name: "Debug4",
      age: 24,
      sex: SEX_ENUM.Female,
      preferSex: SEX_ENUM.Both,
      consent: true,
      score: 3,
      safe: false,
      clothing: deepCopy(CLOTHING_MODEL),
    },
  ], // je kunt hier straks createPlayer() instances in zetten
  settings: {
    stage: getSettingStages(),
    intensity: getSettingIntensity(),
    extremity: getSettingExtremity(),
    act: getSettingAct(),
    secretTasks: true, // hiermee bepalen we of de opdracht algemeen is of alleen voor de uitvoerder en de rest niets weet, verrassings element
    rolls: 3,
    score: 3,
    dices: 5,
  }, // later: maxRolls, pointsToSafe, enz.
  tasks: getTasksModel(),
  game: {
    // Settings game started with
    stage: null,
    intensity: null,
    extremity: null,
    act: null,
    secretTasks: null,
    rolls: null,
    score: null,
    dices: null,
    // Game State
    round: 0,
    turnIndex: 0,
    diceSet: [],
  },
};

export function gameGetState() {
  return deepCopy(window.GAME);
}

export function gameApplyState(state) {
  // start vanuit het model om ontbrekende velden te vullen
  window.GAME = deepCopy(GAME_FLOW_MODEL);
  Object.assign(window.GAME, state || {});
}

export function gameSaveState() {
  storageSave(gameGetState(), LS_KEY_GAMESTATE);
}

export function gameInitFromStorage() {
  const saved = storageLoad(LS_KEY_GAMESTATE);
  if (saved) {
    gameApplyState(saved);
    showPanel(window.GAME.activePanel || "mainmenu");
  } else {
    // eerste keer: toon hoofdmenu en sla meteen initiele state op
    window.GAME = deepCopy(GAME_FLOW_MODEL);
    showPanel("mainmenu");
    storageSave(gameGetState(), LS_KEY_GAMESTATE);
  }
}

export function resetGameState() {
  storageClear(LS_KEY_GAMESTATE);
  gameInitFromStorage();
}
