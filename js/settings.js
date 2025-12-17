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
  rolls: {
    i18nTitle: "ui.settings.rolls",
    i18nDesc: "ui.settings.rolls.desc",
    value: 3,
  },
  score: {
    i18nTitle: "ui.settings.score",
    i18nDesc: "ui.settings.score.desc",
    value: 3,
  },
  dices: {
    i18nTitle: "ui.settings.dices",
    i18nDesc: "ui.settings.dices.desc",
    value: 5,
  },
  playersCanReroll: {
    i18nTitle: "ui.settings.playersCanReroll",
    i18nDesc: "ui.settings.playersCanReroll.desc",
    value: true,
  },
  playerRerolls: {
    i18nTitle: "ui.settings.playerRerolls",
    i18nDesc: "ui.settings.playerRerolls.desc",
    value: 5,
  },
  loserCount: {
    i18nTitle: "ui.settings.loserCount",
    i18nDesc: "ui.settings.loserCount.desc",
    value: 1,
  },
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
