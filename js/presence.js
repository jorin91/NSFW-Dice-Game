// js/presence.js
import { deepCopy } from "./utils.js";
import { subscribeValue } from "./firebase/firebase-db.js";

const PRESENCE_MODEL = {}; // map: { [playerId]: { online, lastSeen, ... } }

// Lokale presence-cache (altijd up-to-date via Firebase subscription)
let _localPresence = deepCopy(PRESENCE_MODEL);

// game waar we op gebonden zijn
let _currentGameID = null;
let _currentGameCode = null;

// subscription stopper
let _stopPresenceSub = null;

// Map<string, Array<{ callback, subtree }>>
const _presenceListeners = new Map();

/**
 * Resolveert een pad in _localPresence naar een waarde.
 * "" → hele presence map
 * "abc123" → presence van playerId abc123
 * "abc123/online" → boolean
 */
function resolvePresencePath(path) {
  if (!path) return _localPresence;

  const segments = path.split("/").filter(Boolean);
  let cursor = _localPresence;

  for (const seg of segments) {
    if (!cursor || typeof cursor !== "object") return undefined;
    cursor = cursor[seg];
  }
  return cursor;
}

/**
 * Notify listeners voor change-path (bijv. "abc123/online")
 */
function notifyPresenceListeners(relativePath) {
  const changePath = relativePath || "";

  for (const [key, listeners] of _presenceListeners.entries()) {
    for (const listener of listeners) {
      const { callback, subtree } = listener;

      // key == "" → hele presence
      if (!key) {
        callback(resolvePresencePath(""), { path: changePath, targetPath: "" });
        continue;
      }

      // exact match
      if (changePath === key) {
        callback(resolvePresencePath(key), { path: changePath, targetPath: key });
        continue;
      }

      // subtree match
      if (subtree && changePath.startsWith(key + "/")) {
        callback(resolvePresencePath(key), { path: changePath, targetPath: key });
      }
    }
  }
}

/**
 * Subscribe op presence changes (zelfde API als subscribeGameState).
 */
export function subscribePresence(path, callback, options = {}) {
  const key = (path || "").trim();
  const subtree = options.subtree === true;

  const entry = { callback, subtree };
  const arr = _presenceListeners.get(key) || [];
  arr.push(entry);
  _presenceListeners.set(key, arr);

  return () => {
    const list = _presenceListeners.get(key);
    if (!list) return;
    const idx = list.indexOf(entry);
    if (idx >= 0) list.splice(idx, 1);
    if (list.length === 0) _presenceListeners.delete(key);
  };
}

/**
 * Exposed presence object.
 * Dit is read-only-by-convention: je mag dit niet direct muteren.
 * (Gebruik presenceWriteMyPresence / presenceStopMyPresence daarvoor.)
 */
export const PRESENCE = new Proxy(
  {},
  {
    get(_t, prop) {
      // Zorg dat PRESENCE altijd de huidige snapshot reflecteert
      if (prop === "__raw") return _localPresence;
      return _localPresence[prop];
    },
    ownKeys() {
      return Reflect.ownKeys(_localPresence);
    },
    getOwnPropertyDescriptor(_t, prop) {
      const desc = Object.getOwnPropertyDescriptor(_localPresence, prop);
      if (desc) return desc;
      return { configurable: true, enumerable: true, writable: false, value: _localPresence[prop] };
    },
    set() {
      // bewust blokkeren: presence schrijf je via functies
      console.warn("[Presence] Direct mutating PRESENCE is not allowed. Use presenceWriteMyPresence().");
      return false;
    }
  }
);

/**
 * Bind presence subscription aan een game.
 * - Abonneert op: presence/{gameID}/{gameCode}
 * - Houdt _localPresence automatisch up-to-date
 * - Vuurt notify events op nested properties bij changes
 */
export function presenceBindToFirebase(gameID, gameCode) {
  // stop oude sub
  if (_stopPresenceSub) {
    _stopPresenceSub();
    _stopPresenceSub = null;
  }

  _currentGameID = gameID || null;
  _currentGameCode = gameCode || null;

  // reset lokaal
  _localPresence = deepCopy(PRESENCE_MODEL);
  notifyPresenceListeners("");

  if (!_currentGameID || !_currentGameCode) return;

  _stopPresenceSub = subscribeValue(
    ["presence", _currentGameID, _currentGameCode],
    (remotePresence) => {
      // remotePresence is map of playerId -> presence object
      const next = (remotePresence && typeof remotePresence === "object") ? remotePresence : {};

      // diff en notify op nested paths
      diffAndApplyPresence(next);
    }
  );
}

/**
 * Eenvoudige diff: zoekt changes in keys en nested properties,
 * update _localPresence en vuurt notifyPresenceListeners(path).
 *
 * Met deze aanpak kun je heel gericht subscriben op "playerId/online" etc.
 */
function diffAndApplyPresence(nextPresence) {
  const prev = _localPresence || {};
  const notified = new Set();

  // 1) removed players
  for (const playerId of Object.keys(prev)) {
    if (!(playerId in nextPresence)) {
      // player node verwijderd
      delete prev[playerId];
      notified.add(playerId);
    }
  }

  // 2) added/updated players
  for (const playerId of Object.keys(nextPresence)) {
    const nextObj = nextPresence[playerId];
    const prevObj = prev[playerId];

    if (!prevObj) {
      // new player node
      prev[playerId] = nextObj;
      notified.add(playerId);
      continue;
    }

    // compare nested props
    const nextKeys = (nextObj && typeof nextObj === "object") ? Object.keys(nextObj) : [];
    const prevKeys = (prevObj && typeof prevObj === "object") ? Object.keys(prevObj) : [];

    // removed props
    for (const k of prevKeys) {
      if (!nextObj || !(k in nextObj)) {
        delete prevObj[k];
        notified.add(`${playerId}/${k}`);
      }
    }

    // added/changed props
    for (const k of nextKeys) {
      const a = prevObj[k];
      const b = nextObj[k];
      if (a !== b) {
        prevObj[k] = b;
        notified.add(`${playerId}/${k}`);
      }
    }
  }

  // set back (prev is _localPresence reference)
  _localPresence = prev;

  // fire
  if (notified.size === 0) return;
  for (const path of notified) notifyPresenceListeners(path);

  // ook handig: globale change
  notifyPresenceListeners("");
}

/**
 * Helper: snel checken of iemand online is.
 * Je mag zelf bepalen wat "online" betekent.
 * - node bestaat
 * - online === true
 */
export function presenceIsOnline(playerId) {
  const p = _localPresence?.[playerId];
  return !!(p && p.online === true);
}
