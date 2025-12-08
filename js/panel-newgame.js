// panel-newgame.js
import { setI18n } from "./lang_i18n.js";
import { makeInputField, makeSelectField } from "./elementHelpers.js";
import { getSettingsModel } from "./settings.js";

export function setupPanelNewGame() {
  buildSettingsElement();
}

function buildSettingsElement() {
  const body = document.getElementById("panel-newgame.body");
  if (!body) return;

  const settings = getSettingsModel();

  let settingsPanel = document.getElementById("panel-newgame.body.settings");
  if (!settingsPanel) {
    settingsPanel = document.createElement("div");
    settingsPanel.id = "panel-newgame.body.settings";
    settingsPanel.className = "col small";
    body.appendChild(settingsPanel);
  } else {
    settingsPanel.innerHTML = "";
  }

  for (const key of Object.keys(settings)) {
    const setting = settings[key];
    const settingElement = createSettingElement(key, setting);
    settingsPanel.appendChild(settingElement);
  }
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

  // Create checkboxes for each sub-setting

  for (const subKey of Object.keys(setting)) {
    if (subKey === "i18nTitle" || subKey === "i18nDesc") continue;
    const subSetting = setting[subKey];

    const subSettingContainer = document.createElement("div");
    subSettingContainer.className = "row setting";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = subSetting.enabled;
    checkbox.addEventListener("change", () => {
      subSetting.enabled = checkbox.checked;
    });

    const label = document.createElement("label");
    setI18n(label, subSetting.value);

    const description = document.createElement("span");
    setI18n(description, `${subSetting.value}.desc`);

    subSettingContainer.append(checkbox, label, description);

    container.appendChild(subSettingContainer);
  }

  return container;
}