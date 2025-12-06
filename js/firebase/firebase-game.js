// js/firebase/firebase-game.js
import { dbGet } from "./firebase-db.js";
import { GAMESTATE, GAMESTATE_MODEL, gameBindToFirebase } from "../gamestate.js";

// Helper: numerieke code genereren (bijv. 6 of 8 cijfers)
function generateGameCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

// Helper: playerId genereren (mag alles zijn, hoeft niet mooi)
function generatePlayerId() {
  return "p_" + Math.random().toString(36).slice(2, 10);
}

// Helper: code normaliseren (spaties weg, naar string)
export function normalizeGameCode(input) {
  return String(input || "").trim();
}

/**
 * Checkt of een game met deze code bestaat.
 * Retourneert:
 *  - null als de game niet bestaat
 *  - het object onder /games/{code} als hij wel bestaat
 */
export async function findGameByCode(gameCode) {
  const code = normalizeGameCode(gameCode);
  if (!code) return null;

  const game = await dbGet(["games", code]);
  return game || null;
}

/**
 * Host: nieuwe game aanmaken en direct verbinden.
 *
 * - maakt een nieuwe gameCode (6 of 8 cijfers)
 * - maakt een playerId voor de host
 * - bindt GAMESTATE aan Firebase op /games/{code}
 * - zet basis velden in GAMESTATE
 * - voegt host toe aan GAMESTATE.players
 *
 * Retourneert: { gameCode, playerId }
 */
export async function createAndBindGame({
  gameName,
  hostName,
  codeLength = 6,
} = {}) {
  const code = generateGameCode(codeLength);
  const playerId = generatePlayerId();
  const now = Date.now();

  // Eerst binden aan Firebase, zodat vanaf nu alle GAMESTATE-wijzigingen syncen
  gameBindToFirebase(code);

  // Basis game-inhoud in GAMESTATE zetten
  // Alles wat je hier zet, gaat automatisch naar Firebase via de Proxy
  GAMESTATE.version = GAMESTATE_MODEL.version;
  GAMESTATE.gameCode = code;
  GAMESTATE.createdAt = now;
  GAMESTATE.gameName = gameName || "Nieuwe game";
  GAMESTATE.hostPlayerId = playerId;

  // Info over "mijzelf"
  GAMESTATE.me = {
    id: playerId,
    name: hostName || "Host",
    joinedAt: now,
  };

  // Spelers-structuur
  GAMESTATE.players ??= {};
  GAMESTATE.players[playerId] = {
    id: playerId,
    name: hostName || "Host",
    joinedAt: now,
    isHost: true,
  };

  return { gameCode: code, playerId };
}

/**
 * Joinen bij een bestaande game.
 *
 * - controleert of /games/{code} bestaat
 * - maakt een playerId
 * - bindt GAMESTATE aan Firebase op /games/{code}
 * - voegt deze speler toe aan GAMESTATE.players
 *
 * Retourneert: { gameCode, playerId, game } (game = huidige state uit Firebase)
 */
export async function joinAndBindGame({
  gameCode,
  playerName,
} = {}) {
  const code = normalizeGameCode(gameCode);
  if (!code) {
    throw new Error("Geen geldige game code opgegeven.");
  }

  // Bestaat de game?
  const existingGame = await findGameByCode(code);
  if (!existingGame) {
    throw new Error("Deze game bestaat niet (ongeldige code).");
  }

  const playerId = generatePlayerId();
  const now = Date.now();

  // Binden aan Firebase
  gameBindToFirebase(code);

  // GAMESTATE vullen op basis van bestaande game + eigen info
  // De remote state wordt via gameBindToFirebase binnengehaald.
  // Hier voegen we onszelf toe.
  GAMESTATE.gameCode = code;

  GAMESTATE.me = {
    id: playerId,
    name: playerName || "Speler",
    joinedAt: now,
  };

  GAMESTATE.players ??= {};
  GAMESTATE.players[playerId] = {
    id: playerId,
    name: playerName || "Speler",
    joinedAt: now,
    isHost: false,
  };

  return { gameCode: code, playerId, game: existingGame };
}
