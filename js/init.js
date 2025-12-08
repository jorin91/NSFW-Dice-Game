import { initI18n } from "./lang_i18n.js";
import { initPanelNavigation } from "./panelnavigation.js";
import { firebaseWriteTest } from "./firebase/firebase-test.js";
import { setupPanelPlayer, setupPanelPlayerSetup } from "./panel-player.js";
import { setupPanelNewGame } from "./panel-newgame.js";

export async function init() {
  // Initialization functions
  initI18n(); // Translation
  initPanelNavigation(); // Navigation
  await firebaseWriteTest(); // Firebase Test
}

export async function initUpdate() {
  setupPanelPlayer(); // Setup Player Panel
  setupPanelPlayerSetup(); // Setup Player Setup Panel
  setupPanelNewGame(); // Setup New Game Panel
}

document.addEventListener("DOMContentLoaded", async () => {
  await init();
  await initUpdate();
});
