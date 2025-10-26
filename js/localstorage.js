const LS_KEY_GAMESTATE = "NSFWDiceGame_GameState";

function storageSaveGame(gameState) {
  try {
    localStorage.setItem(LS_KEY_GAMESTATE, JSON.stringify(gameState));
  } catch {}
}

function storageLoadGame() {
  try {
    const raw = localStorage.getItem(LS_KEY_GAMESTATE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storageClearGame() {
  try {
    localStorage.removeItem(LS_KEY_GAMESTATE);
  } catch {}
}
