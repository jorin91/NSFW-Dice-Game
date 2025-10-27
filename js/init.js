import { initI18n } from './lang_i18n.js';
import { attachPanelNavigation } from './panelnavigation.js';
import { deepCopy } from './utils.js';
import { GAME_FLOW_MODEL, gameInitFromStorage } from './gamestate.js';
import { fillSettingsStage, fillSettingsIntensity, fillSettingsExtremity, fillSettingsAct } from './settings.js';
import { UpdatePlayersUI, UpdateNewPlayerUI } from './newgame.js';

window.GAME = deepCopy(GAME_FLOW_MODEL);

document.addEventListener("DOMContentLoaded", () => {
  initI18n(); // Translation
  gameInitFromStorage(); // GameState
  attachPanelNavigation(); // Navigation
  fillSettingsStage(); // Fill settings section
  fillSettingsIntensity(); // Fill settings section
  fillSettingsExtremity(); // Fill settings section
  fillSettingsAct(); // Fill settings section
  UpdatePlayersUI(); // Fill players UI for new game
  UpdateNewPlayerUI();
});