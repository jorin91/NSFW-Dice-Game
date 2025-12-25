// js/firebase/firebase-game.js
import { GAMESTATE, gameBindToFirebase } from "../gamestate.js";
import { firebaseDB, ref, set, get } from "./firebase-init.js";
import { randomNumberString } from "../utils.js";

/**
 * Check of een game bestaat in Firebase.
 * Dit checkt alleen of de node `games/{gameID}` bestaat.
 */
export async function gameExists(gameID) {
  const gameRef = ref(firebaseDB, `games/${gameID}`);
  const snapshot = await get(gameRef);
  return snapshot.exists();
}

/**
 * Bestaat deze gameCode binnen dit gameID?
 * Dit checkt of `games/{gameID}/{gameCode}` bestaat.
 */
export async function gameCodeMatches(gameID, gameCode) {
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

/**
 * listGames(gameID?, gameCode?)
 *
 * Doel:
 * 1) Zonder argumenten: lijst tonen van beschikbare games om te joinen.
 *    Hierbij is gameCode "geheim" (password/drempel) en wordt dus niet teruggegeven.
 *
 * 2) Met gameID + gameCode: join / consent preview.
 *    Hierbij ken je de code al (ingevoerd door speler) en mag je extra info teruggeven,
 *    zodat je een consent paneel kunt vullen (settings-overzicht).
 *
 * Return type:
 * - Zonder args -> Array<object>
 * - Met beide args -> Object
 * - Nooit null/undefined
 *
 * Returns:
 * - Lijst-flow:
 *   [
 *     { gameID: "79631813", gameName: "JSG Game" },
 *     ...
 *   ]
 *
 * - Join-flow:
 *   {
 *     success: true,
 *     gameID: "79631813",
 *     gameName: "JSG Game",
 *     gameCode: "6150",
 *     settings: { ... }
 *   }
 *
 * - Join-flow errors:
 *   {
 *     success: false,
 *     reason: "game_not_found" | "invalid_game_code" | "state_not_found" | "exception",
 *     gameID,
 *     gameCode
 *   }
 */
export async function listGames(gameID = null, gameCode = null) {
  try {
    const hasID = gameID != null && String(gameID).trim().length > 0;
    const hasCode = gameCode != null && String(gameCode).trim().length > 0;

    // ---------- JOIN / CONSENT FLOW ----------
    // Alleen als beide aanwezig zijn -> single object return
    if (hasID && hasCode) {
      const id = String(gameID).trim();
      const code = String(gameCode).trim();

      const exists = await gameExists(id);
      if (!exists) {
        return { success: false, reason: "game_not_found", gameID: id, gameCode: code };
      }

      const matches = await gameCodeMatches(id, code);
      if (!matches) {
        return { success: false, reason: "invalid_game_code", gameID: id, gameCode: code };
      }

      const stateRef = ref(firebaseDB, `games/${id}/${code}`);
      const snapshot = await get(stateRef);

      if (!snapshot.exists()) {
        return { success: false, reason: "state_not_found", gameID: id, gameCode: code };
      }

      const state = snapshot.val() || {};
      const resolvedGameName =
        state.gameName ??
        state.settings?.gameName ??
        state.settings?.name ??
        null;

      return {
        success: true,
        gameID: id,
        gameName: resolvedGameName,
        gameCode: code,
        settings: state.settings ?? null,
      };
    }

    // ---------- LIST FLOW ----------
    // Als args ontbreken (of maar 1) -> lijst return
    const gamesRef = ref(firebaseDB, "games");
    const snapshot = await get(gamesRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val() || {};
    // data = { [gameID]: { [gameCode]: { ...state } } }

    const list = [];

    for (const id of Object.keys(data)) {
      const byCode = data[id] || {};
      const codes = Object.keys(byCode);

      // Jij zegt: exact 1 code per game. Maar we houden dit safe.
      if (codes.length === 0) continue;

      const onlyCode = codes[0]; // de enige code
      const state = byCode[onlyCode] || {};

      const resolvedGameName =
        state.gameName ??
        state.settings?.gameName ??
        state.settings?.name ??
        null;

      list.push({
        gameID: id,
        gameName: resolvedGameName,
      });
    }

    return list;
  } catch (err) {
    console.error("listGames error:", err);

    const hasID = gameID != null && String(gameID).trim().length > 0;
    const hasCode = gameCode != null && String(gameCode).trim().length > 0;

    if (hasID || hasCode) {
      return {
        success: false,
        reason: "exception",
        gameID: hasID ? String(gameID).trim() : null,
        gameCode: hasCode ? String(gameCode).trim() : null,
      };
    }

    return [];
  }
}