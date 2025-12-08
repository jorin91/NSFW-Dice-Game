import { storageSave, storageLoad, storageClear } from "./localstorage.js";
import { deepCopy, generateRandomID } from "./utils.js";

const LS_KEY_PLAYER = "NSFWDiceGame_Player";

const PLAYER_MODEL = {
  version: 1.0, // versie van het player-model
  id: null, // unieke speler ID
  name: null, // naam/bijnaam van de speler
  age: 0, // leeftijd van de speler
  sex: null, // geslacht van de speler
  game: {
    score: 0, // aantal gewonnen rondes in huidige game
    points: 0, // gegooide punten in huidige beurt
    safe: false, // speler is veilig in huidige game
    consent: false, // speler stemt in met deelname
    clothing: null, // kledingstukken van de speler
  }
};

// Interne state + proxy
let _playerState = null;
let _playerProxy = null;

// Dit is nu een live binding naar de proxy zelf
export let PLAYER = null;

// Lijst met change-listeners
const _playerChangeHandlers = [];

/**
 * Abonneer je op wijzigingen in de speler.
 * handler krijgt (playerProxy, changeInfo)
 *
 * changeInfo:
 *   { type: "set", prop, value }
 *   { type: "delete", prop }
 *
 * Returns: functie om je weer uit te schrijven.
 */
export function onPlayerChange(handler) {
  if (typeof handler !== "function") {
    return () => {};
  }
  _playerChangeHandlers.push(handler);

  // unsubscribe functie teruggeven
  return () => {
    const idx = _playerChangeHandlers.indexOf(handler);
    if (idx !== -1) {
      _playerChangeHandlers.splice(idx, 1);
    }
  };
}

// interne helper om alle listeners te triggeren
function notifyPlayerChange(changeInfo) {
  if (!_playerChangeHandlers.length) return;

  const snapshot = _playerProxy; // altijd de actuele proxy
  for (const fn of _playerChangeHandlers) {
    try {
      fn(snapshot, changeInfo);
    } catch (e) {
      console.error("[PLAYER] onPlayerChange handler error:", e);
    }
  }
}

// Maak een nieuwe default player, met uniek ID
function createDefaultPlayer() {
  const base = deepCopy(PLAYER_MODEL);
  base.id = generateRandomID();
  return base;
}

/**
 * Maakt de Proxy rond de interne player state.
 * Alle wijzigingen:
 * - naar localStorage
 * - triggeren onPlayerChange callbacks
 */
function createPlayerProxy(base) {
  _playerState = base;

  _playerProxy = new Proxy(_playerState, {
    set(target, prop, value) {
      target[prop] = value;

      // opslaan in storage
      storageSave(target, LS_KEY_PLAYER);

      // listeners aanroepen
      notifyPlayerChange({
        type: "set",
        prop,
        value,
      });

      return true;
    },
    deleteProperty(target, prop) {
      if (prop in target) {
        delete target[prop];

        storageSave(target, LS_KEY_PLAYER);

        notifyPlayerChange({
          type: "delete",
          prop,
        });
      }
      return true;
    },
  });

  // export-binding naar de proxy zelf
  PLAYER = _playerProxy;

  // huidige staat in storage
  storageSave(_playerState, LS_KEY_PLAYER);

  return _playerProxy;
}

/**
 * Zorgt dat er een geldige player bestaat.
 * Wordt 1x aangeroepen bij module load.
 */
function ensurePlayerInitialized() {
  if (_playerProxy) return _playerProxy;

  const loaded = storageLoad(LS_KEY_PLAYER, null);
  let base;

  if (
    loaded &&
    typeof loaded === "object" &&
    Number(loaded.version) === Number(PLAYER_MODEL.version)
  ) {
    base = loaded;

    // Oude data kan nog geen id hebben → 1x genereren
    if (!base.id) {
      base.id = generateRandomID();
    }
  } else {
    // Versie mismatch of geen data → resetten
    if (loaded) {
      storageClear(LS_KEY_PLAYER);
    }
    base = createDefaultPlayer();
  }

  return createPlayerProxy(base);
}

// Automatisch initialiseren bij module load
ensurePlayerInitialized();

/**
 * Optioneel: expliciet de proxy opvragen.
 */
export function getPlayer() {
  return ensurePlayerInitialized();
}
