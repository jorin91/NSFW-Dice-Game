import { deepCopy } from "./utils.js";
import { storageSave, storageLoad } from "./localstorage.js";
import { showPanel } from "./panelnavigation.js";
import {
  getSettingStages,
  getSettingIntensity,
  getSettingExtremity,
  getSettingAct,
} from "./settings.js";
import { SEX_ENUM } from "./enums.js";
import { CLOTHING_MODEL } from "./clothing.js";

const LS_KEY_GAMESTATE = "NSFWDiceGame_GameState";

export const GAME_FLOW_MODEL = {
  version: 1,
  activePanel: "mainmenu",
  round: 0,
  turnIndex: 0,
  players: [
    {
      id: 10077,
      name: "Jan",
      age: 24,
      sex: SEX_ENUM.Male,
      preferSex: SEX_ENUM.Female,
      consent: true,
      score: 0,
      safe: false,
      clothing: deepCopy(CLOTHING_MODEL),
    },
  ], // je kunt hier straks createPlayer() instances in zetten
  settings: {
    stage: getSettingStages(),
    intensity: getSettingIntensity(),
    extremity: getSettingExtremity(),
    act: getSettingAct(),
  }, // later: maxRolls, pointsToSafe, enz.
  tasks: {},
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
    showPanel("mainmenu");
    storageSave(gameGetState(), LS_KEY_GAMESTATE);
  }
}
