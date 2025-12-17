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

/**
 * GAMEPHASE_ENUM
 *
 * GAMEPHASE bepaalt de toegestane grenzen van het spel.
 * Elke fase beschrijft:
 * - hoe ver uitkleden mag gaan
 * - hoe fysiek contact eruitziet
 * - of seksuele intentie is toegestaan
 *
 * De fase is GEEN sfeer en GEEN type opdracht.
 * De fase is een hard kader waarbinnen opdrachten plaatsvinden.
 */
export const GAMEPHASE_ENUM = Object.freeze({
  /**
   * SAFE
   * Volledig sociaal veilige startfase.
   *
   * Kleding:
   * - Iedereen is gekleed
   * - Hooguit uitkleden tot shirt, broek en sokken
   *
   * Fysiek contact:
   * - Luchtig en functioneel
   * - Geen intieme aanrakingen
   *
   * Seksuele lading:
   * - Niet aanwezig
   * - Geen seksuele intentie
   */
  SAFE: "GAMEPHASE_ENUM.SAFE",

  /**
   * NAUGHTY
   * Ondeugend, speels en grensopzoekend.
   *
   * Kleding:
   * - Uitkleden is actief onderdeel van het spel
   * - Minimum is ondergoed of badkleding
   * - Groepscontext blijft gekleed genoeg om veilig te blijven
   *
   * Fysiek contact:
   * - Meer dan SAFE
   * - Plagerig, speels, flirterig
   * - Geen intieme zones
   *
   * Seksuele lading:
   * - Nog niet seksueel gericht
   * - Wel ondeugend en spannend
   */
  NAUGHTY: "GAMEPHASE_ENUM.NAUGHTY",

  /**
   * EXPOSE
   * Naakt wordt het expliciete doel.
   *
   * Kleding:
   * - Alle kleding mag en zal uit
   * - Iedereen eindigt volledig naakt
   * - Geen keuzevrijheid: naakt zijn is onderdeel van het spel
   *
   * Fysiek contact:
   * - Gelijk aan NAUGHTY
   * - Geen uitbreiding richting intieme aanraking
   *
   * Seksuele lading:
   * - Nog geen seksuele intentie
   * - Spanning komt uit naakt zijn en bekeken worden
   */
  EXPOSE: "GAMEPHASE_ENUM.EXPOSE",

  /**
   * DISCOVERY
   * Verkennen van aanraking zonder seksueel doel.
   *
   * Kleding:
   * - Iedereen is volledig naakt
   *
   * Fysiek contact:
   * - Het hele lichaam mag worden aangeraakt
   * - Aanrakingen zijn ontdekkend en niet doelgericht
   *
   * Seksuele lading:
   * - De opdracht zelf is niet seksueel
   * - Opwinding mag ontstaan, maar is geen doel
   */
  DISCOVERY: "GAMEPHASE_ENUM.DISCOVERY",

  /**
   * EROTIC_TEASE
   * Erotische prikkeling en verleiding.
   *
   * Kleding:
   * - Iedereen is naakt
   *
   * Fysiek contact:
   * - Erotisch beladen aanrakingen toegestaan
   * - Gericht op prikkelen en verlangen opbouwen
   *
   * Seksuele lading:
   * - Seks wordt duidelijk gesuggereerd
   * - Seks zelf vindt nog niet plaats
   */
  EROTIC_TEASE: "GAMEPHASE_ENUM.EROTIC_TEASE",

  /**
   * FOREPLAY
   * Seksgerichte interacties zonder penetratie als doel.
   *
   * Kleding:
   * - Iedereen is naakt
   *
   * Fysiek contact:
   * - Seksgericht, variërend en speels
   * - Penetratie kan incidenteel voorkomen
   *
   * Seksuele lading:
   * - Seksuele handelingen zijn toegestaan
   * - Penetratie is gevolg of beloning, niet het doel
   * - Orgasme wordt niet nagestreefd
   */
  FOREPLAY: "GAMEPHASE_ENUM.FOREPLAY",

  /**
   * SEX_PENETRATION
   * Seks staat centraal.
   *
   * Kleding:
   * - Iedereen is naakt
   *
   * Fysiek contact:
   * - Volledige seksuele interactie
   * - Penetratie is het doel
   *
   * Seksuele lading:
   * - Genieten en seksueel samenspel
   * - Orgasme mag, maar hoeft niet
   */
  SEX_PENETRATION: "GAMEPHASE_ENUM.SEX_PENETRATION",

  /**
   * SEX_INTENSE
   * Maximale intensiteit en uithouding.
   *
   * Kleding:
   * - Iedereen is naakt
   *
   * Fysiek contact:
   * - Langduriger, intensiever en uitdagender
   *
   * Seksuele lading:
   * - Orgasme is expliciet doel of uitdaging
   * - Niet klaarkomen wordt een uitdaging
   */
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

/**
 * SEXACT_ENUM
 *
 * Deze enum beschrijft het TYPE seksuele handeling dat in een opdracht
 * kan voorkomen. Het gaat hier om de aard van de interactie,
 * niet om intensiteit, duur of expliciete uitvoering.
 *
 * Belangrijk:
 * - SEXACT wordt alleen gebruikt wanneer seksuele interactie is toegestaan
 *   door de huidige GAMEPHASE.
 * - De concrete uitvoering wordt verder gespecificeerd door BODYZONE_ENUM
 *   en de taakinhoud zelf.
 * - Deze enum beschrijft het "hoe", niet het "hoe ver".
 */
export const SEXACT_ENUM = Object.freeze({
  /**
   * ORAL
   * Seksuele interactie waarbij de mond wordt gebruikt
   * als primaire vorm van contact of stimulatie.
   */
  ORAL: "SEXACT_ENUM.ORAL",

  /**
   * VAGINAL
   * Seksuele interactie gericht op vaginale seks.
   * Alleen van toepassing wanneer dit expliciet is toegestaan
   * binnen de fase en instellingen.
   */
  VAGINAL: "SEXACT_ENUM.VAGINAL",

  /**
   * ANAL
   * Seksuele interactie gericht op anale seks.
   * Altijd expliciet fase- en consent-afhankelijk.
   */
  ANAL: "SEXACT_ENUM.ANAL",

  /**
   * MANUAL
   * Seksuele interactie waarbij handen of vingers
   * de primaire vorm van stimulatie zijn.
   */
  MANUAL: "SEXACT_ENUM.MANUAL",

  /**
   * TOY
   * Seksuele interactie waarbij een speeltje of object
   * wordt gebruikt als onderdeel van de handeling.
   */
  TOY: "SEXACT_ENUM.TOY",
});

/**
 * BODYZONE_ENUM
 *
 * Deze enum beschrijft lichaamszones die betrokken kunnen zijn
 * bij opdrachten, aanraking of seksuele interactie.
 *
 * Belangrijk:
 * - BODYZONE beschrijft WAAR iets plaatsvindt, niet WAT er gebeurt.
 * - Welke zones gebruikt mogen worden hangt af van:
 *   - GAMEPHASE
 *   - actieve categorieën
 *   - actieve instellingen
 */
export const BODYZONE_ENUM = Object.freeze({
  /**
   * Algemene lichaamszone.
   * Wordt gebruikt wanneer andere specifieke zones niet van toepassing zijn.
   */
  BODY: "BODYZONE_ENUM.BODY",

  /**
   * Nek en halsgebied.
   */
  NECK: "BODYZONE_ENUM.NECK",

  /**
   * Buik en onderbuik.
   */
  BELLY: "BODYZONE_ENUM.BELLY",

  /**
   * Billen.
   */
  BUTT: "BODYZONE_ENUM.BUTT",

  /**
   * PUBIC
   * Gebied rondom de geslachtsdelen.
   * Bijvoorbeeld: Schaamstreek, mons pubis, liezen, etc.
   */
  PUBIC: "BODYZONE_ENUM.PUBIC",

  /**
   * Borst(en).
   */
  BREASTS: "BODYZONE_ENUM.BREASTS",

  /**
   * Penis.
   */
  PENIS: "BODYZONE_ENUM.PENIS",

  /**
   * Vagina.
   */
  VAGINA: "BODYZONE_ENUM.VAGINA",

  /**
   * Anus.
   */
  ANUS: "BODYZONE_ENUM.ANUS",

  /**
   * Mond.
   */
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
