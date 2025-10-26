import { deepCopy } from "./utils.js";
import { storageSave, storageLoad } from "./localstorage.js";
import { showPanel } from "./panelnavigation.js";

const LS_KEY_GAMESTATE = "NSFWDiceGame_GameState";

export const GAME_FLOW_MODEL = {
  version: 1,
  activePanel: "mainmenu",
  round: 0,
  turnIndex: 0,
  players: [], // je kunt hier straks createPlayer() instances in zetten
  settings: {}, // later: maxRolls, pointsToSafe, enz.
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

export function gameSetActivePanel(key) {
  window.GAME.activePanel = key;
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
