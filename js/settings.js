import { STAGE_ENUM, INTENSITY_ENUM, EXTREMITY_ENUM, ACT_ENUM } from "./enums.js";
import { gameSaveState } from "./gamestate.js";


/* ---------- 1) GENERIEKE BUILDER ---------- */
function buildSettingsCollection(enumObj, defaultEnabled = true) {
  const out = {};
  for (const [key, value] of Object.entries(enumObj)) {
    out[key] = { value, enabled: defaultEnabled };
  }
  return out;
}

/* Zorg dat window.GAME.settings[prop] bestaat (lazy init) */
function ensureSettingsCollection(prop, enumObj, defaultEnabled = true) {
  window.GAME = window.GAME || {};
  window.GAME.settings = window.GAME.settings || {};
  if (!window.GAME.settings[prop]) {
    window.GAME.settings[prop] = buildSettingsCollection(enumObj, defaultEnabled);
  }
  return window.GAME.settings[prop];
}

/* ---------- 2) GENERIEKE RENDERER ---------- */
/**
 * Render een lijst toggles op basis van een enum/collectie in game settings.
 * @param {Object} opts
 *   - targetId:  id van de container
 *   - prop:      key in window.GAME.settings (bv. "stage", "intensity", "extremity", "act")
 *   - enumObj:   het ENUM object (bv. STAGE_ENUM)
 */
export function fillSettingsList({ targetId, prop, enumObj }) {
  const root = document.getElementById(targetId);
  if (!root) return;

  const coll = ensureSettingsCollection(prop, enumObj, true);

  // root.innerHTML = "";

  const Wrap = document.createElement("div");
  Wrap.className = "col small";

  for (const [key, cfg] of Object.entries(coll)) {
    const { value, enabled } = cfg;

    const row = document.createElement("label");
    row.className = "row grid3 list";

    const id = `${prop}_${key.toLowerCase()}`;

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = id;
    cb.checked = !!enabled;
    cb.setAttribute("data-key", key);   // generiek attribuut
    cb.setAttribute("data-prop", prop); // zodat 1 handler alles kan verwerken

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.setAttribute("data-i18n-auto", `${value}.name`);

    const desc = document.createElement("span");
    desc.className = "muted";
    desc.setAttribute("data-i18n-auto", `${value}.descShort`);

    row.appendChild(cb);
    row.appendChild(label);
    row.appendChild(desc);
    Wrap.appendChild(row);

    cb.addEventListener("change", (e) => {
      const k = e.currentTarget.getAttribute("data-key");
      const p = e.currentTarget.getAttribute("data-prop");
      if (!window.GAME?.settings?.[p]?.[k]) return;
      window.GAME.settings[p][k].enabled = e.currentTarget.checked;
      gameSaveState();
    });
  }

  root.append(Wrap);
}

/* ---------- CONVENIENCE CALLS ---------- */
/* Gebruik deze waar je eerder de specifieke functies riep: */
// Stages
export function fillSettingsStage(targetId = "settings_stage") {
  fillSettingsList({ targetId, prop: "stage", enumObj: STAGE_ENUM });
}

export function getSettingStages() {
  return buildSettingsCollection(STAGE_ENUM, true);
}

// Intensity
export function fillSettingsIntensity(targetId = "settings_intensity") {
  fillSettingsList({ targetId, prop: "intensity", enumObj: INTENSITY_ENUM });
}

export function getSettingIntensity() {
  return buildSettingsCollection(INTENSITY_ENUM, true);
}

// Extremity
export function fillSettingsExtremity(targetId = "settings_extremity") {
  fillSettingsList({ targetId, prop: "extremity", enumObj: EXTREMITY_ENUM });
}

export function getSettingExtremity() {
  return buildSettingsCollection(EXTREMITY_ENUM, true);
}

// Act (als je die óók als toggles wilt tonen)
export function fillSettingsAct(targetId = "settings_act") {
  fillSettingsList({ targetId, prop: "act", enumObj: ACT_ENUM });
}

export function getSettingAct() {
  return buildSettingsCollection(ACT_ENUM, true);
}