import { initI18n } from "./lang_i18n.js";
import { initPanelNavigation } from "./panelnavigation.js";
import { gameInitFromStorage } from "./gamestate.js";
import { firebaseWriteTest } from "./firebase/firebase-test.js";

gameInitFromStorage(); // GameState
initI18n(); // Translation
initPanelNavigation(); // Navigation
await firebaseWriteTest(); // Firebase Test