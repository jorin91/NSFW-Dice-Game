import { storageSave, storageLoad, storageClear } from "./localstorage.js";
import { deepCopy, generateRandomID } from "./utils.js";

const LS_KEY_PLAYER = "NSFWDiceGame_Player";

const PLAYER_MODEL = {
    version: 1.0,
    id: null,
    name: null,
    age: null,
    sex: null,
};

// Interne state + proxy
let _playerState = null;
let _playerProxy = null;

// Export-object dat altijd de actuele waarden weerspiegelt
export const PLAYER = {};

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
    base.id = generateRandomID("player_"); // of zonder prefix
    return base;
}

/**
 * Maakt de Proxy rond de interne player state.
 * Alle wijzigingen:
 * - naar localStorage
 * - naar window.PLAYER
 * - gesynchroniseerd naar export-object PLAYER
 * - triggeren onPlayerChange callbacks
 */
function createPlayerProxy(base) {
    _playerState = base;

    // Export-object syncen met de huidige state
    Object.keys(PLAYER).forEach((k) => delete PLAYER[k]);
    Object.assign(PLAYER, _playerState);

    _playerProxy = new Proxy(_playerState, {
        set(target, prop, value) {
            target[prop] = value;

            // export-object bijwerken
            PLAYER[prop] = value;

            // opslaan in storage
            storageSave(LS_KEY_PLAYER, target);

            // window.PLAYER bijwerken
            if (typeof window !== "undefined") {
                window.PLAYER = _playerProxy;
            }

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
                delete PLAYER[prop];

                storageSave(LS_KEY_PLAYER, target);

                if (typeof window !== "undefined") {
                    window.PLAYER = _playerProxy;
                }

                notifyPlayerChange({
                    type: "delete",
                    prop,
                });
            }
            return true;
        }
    });

    // Initial window.PLAYER setten
    if (typeof window !== "undefined") {
        window.PLAYER = _playerProxy;
    }

    // Zeker weten dat huidige staat in storage staat
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
            base.id = generateRandomID("player_");
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
