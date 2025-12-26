import { firebaseDB } from "./firebase-init.js";
import {
  ref,
  get,
  set,
  update,
  remove,
  onValue,
  onDisconnect,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

/**
 * Maakt een ref naar een pad in de database.
 * - accepteert een string ("games/123/players")
 * - of een array van segmenten (["games", gameCode, "players", playerId])
 */
function dbRef(pathOrSegments) {
  if (Array.isArray(pathOrSegments)) {
    const cleaned = pathOrSegments
      .filter(Boolean) // null/undefined/"" eruit
      .map((p) => String(p).trim()) // naar string
      .join("/");
    return ref(firebaseDB, cleaned);
  }

  const path = String(pathOrSegments || "")
    .replace(/^\/+/, "") // leading slashes weg
    .replace(/\/+$/, ""); // trailing slashes weg

  return ref(firebaseDB, path || "/");
}

/**
 * Volledig overschrijven op een pad.
 * Voorbeeld: dbSet(["games", gameCode], {...})
 */
export function dbSet(pathOrSegments, value) {
  return set(dbRef(pathOrSegments), value);
}

/**
 * Alleen bepaalde velden bijwerken.
 * Voorbeeld: dbUpdate(["games", gameCode], { status: "running" })
 */
export function dbUpdate(pathOrSegments, partial) {
  return update(dbRef(pathOrSegments), partial);
}

/**
 * Waarde verwijderen op een pad.
 * Voorbeeld: dbRemove(["games", gameCode, "players", playerId])
 */
export function dbRemove(pathOrSegments) {
  return remove(dbRef(pathOrSegments));
}

/**
 * Eénmalig uitlezen.
 * Geeft de "kale" value terug (of null als het niet bestaat).
 */
export async function dbGet(pathOrSegments) {
  const snapshot = await get(dbRef(pathOrSegments));
  if (!snapshot.exists()) return null;
  return snapshot.val();
}

/**
 * Abonneren op wijzigingen van een pad.
 * - callback(value, snapshot)
 * - value is snapshot.val() of null als het pad verwijderd is
 * - retourneert een unsubscribe-functie
 *
 * Voorbeeld:
 *   const stop = subscribeValue(["games", code], game => { ... });
 *   // later: stop();
 */
export function subscribeValue(pathOrSegments, callback) {
  const r = dbRef(pathOrSegments);

  const unsubscribe = onValue(r, (snapshot) => {
    const value = snapshot.exists() ? snapshot.val() : null;
    callback(value, snapshot);
  });

  return unsubscribe;
}
