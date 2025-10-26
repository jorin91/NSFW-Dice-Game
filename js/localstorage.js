const LS_KEY = "NSFWDiceGame_GameState";

function storageSaveGame(gameState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(gameState));
  } catch {}
}

function storageLoadGame() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storageClearGame() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {}
}
