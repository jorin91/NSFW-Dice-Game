import { initI18n } from './lang_i18n.js';
import { attachPanelNavigation } from './panelnavigation.js';
import { deepCopy } from './utils.js';
import { GAME_FLOW_MODEL, gameInitFromStorage } from './gamestate.js';

window.GAME = deepCopy(GAME_FLOW_MODEL);

document.addEventListener("DOMContentLoaded", () => {
  initI18n(); // Translation
  attachPanelNavigation(); // Navigation
  gameInitFromStorage(); // GameState
});