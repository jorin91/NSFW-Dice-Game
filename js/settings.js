import { STAGE_ENUM } from "./enums.js";

export function fillSettingsStage(targetId = "settings_stage") {
  const root = document.getElementById(targetId);
  if (!root) return;

  root.innerHTML = "";

}

export function getSettingStages() {
  const stages = {};
  for (const [key, value] of Object.entries(STAGE_ENUM)) {
    stages[key] = {
      value,
      enabled: true
    };
  }
  return stages;
}
