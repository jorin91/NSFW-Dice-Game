import {
  SEXTARGET_ENUM,
  SEXSELF_ENUM,
  GAMEPHASE_ENUM,
  GAMECATEGORY_ENUM,
  SEXACT_ENUM,
  BODYZONE_ENUM,
  TASKPLAYERTARGET_ENUM,
  TASKCOMPLETETYPE_ENUM
} from "../enums.js";
import { getClothesModel } from "../clothing.js";

const CLOTHING_MODEL = getClothesModel();

export const tasks_Base = [
  {
    id: "BaseTask1",
    weight: 10,
    conditions: {
      gamephase: [],
      gamecategory: [],
      sexact: [],
      bodyzone: [],
    },
    participants: [
      {
        slot: TASKPLAYERTARGET_ENUM.loser, // Which player goes into this slot
        player: null, // Stored player object
        sex: SEXTARGET_ENUM.Female, // Sex required for this participant
        instructionLocalizationKey: "task.BaseTask1.participant.loser", // Localization key for task instruction this participant gets
      },
      {
        slot: TASKPLAYERTARGET_ENUM.winner, // Which player goes into this slot
        player: null, // Stored player object
        sex: SEXTARGET_ENUM.Male, // Sex required for this participant
        instructionLocalizationKey: "task.BaseTask1.participant.winner", // Localization key for task instruction this participant gets
      },
      {
        slot: TASKPLAYERTARGET_ENUM.other, // Which player goes into this slot
        player: null, // Stored player object
        sex: SEXTARGET_ENUM.Both, // Sex required for this participant
        instructionLocalizationKey: "task.BaseTask1.participant.other", // Localization key for task instruction this participant gets
      },
    ],
    effects: [
        {type: "clothing.remove", slot: TASKPLAYERTARGET_ENUM.loser, item: CLOTHING_MODEL.underwear_top },
        {type: "clothing.add", slot: TASKPLAYERTARGET_ENUM.winner, item: CLOTHING_MODEL.underwear_bottom },
    ],
    flags: {
        taskCompleteType: TASKCOMPLETETYPE_ENUM.once,
    },
  },
];
