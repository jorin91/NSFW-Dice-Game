// panel-newgame.js
import { setI18n } from "./lang_i18n.js";
import { makeInputField, makeSelectField } from "./elementHelpers.js";
import { getSettingsModel } from "./settings.js";
import { GAMESTATE } from "./gamestate.js";

let createClickHandler = null;

export function setupPanelNewGame() {
  const newGameButton = document.getElementById("panel-newgame.button.create");
  if (newGameButton) {
    newGameButton.addEventListener("click", (e) => {
      buildSettingsElement();
    });
  }
}

function buildSettingsElement() {
  const body = document.getElementById("panel-newgame.body");
  const createButton = document.getElementById("panel-newgame.button.create");
  if (!body || !createButton) return;

  const settings = getSettingsModel();

  let settingsPanel = document.getElementById("panel-newgame.body.settings");
  if (!settingsPanel) {
    settingsPanel = document.createElement("div");
    settingsPanel.id = "panel-newgame.body.settings";
    settingsPanel.className = "col";
    body.appendChild(settingsPanel);
  } else {
    settingsPanel.innerHTML = "";
  }

  for (const key of Object.keys(settings)) {
    const setting = settings[key];
    const settingElement = createSettingElement(key, setting);
    settingsPanel.appendChild(settingElement);
  }

  if (createClickHandler) {
    createButton.removeEventListener("click", createClickHandler);
  }

  createClickHandler = handleCreateClick.bind(null, settings);
  createButton.addEventListener("click", createClickHandler);
}

function createSettingElement(key, setting) {
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

  // Create input for each sub-setting

  for (const subKey of Object.keys(setting)) {
    if (subKey === "i18nTitle" || subKey === "i18nDesc") continue;
    const subSetting = setting[subKey];

    const subSettingContainer = document.createElement("div");
    subSettingContainer.className = "row setting";

    if (subSetting && typeof subSetting === "object") {
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

      subSettingContainer.appendChild(input);
    }

    container.appendChild(subSettingContainer);
  }

  return container;
}

function handleCreateClick(settings, e) {
  GAMESTATE.settings = settings;
}
