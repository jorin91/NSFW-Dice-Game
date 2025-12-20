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
 * Deze enum definieert de categorieën die bepalen
 * wat voor soort opdracht wordt uitgevoerd.
 *
 * Ontwerpprincipes:
 * - Elke taak heeft in principe één primaire categorie
 * - Categorieën beschrijven WAT het kernmechaniek van de opdracht is
 * - Ze beschrijven NIET de intensiteit (dat doet GAMEPHASE)
 * - Ze beschrijven NIET de concrete seksuele handeling (dat doen SEXACT en BODYZONE)
 *
 * Uitzondering:
 * - CHALLENGE en ROLEPLAY zijn overkoepelende categorieën
 *   en kunnen meerdere andere elementen bevatten binnen één opdracht.
 *
 * De uiteindelijke invulling van een opdracht ontstaat uit:
 *   category + gamephase + task-inhoud (+ optioneel sexact/bodyzone)
 */

export const GAMECATEGORY_ENUM = Object.freeze({
  /* ==========================================================
   * PRESENTATIE & ZICHTBAARHEID
   * ========================================================== */

  /**
   * POSE
   * De speler neemt een houding aan of presenteert zichzelf.
   * Het doel is het aannemen en vasthouden van een positie.
   * Geen actieve handelingen of beweging.
   */
  POSE: "GAMECATEGORY_ENUM.POSE",

  /**
   * EXPOSE
   * De speler laat tijdelijk iets zien.
   * De focus ligt op zichtbaar maken, niet op aanraken.
   * Dit kan door houding, kleding verplaatsen of positionering.
   */
  EXPOSE: "GAMECATEGORY_ENUM.EXPOSE",

  /* ==========================================================
   * KLEDING
   * ========================================================== */

  /**
   * DRESS
   * Het aantrekken, aanpassen of herstellen van kleding.
   * Door de speler zelf of door een andere speler.
   */
  DRESS: "GAMECATEGORY_ENUM.DRESS",

  /**
   * UNDRESS
   * Het verwijderen van kleding.
   * Gedeeltelijk of volledig, bij jezelf of bij een ander.
   */
  UNDRESS: "GAMECATEGORY_ENUM.UNDRESS",

  /* ==========================================================
   * BEWEGING & ACTIE
   * ========================================================== */

  /**
   * MOVEMENT
   * Beweging is het hoofddoel van de opdracht.
   * Denk aan lopen, draaien, verplaatsen of uitvoeren van een actie.
   * Beweging is hier geen middel, maar het doel.
   */
  MOVEMENT: "GAMECATEGORY_ENUM.MOVEMENT",

  /* ==========================================================
   * AANRAKING
   * ========================================================== */

  /**
   * SELF_TOUCH
   * De opdracht draait om aanraking van het eigen lichaam.
   * Aanraken is het doel van de taak.
   * De aard en grenzen worden bepaald door de gamefase.
   */
  SELF_TOUCH: "GAMECATEGORY_ENUM.SELF_TOUCH",

  /**
   * OTHER_TOUCH
   * De opdracht draait om aanraking van het lichaam van een andere speler.
   * Aanraken is het centrale doel van de taak.
   * De aard en grenzen worden bepaald door de gamefase.
   */
  OTHER_TOUCH: "GAMECATEGORY_ENUM.OTHER_TOUCH",

  /* ==========================================================
   * OVERKOEPELENDE MECHANIEKEN
   * ========================================================== */

  /**
   * CHALLENGE
   * De opdracht draait om proberen, durven, vergelijken of presteren.
   * Intensiteit wordt opgevoerd via competitie of een doel.
   *
   * Deze categorie is NIET beperkt tot andere categorieën:
   * een challenge kan elementen bevatten van aanraking, beweging,
   * expose, seks of meerdere acties binnen één opdracht.
   */
  CHALLENGE: "GAMECATEGORY_ENUM.CHALLENGE",

  /**
   * ROLEPLAY
   * De speler neemt een rol aan waarin controle, macht of autonomie
   * (tijdelijk) wordt verlegd.
   *
   * ROLEPLAY is een kader, geen handeling.
   * Opdrachten binnen deze categorie kunnen meerdere elementen bevatten,
   * waaronder aanraking, beweging, expose of seks,
   * afhankelijk van de gamefase en taakinhoud.
   */
  ROLEPLAY: "GAMECATEGORY_ENUM.ROLEPLAY",
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
