// js/firebase/firebase-presence.js
import { firebaseDB } from "./firebase-init.js";
import { dbSet, dbUpdate, dbRemove } from "./firebase-db.js";
import {
  ref,
  onValue,
  onDisconnect,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  off,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";

let _stopConnectedSub = null;
let _heartbeatTimer = null;
let _presenceHeartbeatInterval = 30000; // ms

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
    }, _presenceHeartbeatInterval);
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

/**
 * Subscribe op presence changes in een game, maar fire alleen events als "online" relevant is.
 *
 * Luistert op: presence/{gameID}/{gameCode}
 * - child_added  -> speler komt online (node verschijnt)
 * - child_removed-> speler gaat weg (node verdwijnt)
 * - child_changed-> alleen als online (bool) echt gewijzigd is
 *
 * options:
 * - { playerId?: string }  -> alleen events voor 1 speler
 *
 * callback signature:
 *   callback({
 *     type: "added"|"removed"|"online-changed",
 *     playerId: string,
 *     online: boolean|null,
 *     lastSeen: number|null,
 *     raw: object|null
 *   })
 *
 * return:
 *   unsubscribe() functie
 */
export function subscribePresenceOnline(gameID, gameCode, callback, options = {}) {
  const { playerId = null } = options || {};

  if (!gameID || !gameCode) {
    console.warn("[Presence] subscribePresenceOnline missing gameID/gameCode");
    return () => {};
  }
  if (typeof callback !== "function") {
    console.warn("[Presence] subscribePresenceOnline missing callback");
    return () => {};
  }

  const baseRef = ref(firebaseDB, ["presence", gameID, gameCode].join("/"));

  // Cache: vorige online status per speler zodat we lastSeen-only updates kunnen negeren
  const onlineCache = new Map(); // playerId -> boolean

  const shouldHandle = (id) => !playerId || id === playerId;

  const unsubscribers = [];

  // speler verschijnt
  const offAdded = onChildAdded(baseRef, (snap) => {
    const id = snap.key;
    if (!id || !shouldHandle(id)) return;

    const data = snap.val() || {};
    const online = !!data.online;

    onlineCache.set(id, online);

    callback({
      type: "added",
      playerId: id,
      online,
      lastSeen: typeof data.lastSeen === "number" ? data.lastSeen : null,
      raw: data,
    });
  });
  unsubscribers.push(() => off(baseRef, "child_added", offAdded));

  // speler verdwijnt
  const offRemoved = onChildRemoved(baseRef, (snap) => {
    const id = snap.key;
    if (!id || !shouldHandle(id)) return;

    const data = snap.val() || {};
    onlineCache.delete(id);

    callback({
      type: "removed",
      playerId: id,
      online: null,
      lastSeen: typeof data.lastSeen === "number" ? data.lastSeen : null,
      raw: data,
    });
  });
  unsubscribers.push(() => off(baseRef, "child_removed", offRemoved));

  // speler update (filter op online change)
  const offChanged = onChildChanged(baseRef, (snap) => {
    const id = snap.key;
    if (!id || !shouldHandle(id)) return;

    const data = snap.val() || {};
    const nextOnline = !!data.online;
    const prevOnline = onlineCache.has(id) ? onlineCache.get(id) : null;

    // update cache altijd
    onlineCache.set(id, nextOnline);

    // Alleen callback als online echt veranderd is (lastSeen ticks negeren)
    if (prevOnline === null) return; // geen betrouwbare vorige -> niets vuren
    if (prevOnline === nextOnline) return;

    callback({
      type: "online-changed",
      playerId: id,
      online: nextOnline,
      lastSeen: typeof data.lastSeen === "number" ? data.lastSeen : null,
      raw: data,
    });
  });
  unsubscribers.push(() => off(baseRef, "child_changed", offChanged));

  // Unsubscribe wrapper
  return () => {
    for (const fn of unsubscribers) {
      try { fn(); } catch {}
    }
    onlineCache.clear();
  };
}
