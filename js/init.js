import { initI18n } from "./lang_i18n.js";
import { initPanelNavigation } from "./panelnavigation.js";
import { firebaseWriteTest } from "./firebase/firebase-test.js";
import { initPlayer } from "./player.js";

initI18n(); // Translation
initPanelNavigation(); // Navigation
initPlayer(); // Player Initialization
await firebaseWriteTest(); // Firebase Test