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

export const SETTINGS_MODEL = {
  gamephase: buildSettingsCollection(GAMEPHASE_ENUM),
  gamecategory: buildSettingsCollection(GAMECATEGORY_ENUM),
  sexact: buildSettingsCollection(SEXACT_ENUM),
  bodyzone: buildSettingsCollection(BODYZONE_ENUM),
};

export function getSettingsModel() {
  return deepCopy(SETTINGS_MODEL);
}

function buildSettingsCollection(enumObj, defaultEnabled = true) {
  const out = {};
  for (const [key, value] of Object.entries(enumObj)) {
    out[key] = { value, enabled: defaultEnabled };
  }
  return out;
}
