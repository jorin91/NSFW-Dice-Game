import { initI18n } from "./lang_i18n.js";
import { attachPanelNavigation } from "./panelnavigation.js";
import { GAME_FLOW_MODEL, gameInitFromStorage } from "./gamestate.js";
import {
  fillSettingsStage,
  fillSettingsIntensity,
  fillSettingsExtremity,
  fillSettingsAct,
} from "./settings.js";
import { UpdatePlayersUI, UpdateNewPlayerUI, ResetGame } from "./newgame.js";

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
  fillSettingsStage(); // Fill settings section
  fillSettingsIntensity(); // Fill settings section
  fillSettingsExtremity(); // Fill settings section
  fillSettingsAct(); // Fill settings section
  UpdatePlayersUI(); // Fill players UI for new game
  UpdateNewPlayerUI(); // Fill new player UI
  ResetGame(); // Add game reset button
}
