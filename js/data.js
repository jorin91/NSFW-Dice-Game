// ===== Game State =====
const LS_KEY_GAMESTATE = "NSFWDiceGame_GameState";

const GAME_FLOW_MODEL = {
  version: 1,
  activePanel: "mainmenu",
  round: 0,
  turnIndex: 0,
  players: [], // je kunt hier straks createPlayer() instances in zetten
  settings: {}, // later: maxRolls, pointsToSafe, enz.
  tasks: {},
};

// ===== Tasks =====


// ===== Player =====
const PLAYER_MODEL = {
  id: null,
  name: null,
  age: 18,
  sex: null,
  preferSex: null,
  consent: false,
  score: 0,
  safe: false, //  <- Safe = ronde gewonnen dus geen opdracht
  clothing: null, // <- niet vooraf invullen met kopie
};

// ===== Clothing =====
const CLOTHING_MODEL = {
  headwear: {
    name: "clothes.headwear.name",
    desc: "clothes.headwear.desc",
    worn: true,
    enabled: false,
    removeRules: [],
  },

  accessories_glasses: {
    name: "clothes.accessories_glasses.name",
    desc: "clothes.accessories_glasses.desc",
    worn: true,
    enabled: false,
    removeRules: [],
  },

  accessories_neck: {
    name: "clothes.accessories_neck.name",
    desc: "clothes.accessories_neck.desc",
    worn: true,
    enabled: false,
    removeRules: [],
  },

  accessories_arm: {
    name: "clothes.accessories_arm.name",
    desc: "clothes.accessories_arm.desc",
    worn: true,
    enabled: false,
    removeRules: [],
  },

  jacket: {
    name: "clothes.jacket.name",
    desc: "clothes.jacket.desc",
    worn: true,
    enabled: false,
    removeRules: [],
  },

  sweater: {
    name: "clothes.sweater.name",
    desc: "clothes.sweater.desc",
    worn: true,
    enabled: false,
    removeRules: [{ notWorn: ["jacket"] }],
  },

  shirt: {
    name: "clothes.shirt.name",
    desc: "clothes.shirt.desc",
    worn: true,
    enabled: true,
    removeRules: [{ notWorn: ["jacket", "sweater"] }],
  },

  undershirt: {
    name: "clothes.undershirt.name",
    desc: "clothes.undershirt.desc",
    worn: true,
    enabled: false,
    removeRules: [{ notWorn: ["jacket", "sweater", "shirt"] }],
  },

  bra: {
    name: "clothes.bra.name",
    desc: "clothes.bra.desc",
    worn: true,
    enabled: true,
    removeRules: [{ notWorn: ["jacket", "sweater", "shirt", "undershirt"] }],
  },

  pants: {
    name: "clothes.pants.name",
    desc: "clothes.pants.desc",
    worn: true,
    enabled: true,
    removeRules: [{ notWorn: ["shoes"] }],
  },

  leggings: {
    name: "clothes.leggings.name",
    desc: "clothes.leggings.desc",
    worn: true,
    enabled: false,
    removeRules: [{ notWorn: ["shoes", "pants"] }],
  },

  underwear: {
    name: "clothes.underwear.name",
    desc: "clothes.underwear.desc",
    worn: true,
    enabled: true,
    removeRules: [{ notWorn: ["pants", "leggings"] }],
  },

  shoes: {
    name: "clothes.shoes.name",
    desc: "clothes.shoes.desc",
    worn: true,
    enabled: true,
    removeRules: [],
  },

  socks: {
    name: "clothes.socks.name",
    desc: "clothes.socks.desc",
    worn: true,
    enabled: true,
    removeRules: [{ notWorn: ["shoes"] }],
  },
};

