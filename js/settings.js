import { STAGE_ENUM } from "./enums.js";
import { gameSaveState } from "./gamestate.js";

export function fillSettingsStage(targetId = "settings_stage") {
  const root = document.getElementById(targetId);
  if (!root) return;

  if (!window.GAME?.settings?.stages) {
    window.GAME.settings.stages = getSettingStages();
  }

  root.innerHTML = "";

  // voor elke stage een rij met checkbox + naam + korte uitleg
  for (const [key, cfg] of Object.entries(window.GAME.settings.stages)) {
    const { value, enabled } = cfg;

    const row = document.createElement("div");
    row.className = "col";

    const id = `stage_${key.toLowerCase()}`;

    // eerste regel: checkbox + label (naam)
    const line1 = document.createElement("div");
    line1.className = "list row";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = id;
    cb.checked = !!enabled;
    cb.dataset.stageKey = key;
    cb.className = "stage-toggle";

    const label = document.createElement("label");
    label.setAttribute("for", id);

    // naam via i18n-auto: `${value}.name`
    const nameSpan = document.createElement("span");
    nameSpan.setAttribute("data-i18n-auto", `${value}.name`);
    label.appendChild(nameSpan);

    line1.appendChild(cb);
    line1.appendChild(label);

    // tweede regel: descShort
    const line2 = document.createElement("p");
    line2.className = "muted list row";
    line2.setAttribute("data-i18n-auto", `${value}.descShort`);

    row.appendChild(line1);
    row.appendChild(line2);
    root.appendChild(row);

    // wijziging opslaan bij togglen
    cb.addEventListener("change", (e) => {
      const k = e.currentTarget.dataset.stageKey;
      if (!window.GAME?.settings?.stages?.[k]) return;
      window.GAME.settings.stages[k].enabled = e.currentTarget.checked;
      gameSaveState();
    });
  }
}

export function getSettingStages() {
  const stages = {};
  for (const [key, value] of Object.entries(STAGE_ENUM)) {
    stages[key] = {
      value,
      enabled: true,
    };
  }
  return stages;
}
