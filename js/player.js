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
    rerolls: 0, // aantal resterende rerolls van speler. word gebruikt om iets opnieuw te doen zoals een andere opdracht, mogelijk andere opties.
    safe: false, // speler is veilig in huidige game -> gewonnen
    playerResultType: null, // Word ingevuld volgens de TASKPLAYERTARGET_ENUM met spelresultaat van de speler in de huidige ronde (zoals loser, winner, other)
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
 *   { type: "set", path, value }
 *   { type: "delete", path }
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

  // Cache voorkomt eindeloos nieuwe proxies voor dezelfde objecten
  const proxyCache = new WeakMap();

  function notifyAndSave(relativePath, value, type) {
    // Bewaar altijd de volledige state (zelfde gedrag als je intentie)
    storageSave(deepCopy(_playerState), LS_KEY_PLAYER);

    // Fire event (met pad, zoals je gamestate)
    notifyPlayerChange({
      type,                 // "set" | "delete"
      path: relativePath,   // bijv. "game/rerolls"
      value,                // nieuwe value (bij set)
    });
  }

  function makePlayerProxy(target, pathSegments = []) {
    if (!target || typeof target !== "object") return target;

    // hergebruik bestaande proxy als we deze al hebben
    const cached = proxyCache.get(target);
    if (cached) return cached;

    const p = new Proxy(target, {
      get(t, prop, receiver) {
        // interne props (optioneel, maar handig voor debug)
        if (prop === "__isProxy") return true;
        if (prop === "__path") return pathSegments;

        const value = Reflect.get(t, prop, receiver);

        // child-objecten ook wrappen, zodat diepe sets ook door de proxy gaan
        if (value && typeof value === "object") {
          const childPath = [...pathSegments, String(prop)];
          return makePlayerProxy(value, childPath);
        }

        return value;
      },

      set(t, prop, value, receiver) {
        const result = Reflect.set(t, prop, value, receiver);

        const fullPathSegments = [...pathSegments, String(prop)];
        const relativePath = fullPathSegments.join("/");

        notifyAndSave(relativePath, value, "set");
        return result;
      },

      deleteProperty(t, prop) {
        const existed = Object.prototype.hasOwnProperty.call(t, prop);
        if (!existed) return true;

        delete t[prop];

        const fullPathSegments = [...pathSegments, String(prop)];
        const relativePath = fullPathSegments.join("/");

        notifyAndSave(relativePath, undefined, "delete");
        return true;
      },
    });

    proxyCache.set(target, p);
    return p;
  }

  _playerProxy = makePlayerProxy(_playerState, []);

  // export-binding naar de proxy zelf
  PLAYER = _playerProxy;

  // initial save
  storageSave(deepCopy(_playerState), LS_KEY_PLAYER);

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
    base.game.consent = false; // Always to false on load

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
