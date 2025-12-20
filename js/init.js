import { initI18n } from "./lang_i18n.js";
import { initPanelNavigation } from "./panelnavigation.js";
import { firebaseWriteTest } from "./firebase/firebase-test.js";
import { setupPanelNewGame_Player, setupPanelNewGame_Clothes, setupPanelNewGame_Settings } from "./panel-new-game.js";
import { set } from "./firebase/firebase-init.js";
import { setupPanelJoinGame } from "./panel-joingame.js";
import { setupPanelMenuLanguage } from "./panel-menu-language.js";
import { setupPanelMainMenu } from "./panel-main-menu.js";
import { setupPanelGameTask, setupPanelGamePlay } from "./panel-game.js";

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
  setupPanelMainMenu(); // Setup Main Menu Panel

  // Hidden panels
  setupPanelNewGame_Player(); // Setup New Game - Player Panel
  setupPanelNewGame_Clothes(); // Setup New Game - Clothes Panel
  await setupPanelNewGame_Settings(); // Setup New Game - Settings Panel
  setupPanelJoinGame(); // Setup Join Game Panel
  setupPanelGameTask(); // Setup Game Task Panel
  setupPanelGamePlay(); // Setup Game Play Panel
}

document.addEventListener("DOMContentLoaded", async () => {
  await initFunctions();
  await initPanels();
});
