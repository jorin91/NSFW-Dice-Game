// Basis spelverloop-model (kan je later uitbreiden)
const GAME_FLOW_MODEL = {
  version: 1,
  activePanel: "hoofdmenu",
  round: 1,
  turnIndex: 0,
  players: [], // je kunt hier straks createPlayer() instances in zetten
  settings: {}, // later: maxRolls, pointsToSafe, enz.
  tasks: {},
};

// Functions
function deepCopy(o) {
  return JSON.parse(JSON.stringify(o));
}

// Huidige game state in memory
window.GAME = deepCopy(GAME_FLOW_MODEL);

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
    showPanel(window.GAME.activePanel || "hoofdmenu");
  } else {
    // eerste keer: toon hoofdmenu en sla meteen initiele state op
    showPanel("hoofdmenu");
    storageSaveGame(gameGetState());
  }
}

// Init bij laden
document.addEventListener("DOMContentLoaded", gameInitFromStorage);
