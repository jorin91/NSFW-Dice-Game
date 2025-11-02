import {
  SEX_ENUM,
  STAGE_ENUM,
  INTENSITY_ENUM,
  EXTREMITY_ENUM,
  ACT_ON_ENUM,
  ACT_WITH_ENUM,
  PLAYERTARGET_ENUM,
} from "../enums.js";

export const tasks_dress_self = [
  {
    enabled: true,
    id: `dress_self.headwear`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.headwear.name", loser: "Loser" },
    conditions: {
      stage: [],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "headwear" }],
    flags: {
      checkPreferSex: false,
    },
  },
  {
    enabled: true,
    id: `dress_self.accessories_glasses`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: {
      clothing: "clothes.accessories_glasses.name",
      loser: "Loser",
    },
    conditions: {
      stage: [],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [
      { type: "clothing.add", slot: "loser", item: "accessories_glasses" },
    ],
    flags: {
      checkPreferSex: false,
    },
  },
  {
    enabled: true,
    id: `dress_self.accessories_neck`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: {
      clothing: "clothes.accessories_neck.name",
      loser: "Loser",
    },
    conditions: {
      stage: [],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [
      { type: "clothing.add", slot: "loser", item: "accessories_neck" },
    ],
    flags: {
      checkPreferSex: false,
    },
  },
  {
    enabled: true,
    id: `dress_self.accessories_arm`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: {
      clothing: "clothes.accessories_arm.name",
      loser: "Loser",
    },
    conditions: {
      stage: [],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "accessories_arm" }],
    flags: {
      checkPreferSex: false,
    },
  },
  {
    enabled: true,
    id: `dress_self.jacket`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.jacket.name", loser: "Loser" },
    conditions: {
      stage: [],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "jacket" }],
    flags: {
      checkPreferSex: false,
    },
  },
  {
    enabled: true,
    id: `dress_self.sweater`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.sweater.name", loser: "Loser" },
    conditions: {
      stage: [STAGE_ENUM.PLAYFUL],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "sweater" }],
    flags: {
      checkPreferSex: true,
    },
  },
  {
    enabled: true,
    id: `dress_self.shirt`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.shirt.name", loser: "Loser" },
    conditions: {
      stage: [STAGE_ENUM.PLAYFUL],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "shirt" }],
    flags: {
      checkPreferSex: true,
    },
  },
  {
    enabled: true,
    id: `dress_self.undershirt`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.undershirt.name", loser: "Loser" },
    conditions: {
      stage: [STAGE_ENUM.PLAYFUL],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "undershirt" }],
    flags: {
      checkPreferSex: true,
    },
  },
  {
    enabled: true,
    id: `dress_self.bra`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.bra.name", loser: "Loser" },
    conditions: {
      stage: [STAGE_ENUM.INTIMATE],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "bra" }],
    flags: {
      checkPreferSex: true,
    },
  },
  {
    enabled: true,
    id: `dress_self.pants`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.pants.name", loser: "Loser" },
    conditions: {
      stage: [STAGE_ENUM.PLAYFUL],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "pants" }],
    flags: {
      checkPreferSex: true,
    },
  },
  {
    enabled: true,
    id: `dress_self.leggings`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.leggings.name", loser: "Loser" },
    conditions: {
      stage: [STAGE_ENUM.PLAYFUL],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "leggings" }],
    flags: {
      checkPreferSex: true,
    },
  },
  {
    enabled: true,
    id: `dress_self.underwear`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.underwear.name", loser: "Loser" },
    conditions: {
      stage: [STAGE_ENUM.INTIMATE],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "underwear" }],
    flags: {
      checkPreferSex: true,
    },
  },
  {
    enabled: true,
    id: `dress_self.shoes`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.shoes.name", loser: "Loser" },
    conditions: {
      stage: [],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "shoes" }],
    flags: {
      checkPreferSex: false,
    },
  },
  {
    enabled: true,
    id: `dress_self.socks`,
    instructionKey: "TASK.Dress.Self.Public",
    instruction_args: { clothing: "clothes.socks.name", loser: "Loser" },
    conditions: {
      stage: [STAGE_ENUM.PLAYFUL],
      intensity: [],
      extremity: [],
      act_with: [],
      act_on: [],
    },
    participants: [
      {
        slot: "loser",
        player: null,
        players: [],
        target: PLAYERTARGET_ENUM.loser,
        sex: [],
        secretInstructionKey: "TASK.Dress.Self.Secret",
      },
    ],
    effects: [{ type: "clothing.add", slot: "loser", item: "socks" }],
    flags: {
      checkPreferSex: false,
    },
  },
];
