// settings.js
import { deepCopy } from "./utils.js";
import {
  SEXTARGET_ENUM,
  SEXSELF_ENUM,
  GAMEPHASE_ENUM,
  GAMECATEGORY_ENUM,
  SEXACT_ENUM,
  BODYZONE_ENUM,
  TASKPLAYERTARGET_ENUM,
} from "./enums.js";
import { setI18n } from "./lang_i18n.js";

export const SETTINGS_MODEL = {
  gamephase: buildSettingsCollection(GAMEPHASE_ENUM, true, "GAMEPHASE_ENUM"),
  gamecategory: buildSettingsCollection(
    GAMECATEGORY_ENUM,
    true,
    "GAMECATEGORY_ENUM"
  ),
  sexact: buildSettingsCollection(SEXACT_ENUM, true, "SEXACT_ENUM"),
  bodyzone: buildSettingsCollection(BODYZONE_ENUM, true, "BODYZONE_ENUM"),
};

export function getSettingsModel() {
  return deepCopy(SETTINGS_MODEL);
}

function buildSettingsCollection(
  enumObj,
  defaultEnabled = true,
  enumName = null
) {
  const out = {};
  for (const [key, value] of Object.entries(enumObj)) {
    out[key] = { value, enabled: defaultEnabled };
  }
  if (enumName) {
    out.i18nTitle = enumName;
    out.i18nDesc = `${enumName}.desc`;
  }
  return out;
}

export function buildSettingsElement() {
  const body = document.getElementById("panel-newgame.body");
  if (!body) return;

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
}

function createSettingElement(key, setting) {
  const container = document.createElement("div");
  container.className = "col";
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
    subSettingContainer.className = "row equal";

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
