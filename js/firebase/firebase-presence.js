// js/firebase/firebase-presence.js
import { firebaseDB } from "./firebase-init.js";
import { dbSet, dbUpdate, dbRemove } from "./firebase-db.js";
import {
  ref,
  onValue,
  onDisconnect,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

let _stopConnectedSub = null;
let _heartbeatTimer = null;

let _boundGameID = null;
let _boundGameCode = null;
let _boundPlayerId = null;

/**
 * Start presence voor deze speler in deze game.
 * Schrijft naar: presence/{gameID}/{gameCode}/{playerId}
 *
 * meta is optioneel, bijv. { name: PLAYER.name }
 */
export function startMyPresence(gameID, gameCode, playerId, meta = {}) {
  stopMyPresence(); // safe

  _boundGameID = gameID || null;
  _boundGameCode = gameCode || null;
  _boundPlayerId = playerId || null;

  if (!_boundGameID || !_boundGameCode || !_boundPlayerId) {
    console.warn("[Presence] startMyPresence missing gameID/gameCode/playerId");
    return;
  }

  const connectedRef = ref(firebaseDB, ".info/connected");
  const myPresencePath = ["presence", _boundGameID, _boundGameCode, _boundPlayerId];

  _stopConnectedSub = onValue(connectedRef, (snap) => {
    const connected = !!snap.val();
    if (!connected) return;

    const presenceRef = ref(firebaseDB, myPresencePath.join("/"));

    // bij disconnect: node weg
    onDisconnect(presenceRef).remove();

    // init write
    dbSet(myPresencePath, {
      online: true,
      lastSeen: Date.now(),
      ...meta,
    });

    // heartbeat
    if (_heartbeatTimer) clearInterval(_heartbeatTimer);
    _heartbeatTimer = setInterval(() => {
      dbUpdate(myPresencePath, { online: true, lastSeen: Date.now() });
    }, 5000);
  });
}

/**
 * Stop presence (expliciet, bv bij leave game of main menu).
 * onDisconnect blijft ook een safeguard, maar dit ruimt direct op.
 */
export function stopMyPresence() {
  if (_heartbeatTimer) {
    clearInterval(_heartbeatTimer);
    _heartbeatTimer = null;
  }

  if (_stopConnectedSub) {
    _stopConnectedSub();
    _stopConnectedSub = null;
  }

  if (_boundGameID && _boundGameCode && _boundPlayerId) {
    dbRemove(["presence", _boundGameID, _boundGameCode, _boundPlayerId]).catch(() => {});
  }

  _boundGameID = null;
  _boundGameCode = null;
  _boundPlayerId = null;
}
