import { initI18n } from "./lang_i18n.js";
import { initPanelNavigation } from "./panelnavigation.js";
import { firebaseWriteTest } from "./firebase/firebase-test.js";
import {
  setupPanelPlayerOverview,
  setupPanelPlayerSetup,
} from "./panel-player.js";
import { setupPanelNewGame } from "./panel-newgame.js";
import { set } from "./firebase/firebase-init.js";
import { setupPanelJoinGame } from "./panel-joingame.js";
import { setupPanelMenuLanguage } from "./panel-menu-language.js";
import { setupPanelMainMenu } from "./panel-main-menu.js";

export async function initFunctions() {
  // Initialization functions
  initI18n(); // Translation
  initPanelNavigation(); // Navigation
  // await firebaseWriteTest(); // Firebase Test
}

export async function initPanels() {
  // Initialize or update all panels in order
  // Visible panels
  await setupPanelMenuLanguage(); // Setup Language Menu Panel
  setupPanelPlayerOverview(); // Setup Player Panel
  setupPanelPlayerSetup(); // Setup Player Setup Panel
  setupPanelMainMenu(); // Setup Main Menu Panel

  // Hidden panels
  setupPanelNewGame(); // Setup New Game Panel
  setupPanelJoinGame(); // Setup Join Game Panel
}

document.addEventListener("DOMContentLoaded", async () => {
  await initFunctions();
  await initPanels();
});
