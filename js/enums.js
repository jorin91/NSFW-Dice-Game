// enums.js
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

/**
 * GAMECATEGORY_ENUM
 *
 * Deze enum definieert de categorieën (tags) die bepalen
 * wat voor soort opdracht wordt uitgevoerd en in welke context.
 *
 * Belangrijk ontwerpprincipe:
 * - Categorieën beschrijven de VORM (core) en de CONTEXT (lading) van een opdracht
 * - Ze beschrijven NIET de intensiteit (dat doet GAMEPHASE)
 * - Ze beschrijven NIET de concrete seksuele handeling (dat doen SEXACT/BODYZONE)
 *
 * Meerdere categorieën mogen gecombineerd worden.
 * De uiteindelijke invulling ontstaat uit:
 *   core + context + gamephase + task-inhoud
 */

export const GAMECATEGORY_ENUM = Object.freeze({
  /* ==========================================================
   * CORE CATEGORIEËN
   * ----------------------------------------------------------
   * Bepalen de vorm of mechaniek van de opdracht.
   * Ze zeggen WAT voor soort actie centraal staat.
   * ========================================================== */

  /**
   * POSE
   * Poseren of presenteren zonder beweging.
   * De speler neemt een houding aan en blijft daarin.
   * Geen lopen, draaien of uitvoeren van acties.
   */
  POSE: "GAMECATEGORY_ENUM.POSE",

  /**
   * EXPOSE
   * Tonen of zichtbaar maken.
   * Geen aanraking, alleen kijken.
   * Altijd vanuit: "ik laat zien", niet "ik kijk".
   */
  EXPOSE: "GAMECATEGORY_ENUM.EXPOSE",

  /**
   * TOUCH
   * Fysiek contact en aanraking.
   * Elke opdracht waarbij aanraken centraal staat.
   */
  TOUCH: "GAMECATEGORY_ENUM.TOUCH",

  /**
   * DRESS
   * Aankleden.
   * Het aantrekken of aanpassen van kleding,
   * door jezelf of door een andere speler.
   */
  DRESS: "GAMECATEGORY_ENUM.DRESS",

  /**
   * UNDRESS
   * Uitkleden.
   * Het verwijderen van kleding,
   * gedeeltelijk of volledig.
   */
  UNDRESS: "GAMECATEGORY_ENUM.UNDRESS",

  /**
   * CHALLENGE
   * Doelgerichte opdrachten.
   * De speler moet iets proberen te behalen,
   * volhouden, durven of vergelijken.
   */
  CHALLENGE: "GAMECATEGORY_ENUM.CHALLENGE",

  /**
   * MOVEMENT
   * Beweging als hoofddoel.
   * De opdracht draait om bewegen, positioneren of verplaatsen,
   * niet om een ander doel waarbij beweging slechts nodig is.
   */
  MOVEMENT: "GAMECATEGORY_ENUM.MOVEMENT",

  /* ==========================================================
   * CONTEXT CATEGORIEËN
   * ----------------------------------------------------------
   * Bepalen de lading, sfeer en intentie van de opdracht.
   * Ze zeggen HOE de opdracht aanvoelt.
   * ========================================================== */

  /**
   * SOCIAL
   * Laagdrempelig, veilig en niet-intiem.
   * Geschikt voor ontspanning, humor en sociale interactie.
   */
  SOCIAL: "GAMECATEGORY_ENUM.SOCIAL",

  /**
   * PLAYFUL
   * Ondeugend, plagerig en speels.
   * Spanning ontstaat uit humor en speels gedrag,
   * niet uit intimiteit of seks.
   */
  PLAYFUL: "GAMECATEGORY_ENUM.PLAYFUL",

  /**
   * INTIMATE
   * Intiem en dichtbij, meestal (bijna) naakt.
   * Spanning ontstaat uit nabijheid en kwetsbaarheid.
   * Expliciet GEEN seks of seksuele handelingen.
   */
  INTIMATE: "GAMECATEGORY_ENUM.INTIMATE",

  /**
   * EROTIC
   * Gericht op seks.
   * Altijd seksuele focus, spanning of verleiding.
   * Niet per se seks zelf, maar wel met seks als doel.
   */
  EROTIC: "GAMECATEGORY_ENUM.EROTIC",
});

export const SEXACT_ENUM = Object.freeze({
  ORAL: "SEXACT_ENUM.ORAL",
  VAGINAL: "SEXACT_ENUM.VAGINAL",
  ANAL: "SEXACT_ENUM.ANAL",
  MANUAL: "SEXACT_ENUM.MANUAL",
  TOY: "SEXACT_ENUM.TOY",
});

export const BODYZONE_ENUM = Object.freeze({
  BODY: "BODYZONE_ENUM.BODY",
  NECK: "BODYZONE_ENUM.NECK",
  BELLY: "BODYZONE_ENUM.BELLY",
  BUTT: "BODYZONE_ENUM.BUTT",
  PUBIC: "BODYZONE_ENUM.PUBIC", // schaamstreek (incl. lies + mons)
  BREASTS: "BODYZONE_ENUM.BREASTS",
  PENIS: "BODYZONE_ENUM.PENIS",
  VAGINA: "BODYZONE_ENUM.VAGINA",
  ANUS: "BODYZONE_ENUM.ANUS",
  MOUTH: "BODYZONE_ENUM.MOUTH",
});

export const TASKPLAYERTARGET_ENUM = Object.freeze({
  loser: 0,
  winner: 1,
  other: 2,
});

export const TASKCOMPLETETYPE_ENUM = Object.freeze({
  once: 0,
  count: 1,
  time: 2,
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
