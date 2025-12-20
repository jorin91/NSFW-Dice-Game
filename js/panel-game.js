// js/panel-game.js
import { setI18n, getSupportedLanguages } from "./lang_i18n.js";
import { makePanel, getPanel } from "./elementHelpers.js";
import { GAMESTATE } from "./gamestate.js";
import { PLAYER } from "./player.js";
import { getTaskModel } from "./task.js";
import {
  createGameFB,
  joinGameFB,
  listGames,
} from "./firebase/firebase-game.js";

// Panels
export function setupPanelGameTask(id = "game-task") {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, true);

  // Build header
  panel.header.innerHTML = "";

  const h2Header = document.createElement("h2");
  setI18n(h2Header, "ui.panel-game-task.header");
  panel.header.appendChild(h2Header);

  const subHeader = document.createElement("span");
  setI18n(subHeader, "{ui.game.gameID} | {ui.game.gameCode}", {
    gameID: GAMESTATE.gameID || "{ui.game.loading}",
    gameCode: GAMESTATE.gameCode || "{ui.game.loading}",
  });
  panel.header.appendChild(subHeader);

  // Build body
  panel.body.innerHTML = "";

  // Build footer
  panel.footer.innerHTML = "";
}

export function setupPanelGamePlay(id = "game-play") {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, true);

  // Build header
  panel.header.innerHTML = "";

  const h2Header = document.createElement("h2");
  setI18n(h2Header, "ui.panel-game-play.header");
  panel.header.appendChild(h2Header);

  const subHeader = document.createElement("span");
  setI18n(subHeader, "{ui.game.gameID} | {ui.game.gameCode}", {
    gameID: GAMESTATE.gameID || "{ui.game.loading}",
    gameCode: GAMESTATE.gameCode || "{ui.game.loading}",
  });
  panel.header.appendChild(subHeader);

  // Build body
  panel.body.innerHTML = "";

  // Build footer
  panel.footer.innerHTML = "";
}

// Game Functions
export async function createGame(settings) {
  // Check that settings is valid
  if (!settings) {
    console.warn("Cannot create game, settings object is null");
    return false;
  }

  // Extra check to ensure all settings are filled. Individual setting values are checked during creation. Here we dont care about value, just that it's not null.
  for (const key of Object.keys(settings)) {
    if (settings[key] == null) {
      console.warn(`Cannot create game, setting "${key}" is null`);
      return false;
    }
  }

  // Lets create the game
  // Transfering values from settings to GAMESTATE
  GAMESTATE.settings = settings;
  GAMESTATE.gameID = settings.gameID;
  GAMESTATE.gameCode = settings.gameCode;
  GAMESTATE.gameName = settings.gameName;
  GAMESTATE.createdAt = new Date().toISOString();
  GAMESTATE.players = [PLAYER];

  GAMESTATE.tasks = await getTaskModel(); // await task as last step to ensure settings are ready

  const result = await createGameFB();
  console.log("createGame result:", result);
  return result.success;
}

export async function joinGame(gameCode, gameID) {
  if (!PLAYER.game.consent) {
    await setupPanelPlayerConsent(gameID, gameCode);
  } else {
    const result = await joinGameFB(gameID, gameCode);
    console.log("joinGame result:", result);
    // return result.success;
  }
}

export async function setupPanelPlayerConsent(
  gameID,
  gameCode
) {
  id = "player-consent"
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, true);

  // Build header
  panel.header.innerHTML = "";

  const h2Header = document.createElement("h2");
  setI18n(h2Header, "ui.panel-player-consent.header");
  panel.header.appendChild(h2Header);

  // Build body
  panel.body.innerHTML = "";

  if (!gameID || !gameCode) return;

  const game = await listGames(gameID, gameCode);
  if (!game.success) {
    console.log("Failed to setup player consent panel", game);
    return;
  }

  // Loop trough settings and build elements
  for (const key of Object.keys(game.settings)) {
    const setting = game.settings[key];

    if (setting && typeof setting != "object") {
      const label = document.createElement("label");
      setI18n(label, `{ui.settings.${key}}: {value}`, { value: String(setting) });
      panel.body.appendChild(label);
    } else if (setting && typeof setting === "object" && setting.enabled) {

    }
  }

  // Build footer
  panel.footer.innerHTML = "";
}
