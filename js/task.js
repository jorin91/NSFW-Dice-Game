// js/task.js
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

// Lazy init in plaats van direct bij import
let _TASK_MODEL_PROMISE = null;

export async function getTaskModel() {
  try {
    if (!_TASK_MODEL_PROMISE) {
      _TASK_MODEL_PROMISE = buildSettingsCollectionAsync(
        GAMECATEGORY_ENUM,
        true,
        10
      );
    }

    const model = await _TASK_MODEL_PROMISE;
    return deepCopy(model);
  } catch (e) {
    console.error("[task] getTaskModel failed:", e);
    // Fallback: leeg model voor alle categorieën
    const empty = {};
    for (const [key, value] of Object.entries(GAMECATEGORY_ENUM)) {
      empty[key] = {
        value,
        // enabled: true,
        weight: 10,
        tasks: [],
      };
    }
    return empty;
  }
}

// Dynamisch laden van tasks/<KEY>.js
async function loadTasksForKey(key) {
  try {
    const module = await import(`./tasks/${key}.js`);
    return Array.isArray(module.TASKS) ? module.TASKS : [];
  } catch (e) {
    console.warn(`[task] tasks/${key}.js niet gevonden of kapot:`, e);
    // Bestaat niet → geen taken
    return [];
  }
}

/**
 * Bouwt een settings-collectie op basis van een enum-object.
 */
async function buildSettingsCollectionAsync(
  enumObj,
  defaultEnabled = true,
  defaultWeight = 10
) {
  const out = {};

  try {
    for (const [key, value] of Object.entries(enumObj)) {
      const tasks = await loadTasksForKey(key);

      out[key] = {
        value,
        enabled: defaultEnabled,
        weight: defaultWeight,
        tasks,
      };
    }
  } catch (e) {
    console.error("[task] buildSettingsCollectionAsync error:", e);
    // Bij echte crash: fallback leeg model
    for (const [key, value] of Object.entries(enumObj)) {
      out[key] = {
        value,
        enabled: defaultEnabled,
        weight: defaultWeight,
        tasks: [],
      };
    }
  }

  return out;
}
