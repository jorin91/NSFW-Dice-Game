// js/firebase/firebase-game.js
import { GAMESTATE, gameBindToFirebase } from "../gamestate.js";
import { firebaseDB, ref, set, get } from "./firebase-init.js";
import { randomNumberString } from "../utils.js";

/**
 * Check of een game bestaat in Firebase.
 */
async function gameExists(gameID, gameCode) {
  const gameRef = ref(firebaseDB, `games/${gameID}/${gameCode}`);
  const snapshot = await get(gameRef);
  return snapshot.exists();
}

/**
 * Nieuwe game aanmaken.
 * Returned: { success: boolean, message: translationKey }
 */
export async function createGame() {
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
export async function joinGame(gameID, gameCode) {
  if (!gameID || !gameCode) {
    return { success: false, message: "ui.firebase.joinGame.noGameIDCode" };
  }

  try {
    if (!(await gameExists(gameID, gameCode))) {
      return { success: false, message: "ui.firebase.joinGame.notFound" };
    }

    gameBindToFirebase(gameID, gameCode);
    return { success: true, message: "ui.firebase.joinGame.success" };
  } catch (err) {
    console.error("joinGame error:", err);
    return { success: false, message: "ui.firebase.joinGame.error" };
  }
}
