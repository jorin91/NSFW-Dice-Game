/**
 * Maakt een settings-object op basis van een enum-structuur.
 *
 * Input:
 *   const ENUM = {
 *     OPTION_A: "ENUM.OPTION_A",
 *     OPTION_B: "ENUM.OPTION_B"
 *   }
 *
 * Output:
 *   {
 *     ENUM: {
 *       OPTION_A: { enabled: true },
 *       OPTION_B: { enabled: true }
 *     }
 *   }
 *
 * Waarom?
 * - Settings worden automatisch gegenereerd op basis van je enums.
 * - Je hoeft nooit handmatig settingsstructuren te dupliceren.
 * - Consistentie tussen enum-keys en instellingen blijft gegarandeerd.
 *
 * @param {string} enumName - De naam van het enum-object, zoals "SEXACT_ENUM".
 * @param {object} enumObj - Het enum-object zelf.
 * @returns {object} Een settings-object met alle enum-opties default enabled.
 */
export function createSettingsFromEnum(enumName, enumObj) {
  const settings = {};

  // Elk enum-object krijgt zijn eigen settings root
  settings[enumName] = {};

  // Loop door alle enum keys en maak default instelling
  for (const key of Object.keys(enumObj)) {
    settings[enumName][key] = {
      enabled: true
    };
  }

  return settings;
}
