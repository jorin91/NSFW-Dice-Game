import { storageSave, storageLoad, storageClear } from "./localstorage.js";
import { deepCopy, generateRandomID } from "./utils.js";

const LS_KEY_PLAYER = "NSFWDiceGame_Player";

const PLAYER_MODEL = {
    version: 1.0,
    id: null,
    name: "Player",
    age: 0,
    sex: "unspecified",
};

// Interne state + proxy
let _playerState = null;
let _playerProxy = null;

// Export-object dat altijd de actuele waarden weerspiegelt
export const PLAYER = {};

// Maak een nieuwe default player, met uniek ID
function createDefaultPlayer() {
    const base = deepCopy(PLAYER_MODEL);
    base.id = generateRandomID(); // evt. prefix in jouw util afhandelen
    return base;
}

/**
 * Maakt de Proxy rond de interne player state.
 * Alle wijzigingen:
 * - naar localStorage
 * - naar window.PLAYER
 * - gesynchroniseerd naar export-object PLAYER
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
            }
            return true;
        }
    });

    // Initial window.PLAYER setten
    if (typeof window !== "undefined") {
        window.PLAYER = _playerProxy;
    }

    // Zeker weten dat huidige staat in storage staat
    storageSave(LS_KEY_PLAYER, _playerState);

    return _playerProxy;
}

/**
 * Zorgt dat er een geldige player bestaat.
 * Wordt automatisch aangeroepen zodra deze module wordt geladen
 * of als getPlayer/PLAYER gebruikt wordt.
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
 * Helper als je expliciet de proxy wilt hebben.
 * Niet verplicht om te gebruiken; PLAYER werkt ook gewoon.
 */
export function getPlayer() {
    return ensurePlayerInitialized();
}
