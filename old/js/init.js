import { initI18n } from "./lang_i18n.js";
import { attachPanelNavigation } from "./panelnavigation.js";
import { GAME_FLOW_MODEL, gameInitFromStorage } from "./gamestate.js";
import {
  initGameSettings
} from "./settings.js";
import { InitNewGame } from "./newgame.js";
import { InitGame } from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
  InitCreate();
  InitUpdate();
});

export function InitCreate() {
  initI18n(); // Translation
  attachPanelNavigation(); // Navigation
}

export function InitUpdate() {
  gameInitFromStorage(); // GameState
  initGameSettings(); // Fill Settings Panels
  InitNewGame(); // Init New Game Panel
  InitGame(); // Init Game Panel
}
