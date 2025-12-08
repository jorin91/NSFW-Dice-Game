// panel-newgame.js
import { setI18n } from "./lang_i18n.js";
import { makeInputField, makeSelectField } from "./elementHelpers.js";
import { getSettingsModel } from "./settings.js";

export function setupPanelNewGame() {
  const body = document.getElementById("panel-newgame.body");
  if (!body) return;

  const settingsModel = getSettingsModel();
}
