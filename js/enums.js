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

export const GAMEPHASE_ENUM = Object.freeze({
  SAFE: "GAMEPHASE_ENUM.SAFE",
  NAUGHTY: "GAMEPHASE_ENUM.NAUGHTY",
  EXPOSE: "GAMEPHASE_ENUM.EXPOSE",
  DISCOVERY: "GAMEPHASE_ENUM.DISCOVERY",
  EROTIC_TEASE: "GAMEPHASE_ENUM.EROTIC_TEASE",
  FOREPLAY: "GAMEPHASE_ENUM.FOREPLAY",
  SEX_PENETRATION: "GAMEPHASE_ENUM.SEX_PENETRATION",
  SEX_INTENSE: "GAMEPHASE_ENUM.SEX_INTENSE",
});

export const GAMECATEGORY_ENUM = Object.freeze({
  POSE: "GAMECATEGORY_ENUM.POSE",
  EXPOSE: "GAMECATEGORY_ENUM.EXPOSE",
  TOUCH: "GAMECATEGORY_ENUM.TOUCH",
  DRESS: "GAMECATEGORY_ENUM.DRESS",
  UNDRESS: "GAMECATEGORY_ENUM.UNDRESS",
  CHALLENGE: "GAMECATEGORY_ENUM.CHALLENGE",
  MOVEMENT: "GAMECATEGORY_ENUM.MOVEMENT"
});

export const SEXACT_ENUM = Object.freeze({
  ORAL: "SEXACT_ENUM.ORAL",
  VAGINAL: "SEXACT_ENUM.VAGINAL",
  ANAL: "SEXACT_ENUM.ANAL",
  MANUAL: "SEXACT_ENUM.MANUAL",
  TOY: "SEXACT_ENUM.TOY"
});

export const BODYZONE_ENUM = Object.freeze({
  BODY: "BODYZONE_ENUM.BODY",
  NECK: "BODYZONE_ENUM.NECK",
  BELLY: "BODYZONE_ENUM.BELLY",
  BUTT: "BODYZONE_ENUM.BUTT",
  PUBIC: "BODYZONE_ENUM.PUBIC",     // schaamstreek (incl. lies + mons)
  BREASTS: "BODYZONE_ENUM.BREASTS",
  PENIS: "BODYZONE_ENUM.PENIS",
  VAGINA: "BODYZONE_ENUM.VAGINA",
  ANUS: "BODYZONE_ENUM.ANUS",
  MOUTH: "BODYZONE_ENUM.MOUTH"
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
