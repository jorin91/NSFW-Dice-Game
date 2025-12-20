// js/panel-game.js
import { setI18n, getSupportedLanguages } from "./lang_i18n.js";
import { makePanel, getPanel } from "./elementHelpers.js";
import { GAMESTATE } from "./gamestate.js";

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
