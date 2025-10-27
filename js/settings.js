import { STAGE_ENUM } from "./enums.js";
import { gameSaveState } from "./gamestate.js";

export function fillSettingsStage(targetId = "settings_stage") {
  const root = document.getElementById(targetId);
  if (!root) return;

  if (!window.GAME?.settings?.stages) {
    window.GAME.settings.stages = getSettingStages();
  }

  // root.innerHTML = "";

  // voor elke stage een rij met checkbox + naam + korte uitleg
  for (const [key, cfg] of Object.entries(window.GAME.settings.stages)) {
    const { value, enabled } = cfg;

    const row = document.createElement("div");
    row.className = "list row";

    const id = `stage_${key.toLowerCase()}`;

    // Checkbox
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = id;
    cb.checked = !!enabled;
    cb.dataset.stageKey = key;
    cb.className = "stage-toggle";

    // Label + tekst
    const label = document.createElement("label");
    label.setAttribute("for", id);
    // label.className = "flex gap-2 items-center";

    const nameSpan = document.createElement("span");
    nameSpan.setAttribute("data-i18n-auto", `${value}.name`);

    const descSpan = document.createElement("span");
    descSpan.className = "muted";
    descSpan.setAttribute("data-i18n-auto", `${value}.descShort`);

    // Voeg beide spans aan label toe
    label.appendChild(nameSpan);
    label.appendChild(descSpan);

    // Voeg checkbox en label toe aan row
    row.appendChild(cb);
    row.appendChild(label);

    // Voeg row toe aan root
    root.appendChild(row);

    // Checkbox event
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
