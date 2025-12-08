// task.js
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

export const TASK_MODEL_PROMISE = buildSettingsCollectionAsync(GAMECATEGORY_ENUM, true, 10);

// Diepe kopie van de huidige state van TASK_MODEL
export async function getTaskModel() {
  const model = await TASK_MODEL_PROMISE;
  return deepCopy(model);
}

// Dynamisch laden van tasks/<KEY>.js
async function loadTasksForKey(key) {
  try {
    const module = await import(`./tasks/${key}.js`);
    return Array.isArray(module.TASKS) ? module.TASKS : [];
  } catch (e) {
    // Bestaat niet → geen taken
    return [];
  }
}

/**
 * Bouwt een settings-collectie op basis van een enum-object.
 * Elke key krijgt:
 * - value: de enum value
 * - enabled: standaard aan/uit
 * - weight: standaard gewicht
 * - tasks: array met taken die geladen worden uit de corresponderende tasks/<KEY>.js bestanden
 */
async function buildSettingsCollectionAsync(enumObj, defaultEnabled = true, defaultWeight = 10) {
  const out = {};

  for (const [key, value] of Object.entries(enumObj)) {
    const tasks = await loadTasksForKey(key);

    out[key] = {
      value,
      enabled: defaultEnabled,
      weight: defaultWeight,
      tasks
    };
  }

  return out;
}