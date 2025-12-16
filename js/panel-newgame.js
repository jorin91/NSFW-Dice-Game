// js/panel-newgame.js
import { setI18n } from "./lang_i18n.js";
import { makeInputField, makeSelectField } from "./elementHelpers.js";
import { getSettingsModel } from "./settings.js";
import { GAMESTATE } from "./gamestate.js";
import { randomNumberString } from "./utils.js";
import { createGame } from "./firebase/firebase-game.js";
import { PLAYER } from "./player.js";
import { getTaskModel } from "./task.js";
import { setupPanelGame } from "./panel-game.js";

let createClickHandler = null;

export function setupPanelNewGame() {
  const createButton = document.getElementById(
    "panel-mainmenu.button.createGame"
  );
  if (createButton) {
    createButton.addEventListener("click", (e) => {
      buildSettingsElement();
    });
  }
}

function buildSettingsElement() {
  const body = document.getElementById("panel-newgame.body");
  const createButton = document.getElementById("panel-newgame.button.create");
  if (!body || !createButton) return;

  const settings = getSettingsModel();
  const tasks = getTaskModel();

  let settingsPanel = document.getElementById("panel-newgame.body.settings");
  if (!settingsPanel) {
    settingsPanel = document.createElement("div");
    settingsPanel.id = "panel-newgame.body.settings";
    settingsPanel.className = "col";
    body.appendChild(settingsPanel);
  } else {
    settingsPanel.innerHTML = "";
  }

  // Load all settings related task keys to check if setting is used at all
  const taskKeys = new Set();
  for (const categoryKey of Object.keys(tasks)) {
    taskKeys.add(categoryKey);

    // Lets get all sub-keys as well
    const categoryTasks = tasks[categoryKey];
    for (const task of categoryTasks) {
      const conditions = task.conditions;
      for (const condition of conditions) {
        if (Array.isArray(condition) && condition.length > 0) {
          for (const key of condition) {
            taskKeys.add(key);
          }
        }
      }
    }
  }

  for (const key of Object.keys(settings)) {
    const setting = settings[key];
    const settingElement = createSettingElement(key, setting, taskKeys);
    if (settingElement) settingsPanel.appendChild(settingElement);
  }

  if (createClickHandler) {
    createButton.removeEventListener("click", createClickHandler);
  }

  createClickHandler = handleCreateClick.bind(null, settings);
  createButton.addEventListener("click", createClickHandler);
}

function createSettingElement(key, setting, taskKeys) {
  const container = document.createElement("div");
  container.className = "col small";
  container.id = `setting-${key}`;

  if (setting.i18nTitle) {
    const header = document.createElement("h4");
    setI18n(header, setting.i18nTitle);
    container.appendChild(header);
  }

  if (setting.i18nDesc) {
    const desc = document.createElement("p");
    setI18n(desc, setting.i18nDesc);
    container.appendChild(desc);
  }

  // Propertie to check if we added settings
  let hasSettings = false;

  // Create input for each sub-setting
  for (const subKey of Object.keys(setting)) {
    if (subKey === "i18nTitle" || subKey === "i18nDesc") continue;
    const subSetting = setting[subKey];

    const subSettingContainer = document.createElement("div");
    subSettingContainer.className = "row setting";

    if (subSetting && typeof subSetting === "object") {
      // Check for taskKeys. If setting is not used in any task, skip it, no need to show it.
      if (taskKeys.size === 0 || !taskKeys.has(subKey)) continue;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = subSetting.enabled;
      checkbox.addEventListener("change", () => {
        subSetting.enabled = checkbox.checked;
      });

      // row listener to turn row into a clickable area for the checkbox
      subSettingContainer.addEventListener("click", (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        }
      });

      const label = document.createElement("label");
      setI18n(label, subSetting.value);

      const description = document.createElement("span");
      setI18n(description, `${subSetting.value}.desc`);

      hasSettings = true;
      subSettingContainer.append(checkbox, label, description);
    } else if (typeof subSetting === "number") {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.step = "1";
      input.value = subSetting;

      input.addEventListener("change", () => {
        let val = parseInt(input.value, 10);
        setting[subKey] = val;
      });

      hasSettings = true;
      subSettingContainer.appendChild(input);
    }

    container.appendChild(subSettingContainer);
  }

  if (!hasSettings) return null;
  return container;
}

async function handleCreateClick(settings, e) {
  // Check for complete player profile
  if (
    !PLAYER.name ||
    !PLAYER.age ||
    PLAYER.age <= 0 ||
    !PLAYER.sex ||
    !PLAYER.sexTarget
  ) {
    return;
  }

  const footer = document.getElementById("panel-newgame.footer");
  const status = document.getElementById("panel-newgame.footer.status");
  if (status) {
    status.remove();
  }

  PLAYER.game.consent = true;

  GAMESTATE.gameID = randomNumberString(8);
  GAMESTATE.gameCode = randomNumberString(4);
  GAMESTATE.settings = settings;
  GAMESTATE.tasks = await getTaskModel();
  GAMESTATE.players = [PLAYER];
  const result = await createGame();

  if (result.message && footer) {
    const message = document.createElement("div");
    message.id = "panel-newgame.footer.status";
    setI18n(message, result.message);
    footer.appendChild(message);
  }

  if (!result.success) {
    return;
  }

  setupPanelGame();
}
