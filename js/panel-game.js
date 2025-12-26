// js/panel-game.js
import { setI18n, getSupportedLanguages } from "./lang_i18n.js";
import { makePanel, getPanel } from "./elementHelpers.js";
import { GAMESTATE, subscribeGameState } from "./gamestate.js";
import { PLAYER } from "./player.js";
import { getTaskModel } from "./task.js";
import {
  createGameFB,
  joinGameFB,
  listGames,
} from "./firebase/firebase-game.js";
import { switchPanel } from "./panelnavigation.js";
import { presenceBindToFirebase } from "./presence.js";
import {
  startMyPresence,
  subscribePresenceOnline,
} from "./firebase/firebase-presence.js";
import { toast } from "./toast.js";

export let _gamePresence = null;
const _playerOnline = new Map();

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
  // GAMESTATE.players = [PLAYER];

  GAMESTATE.tasks = await getTaskModel(); // await task as last step to ensure settings are ready

  const result = await createGameFB();
  toast(`{${result.message}}`, !result.success, !result.success);
  return result.success;
}

export async function joinGame(gameCode, gameID) {
  if (!PLAYER.game.consent) {
    await setupPanelPlayerConsent(gameID, gameCode);
    switchPanel("*", "panel-player-consent");
  } else {
    const result = await joinGameFB(gameID, gameCode);
    if (result.success) {
      toast(`{${result.message}}`, !result.success, !result.success);

      // Bind presence system to this game
      presenceBindToFirebase(gameID, gameCode);

      // Subscribe to presence updates
      _gamePresence = subscribePresenceOnline(gameID, gameCode, (evt) => {
        if (evt.type === "removed") {
          _playerOnline.set(evt.playerId, false);
        } else if (evt.type === "added") {
          _playerOnline.set(evt.playerId, true);
        } else if (evt.type === "online-changed") {
          _playerOnline.set(evt.playerId, !!evt.online);
        }

        // UI trigger
        setupElementPlayers(GAMESTATE.players);
      });

      // Subscribe to GAMESTATE player changes to update UI
      subscribeGameState("players", setupElementPlayers, { subtree: true });

      // Start presence for self
      startMyPresence(gameID, gameCode, PLAYER.id, {
        name: PLAYER.name || null,
      });

      // Add self to GAMESTATE players if not already present
      const existing = GAMESTATE.players.find((p) => p.id === PLAYER.id);
      if (!existing) GAMESTATE.players.push(PLAYER);

      // Show game play panel
      switchPanel("*", "panel-game-play");
    }
  }
}

export async function setupPanelPlayerConsent(
  gameID,
  gameCode,
  id = "player-consent"
) {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, false);

  // Build header
  panel.header.innerHTML = "";

  const h2Header = document.createElement("h2");
  setI18n(h2Header, "ui.panel-player-consent.header");
  panel.header.appendChild(h2Header);

  // Build body
  panel.body.innerHTML = "";

  const settingsContainer = document.createElement("div");
  settingsContainer.className = "col small";
  panel.body.appendChild(settingsContainer);

  // Settings Header
  const settingsHeader = document.createElement("h4");
  setI18n(settingsHeader, "ui.settings");
  settingsContainer.appendChild(settingsHeader);

  if (!gameID || !gameCode) return;

  const game = await listGames(gameID, gameCode);
  if (!game.success) {
    console.log("Failed to setup player consent panel", game);
    return;
  }

  // Loop trough settings and build elements
  for (const settingKey of Object.keys(game.settings)) {
    const setting = game.settings[settingKey];

    if (setting && typeof setting != "object") {
      const label = document.createElement("label");
      setI18n(label, `{ui.settings.${settingKey}}: {value}`, {
        value: String(setting),
      });
      settingsContainer.appendChild(label);
    } else if (setting && typeof setting === "object") {
      let stringValue = `{${setting.i18nTitle}}: `;
      const propArr = [];
      for (const propKey of Object.keys(setting)) {
        const prop = setting[propKey];
        if (prop && prop.enabled) propArr.push(`{${prop.value}}`);
      }
      const propString = propArr.join(", ");
      stringValue += propString;

      const label = document.createElement("label");
      setI18n(label, stringValue);
      settingsContainer.appendChild(label);
    }
  }

  // Consent Text
  const consentText = document.createElement("h4");
  setI18n(consentText, "ui.panel-player-consent.content");
  panel.body.appendChild(consentText);

  // Build footer
  panel.footer.innerHTML = "";

  const buttonRow = document.createElement("div");
  buttonRow.className = "row";
  panel.footer.appendChild(buttonRow);

  const agreeButton = document.createElement("button");
  agreeButton.className = "btn";
  setI18n(agreeButton, "ui.panel-player-consent.button.agree");
  buttonRow.appendChild(agreeButton);

  agreeButton.addEventListener("click", async (e) => {
    PLAYER.game.consent = true;
    await joinGame(gameCode, gameID);
  });
}

function setupElementPlayers(
  players,
  meta,
  id = "game-play-players-status",
  panelId = "game-play"
) {
  let panel = getPanel(panelId);
  let playerRow = document.getElementById(id);
  if (!playerRow) {
    playerRow = document.createElement("div");
    playerRow.className = "row";
    playerRow.id = id;

    panel.body.appendChild(playerRow);
  } else {
    playerRow.innerHTML = "";
  }

  for (const player of players) {
    const playerEl = document.createElement("div");
    playerEl.className = "player-bubble";

    const isOnline = _playerOnline.get(player.id) ?? false;
    if (!isOnline) {
      playerEl.classList.add("offline");
    } else {
      playerEl.classList.remove("offline");
    }

    if (player.game.safe) {
      playerEl.classList.add("safe");
    } else {
      playerEl.classList.remove("safe");
    }

    if (player.game.loser) {
      playerEl.classList.add("loser");
    } else {
      playerEl.classList.remove("loser");
    }

    playerEl.innerText = `${player.name}${isOnline ? "" : " (offline)"}`;
  }
}
