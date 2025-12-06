import { storageSave, storageLoad, storageClear } from "./localstorage.js";
import { deepCopy, generateRandomID } from "./utils.js";

const LS_KEY_PLAYER = "NSFWDiceGame_Player";

const PLAYER_MODEL = {
    version: 1.0,
    id: generateRandomID(),
    name: null,
    age: 0,
    sex: null,
};

// Interne state + proxy
let _playerState = null;
let _playerProxy = null;

// Export-object dat altijd de actuele waarden bevat
export const PLAYER = {};

/**
 * Maakt (of hergebruikt) de proxy rond de interne player state.
 * Alle wijzigingen worden direct opgeslagen in:
 * - localStorage
 * - window.PLAYER
 * - het export-object PLAYER
 */
function createPlayerProxy(base) {
    _playerState = base;

    // Zorg dat het export-object direct de juiste waarden heeft
    Object.keys(PLAYER).forEach((k) => delete PLAYER[k]);
    Object.assign(PLAYER, _playerState);

    _playerProxy = new Proxy(_playerState, {
        set(target, prop, value) {
            // schrijf naar de echte state
            target[prop] = value;

            // sync export-object
            PLAYER[prop] = value;

            // localStorage bijwerken
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

    // window.PLAYER initial zetten
    if (typeof window !== "undefined") {
        window.PLAYER = _playerProxy;
    }

    // Zeker weten dat de initiële staat ook in storage staat
    storageSave(LS_KEY_PLAYER, _playerState);

    return _playerProxy;
}

/**
 * Initialiseert de PLAYER state.
 * - Probeert uit localStorage te laden
 * - Checkt de versie tegen PLAYER_MODEL.version
 * - Bij mismatch of geen data: maak een nieuwe vanuit PLAYER_MODEL
 * - Zet window.PLAYER en het export-object PLAYER
 */
export function initPlayer() {
    if (_playerProxy) {
        // Al geïnitialiseerd, gewoon teruggeven
        return _playerProxy;
    }

    const loaded = storageLoad(LS_KEY_PLAYER, null);

    let base;
    if (
        loaded &&
        typeof loaded === "object" &&
        Number(loaded.version) === Number(PLAYER_MODEL.version)
    ) {
        // Geldige bestaande speler
        base = loaded;
    } else {
        // Versie mismatch of niets gevonden → resetten naar model
        if (loaded) {
            storageClear(LS_KEY_PLAYER);
        }
        base = deepCopy(PLAYER_MODEL);
    }

    return createPlayerProxy(base);
}

/**
 * Optioneel: helper om altijd de actuele proxy op te vragen.
 * (Handig als je niet met window.PLAYER wilt werken.)
 */
export function getPlayer() {
    if (!_playerProxy) {
        initPlayer();
    }
    return _playerProxy;
}
