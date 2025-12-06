// ENUMS
export const SEXTARGET_ENUM = Object.freeze({
  Male: "SEXTARGET_ENUM.Male",
  Female: "SEXTARGET_ENUM.Female",
  Both: "SEXTARGET_ENUM.Both",
});

export const SEXSELF_ENUM = Object.freeze({
  Male: "SEXSELF_ENUM.Male",
  Female: "SEXSELF_ENUM.Female",
});

// HELPERS
/**
 * Check of de 'self' sex voldoet aan de 'target' voorkeur.
 * 
 * @param {string} self - waarde uit SEXSELF_ENUM
 * @param {string} target - waarde uit SEXTARGET_ENUM
 * @returns {boolean}
 */
export function sexMatchesTarget(self, target) {
    if (!self || !target) return false;

    switch (target) {
        case SEXTARGET_ENUM.Both:
            return true; // alles OK
        case SEXTARGET_ENUM.Male:
            return self === SEXSELF_ENUM.Male;
        case SEXTARGET_ENUM.Female:
            return self === SEXSELF_ENUM.Female;
        default:
            return false;
    }
}