// js/firebase/firebase-game.js
import { GAMESTATE, gameBindToFirebase } from "../gamestate.js";
import { firebaseDB, ref, set, get } from "./firebase-init.js";
import { randomNumberString } from "../utils.js";

/**
 * Check of een game bestaat in Firebase.
 */
async function gameExists(gameID) {
  const gameRef = ref(firebaseDB, `games/${gameID}`);
  const snapshot = await get(gameRef);
  return snapshot.exists();
}

// Bestaat deze gameCode binnen dit gameID?
async function gameCodeMatches(gameID, gameCode) {
  const codeRef = ref(firebaseDB, `games/${gameID}/${gameCode}`);
  const snapshot = await get(codeRef);
  return snapshot.exists();
}

/**
 * Nieuwe game aanmaken.
 * Returned: { success: boolean, message: translationKey }
 */
export async function createGameFB() {
  let gameID = GAMESTATE.gameID;
  let gameCode = GAMESTATE.gameCode;

  if (!gameID) {
    return { success: false, message: "ui.firebase.createGame.noGameID" };
  }

  try {
    // Check of ID al bestaat → zo ja, nieuwe genereren
    while (await gameExists(gameID)) {
      // Je kunt dit eventueel loggen via UI (via returned message)
      GAMESTATE.gameID = randomNumberString(6);
      gameID = GAMESTATE.gameID;
    }

    // Opslaan naar Firebase
    const gameRef = ref(firebaseDB, `games/${gameID}/${gameCode}`);
    await set(gameRef, GAMESTATE);

    // Lokale binding
    gameBindToFirebase(gameID, gameCode);

    return { success: true, message: "ui.firebase.createGame.success" };
  } catch (err) {
    console.error("createGame error:", err);
    return { success: false, message: "ui.firebase.createGame.error" };
  }
}

/**
 * Join een bestaande game.
 * Returned: { success: boolean, message: translationKey }
 */
export async function joinGameFB(gameID, gameCode) {
  if (!gameID || !gameCode) {
    return { success: false, message: "ui.firebase.joinGame.noGameIDCode" };
  }

  try {
    if (!(await gameExists(gameID))) {
      return { success: false, message: "ui.firebase.joinGame.notFoundID" };
    }

    if (!(await gameCodeMatches(gameID, gameCode))) {
      return { success: false, message: "ui.firebase.joinGame.wrongCode" };
    }

    gameBindToFirebase(gameID, gameCode);
    return { success: true, message: "ui.firebase.joinGame.success" };
  } catch (err) {
    console.error("joinGame error:", err);
    return { success: false, message: "ui.firebase.joinGame.error" };
  }
}

// Alle games ophalen als lijst van alleen gameIDs
export async function listGames() {
  try {
    const gamesRef = ref(firebaseDB, "games");
    const snapshot = await get(gamesRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val() || {};
    // data = { [gameID]: { [gameCode]: { ...state } } }

    return Object.keys(data); // alleen ID’s teruggeven
  } catch (err) {
    console.error("listGames error:", err);
    return [];
  }
}