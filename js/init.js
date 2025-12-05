import { initI18n } from "./lang_i18n.js";
import { initPanelNavigation } from "./panelnavigation.js";
import { gameInitFromStorage } from "./gamestate.js";

gameInitFromStorage(); // GameState
initI18n(); // Translation
initPanelNavigation(); // Navigation