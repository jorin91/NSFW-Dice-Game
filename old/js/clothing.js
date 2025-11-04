import { deepCopy } from "./utils.js";

export const CLOTHING_MODEL = {
  headwear: {
    name: "clothes.headwear.name",
    desc: "clothes.headwear.desc",
    worn: true,
    enabled: false,
    changeRules: [],
  },

  accessories_glasses: {
    name: "clothes.accessories_glasses.name",
    desc: "clothes.accessories_glasses.desc",
    worn: true,
    enabled: false,
    changeRules: [],
  },

  accessories_neck: {
    name: "clothes.accessories_neck.name",
    desc: "clothes.accessories_neck.desc",
    worn: true,
    enabled: false,
    changeRules: [],
  },

  accessories_arm: {
    name: "clothes.accessories_arm.name",
    desc: "clothes.accessories_arm.desc",
    worn: true,
    enabled: false,
    changeRules: [],
  },

  jacket: {
    name: "clothes.jacket.name",
    desc: "clothes.jacket.desc",
    worn: true,
    enabled: false,
    changeRules: [],
  },

  sweater: {
    name: "clothes.sweater.name",
    desc: "clothes.sweater.desc",
    worn: true,
    enabled: false,
    changeRules: [{ notWorn: ["jacket"] }],
  },

  shirt: {
    name: "clothes.shirt.name",
    desc: "clothes.shirt.desc",
    worn: true,
    enabled: true,
    changeRules: [{ notWorn: ["jacket", "sweater"] }],
  },

  undershirt: {
    name: "clothes.undershirt.name",
    desc: "clothes.undershirt.desc",
    worn: true,
    enabled: false,
    changeRules: [{ notWorn: ["jacket", "sweater", "shirt"] }],
  },

  bra: {
    name: "clothes.bra.name",
    desc: "clothes.bra.desc",
    worn: true,
    enabled: true,
    changeRules: [{notWorn: ["jacket", "sweater", "shirt", "undershirt"]}],
  },

  pants: {
    name: "clothes.pants.name",
    desc: "clothes.pants.desc",
    worn: true,
    enabled: true,
    changeRules: [{ notWorn: ["shoes"] }],
  },

  leggings: {
    name: "clothes.leggings.name",
    desc: "clothes.leggings.desc",
    worn: true,
    enabled: false,
    changeRules: [{ notWorn: ["shoes", "pants"] }],
  },

  underwear: {
    name: "clothes.underwear.name",
    desc: "clothes.underwear.desc",
    worn: true,
    enabled: true,
    changeRules: [{ notWorn: ["pants", "leggings"] }],
  },

  shoes: {
    name: "clothes.shoes.name",
    desc: "clothes.shoes.desc",
    worn: true,
    enabled: true,
    changeRules: [],
  },

  socks: {
    name: "clothes.socks.name",
    desc: "clothes.socks.desc",
    worn: true,
    enabled: true,
    changeRules: [{ notWorn: ["shoes"] }],
  },
};

function isEnabled(model, k) {
  const p = model[k];
  return !!(p && p.enabled === true);
}

function isWorn(model, k) {
  const p = model[k];
  return !!(p && p.worn === true);
}

// Controleer of alle regels voldoen
// Ondersteunt:
//   { notWorn: ["jacket", "sweater"] }
//   { worn: ["underwear", "socks"] }
function rulesSatisfiedFor(model, piece) {
  const rules = Array.isArray(piece.changeRules) ? piece.changeRules : [];

  return rules.every(rule => {
    // notWorn: elk genoemd item mag niet aan zijn
    const notWornList = Array.isArray(rule?.notWorn) ? rule.notWorn : [];
    const notWornOK = notWornList.every(k => {
      if (!isEnabled(model, k)) return true; // negeer disabled
      return !isWorn(model, k);
    });

    // worn: elk genoemd item moet juist aan zijn
    const wornList = Array.isArray(rule?.worn) ? rule.worn : [];
    const wornOK = wornList.every(k => {
      if (!isEnabled(model, k)) return true; // negeer disabled
      return isWorn(model, k);
    });

    return notWornOK && wornOK;
  });
}

export function canWearClothingPiece(key, clothingModel) {
  const piece = clothingModel[key];
  if (!piece || !piece.enabled) return false;  // uitgeschakeld
  if (piece.worn) return false;                // al aan
  return rulesSatisfiedFor(clothingModel, piece);
}

export function canRemoveClothingPiece(key, clothingModel) {
  const piece = clothingModel[key];
  if (!piece || !piece.enabled) return false;  // uitgeschakeld
  if (!piece.worn) return false;               // al uit
  return rulesSatisfiedFor(clothingModel, piece);
}

export function getClothesModel(){
  return deepCopy(CLOTHING_MODEL);
}