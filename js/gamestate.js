import { deepCopy } from "./utils.js";
import { storageSave, storageLoad, storageClear } from "./localstorage.js";

const LS_KEY_GAMESTATE = "NSFWDiceGame_GameState";

export const GAMESTATE_MODEL = {
  version: 1.0,
  language: "nl",
};

export function gameGetState() {
  return deepCopy(window.GAMESTATE);
}

export function gameApplyState(state) {
  // start vanuit het model om ontbrekende velden te vullen
  window.GAMESTATE = deepCopy(GAMESTATE_MODEL);
  Object.assign(window.GAMESTATE, state || {});
}

export function gameSaveState() {
  storageSave(gameGetState(), LS_KEY_GAMESTATE);
}

export function gameInitFromStorage() {
  const saved = storageLoad(LS_KEY_GAMESTATE);

  // Geen state of versie mismatch → reset naar model
  if (!saved || saved.version !== GAMESTATE_MODEL.version) {
    window.GAMESTATE = deepCopy(GAMESTATE_MODEL);
    storageSave(gameGetState(), LS_KEY_GAMESTATE);
    return;
  }

  // Versie klopt → bestaande state toepassen
  gameApplyState(saved);
}

export function resetGameState() {
  storageClear(LS_KEY_GAMESTATE);
  gameInitFromStorage();
}
