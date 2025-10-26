function gameGetState() {
  return deepCopy(window.GAME);
}

function gameApplyState(state) {
  // start vanuit het model om ontbrekende velden te vullen
  window.GAME = deepCopy(GAME_FLOW_MODEL);
  Object.assign(window.GAME, state || {});
}

function gameSetActivePanel(key) {
  window.GAME.activePanel = key;
  storageSaveGame(gameGetState());
}

function gameInitFromStorage() {
  const saved = storageLoadGame();
  if (saved) {
    gameApplyState(saved);
    showPanel(window.GAME.activePanel || "mainmenu");
  } else {
    // eerste keer: toon hoofdmenu en sla meteen initiele state op
    showPanel("mainmenu");
    storageSaveGame(gameGetState());
  }
}

// Init bij laden
window.GAME = deepCopy(GAME_FLOW_MODEL);
document.addEventListener("DOMContentLoaded", gameInitFromStorage);
