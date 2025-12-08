// js/panel-game.js
import { setI18n } from "./lang_i18n.js";
import { GAMESTATE } from "./gamestate.js";

export function setupPanelGame() {
  const header = document.getElementById("panel-game.header");
  if (header) {
    header.innerHTML = "";
    const title = document.createElement("h2");
    setI18n(
      title,
      "ui.panel-game.header",
      { gameID: GAMESTATE.gameID, gameCode: GAMESTATE.gameCode },
      "text",
      true
    );
    header.appendChild(title);
  }
}
