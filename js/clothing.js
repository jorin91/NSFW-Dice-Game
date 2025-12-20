// clothing.js
import { deepCopy } from "./utils.js";

export const CLOTHING_MODEL = {
  // Laag 1: Ondergoed
  underwear_top: {
    name: "clothes.underwear_top.name",
    desc: "clothes.underwear_top.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "underwear_onepiece",
        "swimwear_top",
        "swimwear_onepiece",
        "clothing_cool_under_top",
        "clothing_cool_under_onepiece",
        "clothing_normal_top",
        "clothing_normal_onepiece",
        "clothing_warm_top",
        "clothing_warm_onepiece",
        "clothing_outside_top",
        "clothing_outside_onepiece"
      ],
      worn: []
    }
  },

  underwear_bottom: {
    name: "clothes.underwear_bottom.name",
    desc: "clothes.underwear_bottom.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "underwear_onepiece",
        "swimwear_bottom",
        "swimwear_onepiece",
        "clothing_cool_under_bottom",
        "clothing_cool_under_onepiece",
        "clothing_normal_bottom",
        "clothing_normal_onepiece",
        "clothing_warm_bottom",
        "clothing_warm_onepiece",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  underwear_onepiece: {
    name: "clothes.underwear_onepiece.name",
    desc: "clothes.underwear_onepiece.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "underwear_top",
        "underwear_bottom",
        "swimwear_top",
        "swimwear_bottom",
        "swimwear_onepiece",
        "clothing_cool_under_top",
        "clothing_cool_under_bottom",
        "clothing_cool_under_onepiece",
        "clothing_normal_top",
        "clothing_normal_bottom",
        "clothing_normal_onepiece",
        "clothing_warm_top",
        "clothing_warm_bottom",
        "clothing_warm_onepiece",
        "clothing_outside_top",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  // Laag 2: Zwemkleding
  swimwear_top: {
    name: "clothes.swimwear_top.name",
    desc: "clothes.swimwear_top.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "swimwear_onepiece",
        "clothing_cool_under_top",
        "clothing_cool_under_onepiece",
        "clothing_normal_top",
        "clothing_normal_onepiece",
        "clothing_warm_top",
        "clothing_warm_onepiece",
        "clothing_outside_top",
        "clothing_outside_onepiece"
      ],
      worn: []
    }
  },

  swimwear_bottom: {
    name: "clothes.swimwear_bottom.name",
    desc: "clothes.swimwear_bottom.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "swimwear_onepiece",
        "clothing_cool_under_bottom",
        "clothing_cool_under_onepiece",
        "clothing_normal_bottom",
        "clothing_normal_onepiece",
        "clothing_warm_bottom",
        "clothing_warm_onepiece",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  swimwear_onepiece: {
    name: "clothes.swimwear_onepiece.name",
    desc: "clothes.swimwear_onepiece.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "swimwear_top",
        "swimwear_bottom",
        "clothing_cool_under_top",
        "clothing_cool_under_bottom",
        "clothing_cool_under_onepiece",
        "clothing_normal_top",
        "clothing_normal_bottom",
        "clothing_normal_onepiece",
        "clothing_warm_top",
        "clothing_warm_bottom",
        "clothing_warm_onepiece",
        "clothing_outside_top",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  // Laag 3: Koele kleding, Onderkleding, Mouwloos
  clothing_cool_under_top: {
    name: "clothes.clothing_cool_under_top.name",
    desc: "clothes.clothing_cool_under_top.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_cool_under_onepiece",
        "clothing_normal_top",
        "clothing_normal_onepiece",
        "clothing_warm_top",
        "clothing_warm_onepiece",
        "clothing_outside_top",
        "clothing_outside_onepiece"
      ],
      worn: []
    }
  },

  clothing_cool_under_bottom: {
    name: "clothes.clothing_cool_under_bottom.name",
    desc: "clothes.clothing_cool_under_bottom.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_cool_under_onepiece",
        "clothing_normal_bottom",
        "clothing_normal_onepiece",
        "clothing_warm_bottom",
        "clothing_warm_onepiece",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  clothing_cool_under_onepiece: {
    name: "clothes.clothing_cool_under_onepiece.name",
    desc: "clothes.clothing_cool_under_onepiece.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_cool_under_top",
        "clothing_cool_under_bottom",
        "clothing_normal_top",
        "clothing_normal_bottom",
        "clothing_normal_onepiece",
        "clothing_warm_top",
        "clothing_warm_bottom",
        "clothing_warm_onepiece",
        "clothing_outside_top",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  socks: {
    name: "clothes.socks.name",
    desc: "clothes.socks.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: ["footwear"],
      worn: []
    }
  },

  // Laag 4: Normale kleding
  clothing_normal_top: {
    name: "clothes.clothing_normal_top.name",
    desc: "clothes.clothing_normal_top.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_normal_onepiece",
        "clothing_warm_top",
        "clothing_warm_onepiece",
        "clothing_outside_top",
        "clothing_outside_onepiece"
      ],
      worn: []
    }
  },

  clothing_normal_bottom: {
    name: "clothes.clothing_normal_bottom.name",
    desc: "clothes.clothing_normal_bottom.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_normal_onepiece",
        "clothing_warm_bottom",
        "clothing_warm_onepiece",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  clothing_normal_onepiece: {
    name: "clothes.clothing_normal_onepiece.name",
    desc: "clothes.clothing_normal_onepiece.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_normal_top",
        "clothing_normal_bottom",
        "clothing_warm_top",
        "clothing_warm_bottom",
        "clothing_warm_onepiece",
        "clothing_outside_top",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  footwear: {
    name: "clothes.footwear.name",
    desc: "clothes.footwear.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [],
      worn: []
    }
  },

  // Laag 5: Warme kleding
  clothing_warm_top: {
    name: "clothes.clothing_warm_top.name",
    desc: "clothes.clothing_warm_top.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_warm_onepiece",
        "clothing_outside_top",
        "clothing_outside_onepiece"
      ],
      worn: []
    }
  },

  clothing_warm_bottom: {
    name: "clothes.clothing_warm_bottom.name",
    desc: "clothes.clothing_warm_bottom.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_warm_onepiece",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  clothing_warm_onepiece: {
    name: "clothes.clothing_warm_onepiece.name",
    desc: "clothes.clothing_warm_onepiece.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_warm_top",
        "clothing_warm_bottom",
        "clothing_outside_top",
        "clothing_outside_bottom",
        "clothing_outside_onepiece",
        "footwear"
      ],
      worn: []
    }
  },

  // Laag 6: Buitenkleding (zoals jassen)
  clothing_outside_top: {
    name: "clothes.clothing_outside_top.name",
    desc: "clothes.clothing_outside_top.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: ["clothing_outside_onepiece"],
      worn: []
    }
  },

  clothing_outside_bottom: {
    name: "clothes.clothing_outside_bottom.name",
    desc: "clothes.clothing_outside_bottom.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: ["clothing_outside_onepiece", "footwear"],
      worn: []
    }
  },

  clothing_outside_onepiece: {
    name: "clothes.clothing_outside_onepiece.name",
    desc: "clothes.clothing_outside_onepiece.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [
        "clothing_outside_top",
        "clothing_outside_bottom",
        "footwear"
      ],
      worn: []
    }
  },

  // Laag 7: Accessoires (Geen rules met kledingstukken)
  accessories_head: {
    name: "clothes.accessories_head.name",
    desc: "clothes.accessories_head.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [],
      worn: []
    }
  },

  accessories_face: {
    name: "clothes.accessories_face.name",
    desc: "clothes.accessories_face.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [],
      worn: []
    }
  },

  accessories_neck: {
    name: "clothes.accessories_neck.name",
    desc: "clothes.accessories_neck.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [],
      worn: []
    }
  },

  // Laag 8: Bedekkende kledingstukken (muts, handschoenen, enzovoort)
  cover_head: {
    name: "clothes.cover_head.name",
    desc: "clothes.cover_head.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [],
      worn: []
    }
  },

  cover_hand: {
    name: "clothes.cover_hand.name",
    desc: "clothes.cover_hand.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [],
      worn: []
    }
  },

  cover_neck: {
    name: "clothes.cover_neck.name",
    desc: "clothes.cover_neck.desc",
    worn: true,
    enabled: false,
    rules: {
      notworn: [],
      worn: []
    }
  }
};

// Helper: is dit kledingstuk überhaupt actief in dit spel / voor deze speler?
function isEnabled(model, k) {
  const p = model[k];
  return !!(p && p.enabled === true);
}

// Helper: draagt de speler dit kledingstuk nu?
function isWorn(model, k) {
  const p = model[k];
  return !!(p && p.worn === true);
}

/**
 * Controleer of alle regels voor het veranderen van een kledingstuk
 * (aan of uit) voldoen.
 *
 * Structuur per kledingstuk:
 *   piece.rules = {
 *     notworn: ["torso_top"],
 *     worn:    ["legs_underwear"]
 *   }
 *
 * Betekenis:
 *   - notworn: elk genoemd key moet NIET gedragen worden
 *   - worn:    elk genoemd key MOET gedragen worden
 *
 * Disabled kledingstukken worden genegeerd in de check:
 *   - staat een key in de rule maar is enabled === false, dan telt hij niet mee.
 *
 * Geen rules = altijd toegestaan.
 *
 * @param {object} model - huidig kledingmodel (per speler), incl. enabled/worn
 * @param {object} piece - referentie naar model[key]
 * @returns {boolean} - true als alle regels voldoen
 */
function rulesSatisfiedFor(model, piece) {
  if (!piece || !piece.rules) return true;

  const rules = piece.rules || {};
  const notWornList = Array.isArray(rules.notworn) ? rules.notworn : [];
  const wornList = Array.isArray(rules.worn) ? rules.worn : [];

  // notworn: elk genoemd item mag niet gedragen worden
  const notWornOK = notWornList.every((k) => {
    if (!isEnabled(model, k)) return true; // disabled → negeren
    return !isWorn(model, k);
  });

  // worn: elk genoemd item moet juist wél gedragen worden
  const wornOK = wornList.every((k) => {
    if (!isEnabled(model, k)) return true; // disabled → negeren
    return isWorn(model, k);
  });

  return notWornOK && wornOK;
}

/**
 * Kan dit kledingstuk AAN worden gedaan?
 *
 * - key moet bestaan
 * - kledingstuk moet enabled zijn (actief voor deze speler / in dit spel)
 * - kledingstuk mag nog niet gedragen worden (worn === false)
 * - alle rules moeten voldoen
 *
 * Voorbeeld gebruik:
 *   if (canWearClothingPiece("torso_underwear", player.clothes)) {
 *     player.clothes.torso_underwear.worn = true;
 *   }
 */
export function canWearClothingPiece(key, clothingModel) {
  const piece = clothingModel[key];
  if (!piece || !piece.enabled) return false; // bestaat niet of uitgeschakeld
  if (piece.worn) return false; // al aan

  return rulesSatisfiedFor(clothingModel, piece);
}

/**
 * Kan dit kledingstuk UIT worden gedaan?
 *
 * - key moet bestaan
 * - kledingstuk moet enabled zijn
 * - kledingstuk moet nu gedragen worden (worn === true)
 * - alle rules moeten voldoen
 *
 * Voorbeeld gebruik:
 *   if (canRemoveClothingPiece("torso_underwear", player.clothes)) {
 *     player.clothes.torso_underwear.worn = false;
 *   }
 */
export function canRemoveClothingPiece(key, clothingModel) {
  const piece = clothingModel[key];
  if (!piece || !piece.enabled) return false; // bestaat niet of uitgeschakeld
  if (!piece.worn) return false; // al uit

  return rulesSatisfiedFor(clothingModel, piece);
}

/**
 * Geef een diepe kopie van het basis CLOTHING_MODEL.
 *
 * Dit gebruik je bij het aanmaken van een nieuwe game / nieuwe speler,
 * zodat iedere speler zijn eigen kopie van het kledingmodel heeft en
 * wijzigingen aan worn/enabled niet het globale model veranderen.
 */
export function getClothesModel() {
  return deepCopy(CLOTHING_MODEL);
}
