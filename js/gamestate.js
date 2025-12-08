// js/gamestate.js
import { deepCopy } from "./utils.js";
import { storageSave, storageLoad, storageClear } from "./localstorage.js";
import { dbUpdate, subscribeValue } from "./firebase/firebase-db.js";
import { getTaskModel } from "./task.js";

const LS_KEY_GAMESTATE = "NSFWDiceGame_GameState";

// Basis vorm van je gamestate – alles wat hier in staat, heb je altijd.
const GAMESTATE_MODEL = {
  version: 1.0, // versie van het game-state model
  createdAt: null, // timestamp van aanmaak
  gameID: null, // unieke game ID (6-cijferig)
  settings: null, // game-instellingen
  players: null, // spelerslijst
  tasks: await getTaskModel(), // takenlijst
  game: {
    currentRound: 0, // huidige ronde
    currentPlayerTurnIndex: 0, // index van speler die nu aan de beurt is
    currentPlayerTurnRoll: 0, // huidige worp van de speler die aan de beurt is
    currentTask: null, // huidige taak
  }
};

// Huidige game-code waarmee we aan Firebase gekoppeld zijn
let _currentGameCode = null;

// Dit is de "echte" state waar de Proxy overheen komt
const _localState = deepCopy(GAMESTATE_MODEL);

// Flag om remote-sync te onderscheiden van lokale wijzigingen
let _syncingFromRemote = false;

// Huidige Firebase subscription stopper
let _stopFirebaseSub = null;

// De Proxy die jij in je code gaat gebruiken
let _GAMESTATE_PROXY = null;

// Map<string, Array<{ callback, subtree }>>
const _gameStateListeners = new Map();

/**
 * Resolveert een pad in _localState naar een waarde.
 * ""  → hele state
 * "players" → _localState.players
 * "players/123/name" → _localState.players["123"].name
 */
function resolveLocalStatePath(path) {
  if (!path) return _localState;

  const segments = path.split("/").filter(Boolean);
  let cursor = _localState;

  for (const seg of segments) {
    if (!cursor || typeof cursor !== "object") return undefined;
    cursor = cursor[seg];
  }
  return cursor;
}

/**
 * Roept alle listeners aan voor een bepaalde change-path.
 * relativePath is bijv. "players/123/name".
 */
function notifyGameStateListeners(relativePath) {
  const changePath = relativePath || "";

  for (const [key, listeners] of _gameStateListeners.entries()) {
    for (const listener of listeners) {
      const { callback, subtree } = listener;

      // key == ""  → luistert naar héle state
      if (!key) {
        const valueAtKey = resolveLocalStatePath("");
        callback(valueAtKey, { path: changePath, targetPath: "" });
        continue;
      }

      // Exact pad
      if (changePath === key) {
        const valueAtKey = resolveLocalStatePath(key);
        callback(valueAtKey, { path: changePath, targetPath: key });
        continue;
      }

      // Subtree: alles daaronder
      if (subtree && changePath.startsWith(key + "/")) {
        const valueAtKey = resolveLocalStatePath(key);
        callback(valueAtKey, { path: changePath, targetPath: key });
      }
    }
  }
}

/**
 * Abonneer op veranderingen in de GAMESTATE.
 *
 * path:
 *  - "" (of null) → alles
 *  - "players" → elke change in of onder players
 *  - "players/123" → elke change in of onder één speler
 *  - "players/123/name" → alleen changes op die exacte property
 *
 * options:
 *  - { subtree: true }  → callback ook bij changes in kinderen van path
 *  - { subtree: false } → alleen bij exacte path
 *
 * return:
 *  - functie om te unsubscriben
 */
export function subscribeGameState(path, callback, options = {}) {
  const key = (path || "").trim();
  const subtree = options.subtree === true;

  const entry = { callback, subtree };
  const arr = _gameStateListeners.get(key) || [];
  arr.push(entry);
  _gameStateListeners.set(key, arr);

  return () => {
    const list = _gameStateListeners.get(key);
    if (!list) return;
    const idx = list.indexOf(entry);
    if (idx >= 0) list.splice(idx, 1);
    if (list.length === 0) {
      _gameStateListeners.delete(key);
    }
  };
}

// Kleine helper om een Firebase-update te sturen voor één relatief pad
function pushFirebasePatch(relativePath, value) {
  if (!_currentGameCode) return; // nog geen game gekoppeld → niets doen

  const updateMap = {
    [relativePath]: value,
  };

  // Schrijf onder /games/{gameCode}/{relativePath}
  dbUpdate(["games", _currentGameCode], updateMap).catch((err) => {
    console.error("[GameState] Failed to sync to Firebase:", err);
  });
}

// Proxy-maker: wrapt een object en onthoudt het pad ernaartoe
function makeGameStateProxy(target, pathSegments = []) {
  return new Proxy(target, {
    get(t, prop, receiver) {
      // interne props
      if (prop === "__isProxy") return true;
      if (prop === "__path") return pathSegments;

      const value = Reflect.get(t, prop, receiver);

      // child-objecten ook wrappen, zodat diepste properties ook syncen
      if (value && typeof value === "object") {
        const childPath = [...pathSegments, prop];
        return makeGameStateProxy(value, childPath);
      }

      return value;
    },

    set(t, prop, value, receiver) {
      const result = Reflect.set(t, prop, value, receiver);

      const fullPathSegments = [...pathSegments, prop];
      const relativePath = fullPathSegments.join("/");

      // Alleen lokaal → naar Firebase + debug
      if (!_syncingFromRemote) {
        pushFirebasePatch(relativePath, value);
        storageSave(deepCopy(_localState), LS_KEY_GAMESTATE);
      }

      // Altijd events vuren (lokaal én remote)
      notifyGameStateListeners(relativePath);

      return result;
    },

    deleteProperty(t, prop) {
      const existed = Object.prototype.hasOwnProperty.call(t, prop);
      if (!existed) return true;

      delete t[prop];

      const fullPathSegments = [...pathSegments, prop];
      const relativePath = fullPathSegments.join("/");

      if (!_syncingFromRemote) {
        pushFirebasePatch(relativePath, null);
        storageSave(deepCopy(_localState), LS_KEY_GAMESTATE);
      }

      notifyGameStateListeners(relativePath);

      return true;
    },
  });
}

// Init Proxy één keer bij load
_GAMESTATE_PROXY = makeGameStateProxy(_localState, []);

// Exporteer de proxy zodat je hem direct kunt gebruiken
export const GAMESTATE = _GAMESTATE_PROXY;

// Geeft een diepe kopie van de huidige state (handig voor debug/log)
// LET OP: gebruik GAMESTATE in je game-logica, niet deze kopie.
export function gameGetState() {
  return deepCopy(_localState);
}

// Past remote state toe op de lokale state zonder terug te syncen naar Firebase.
// Hier kunnen we ook het model overlayen zodat ontbrekende velden netjes gevuld worden.
function gameApplyRemoteState(remoteState) {
  _syncingFromRemote = true;
  try {
    // Eerst alles leegmaken
    for (const key of Object.keys(_localState)) {
      delete _localState[key];
    }

    // Begin altijd vanuit GAMESTATE_MODEL
    Object.assign(_localState, deepCopy(GAMESTATE_MODEL));

    // Dan remote data eroverheen
    if (remoteState && typeof remoteState === "object") {
      Object.assign(_localState, remoteState);
    }

    // Voor debug: lokale versie naar storage
    storageSave(deepCopy(_localState), LS_KEY_GAMESTATE);
  } finally {
    _syncingFromRemote = false;
  }

  // één globale "state is veranderd" event
  notifyGameStateListeners("");
}

// Dit vervangt je oude gameInitFromStorage:
// Je haalt niet meer uit localStorage, maar koppelt aan Firebase.
// remoteState komt binnen via subscribeValue.
export function gameBindToFirebase(gameCode) {
  // Eventuele oude subscription stoppen
  if (_stopFirebaseSub) {
    _stopFirebaseSub();
    _stopFirebaseSub = null;
  }

  _currentGameCode = gameCode || null;

  if (!_currentGameCode) {
    // Geen gameCode → alleen resetten naar model en debug saven
    gameApplyRemoteState(null);
    return;
  }

  // Abonneren op /games/{gameCode} in Firebase
  _stopFirebaseSub = subscribeValue(
    ["games", _currentGameCode],
    (remoteState) => {
      // remoteState is de volledige game-doc op /games/{gameCode}
      if (!remoteState) {
        // Als er niets is in Firebase: start vanuit model
        gameApplyRemoteState(null);
      } else {
        gameApplyRemoteState(remoteState);
      }
      // Hier kun je eventueel een UI-refresh triggeren in jouw code
    }
  );
}

// Alleen nog voor debugging/local reset.
// Dit vernietigt niet de remote game, alleen jouw lokale state en debug-kopie.
export function resetGameStateLocal() {
  storageClear(LS_KEY_GAMESTATE);
  gameApplyRemoteState(null);
}

// Als je lokaal een debug-versie uit storage wilt terughalen zonder Firebase:
// (bijvoorbeeld op een debugpagina) – optioneel.
export function gameInitFromDebugStorage() {
  const saved = storageLoad(LS_KEY_GAMESTATE);
  if (!saved || saved.version !== GAMESTATE_MODEL.version) {
    gameApplyRemoteState(null);
    return;
  }
  gameApplyRemoteState(saved);
}

// Handige helper: explicit debug-save van de huidige state
export function gameSaveStateDebug() {
  storageSave(deepCopy(_localState), LS_KEY_GAMESTATE);
}
