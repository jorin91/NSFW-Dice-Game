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

// Example task definitions. Some properties are defined double to illustrate possible variations. Obviously only one definition per property should be used in practice.
// Participant slots can have one loser, one winner and multiple other slots. Not every slot has to be used in a task.
// Effects can be clothing changes, score changes, status changes, etc. Examples will be added based on implemented features.
// Flags define extra task properties that might not apply to every task but are useful for some, like completion conditions.
// Conditions define when a task is eligible to be assigned, based on game phase, category, sex act, body zone, etc. These are gamme settings based and can be empty arrays to indicate no restrictions.
export const TASKS = [
  {
    id: "Base.ExampleTask.1", // Unique identifier for the task. Format: {GAMECATEGORY_ENUM.KEYWORD}.{description}.{number}
    weight: 10, // Weight for random selection among eligible tasks. Higher weight means higher chance of being selected. Goes down 1.0 everytime the task is assigned to avoid repetition and goes up 0.1 every round it is not assigned, to a maximum of the starting weight.
    conditions: {
      gamephase: [], // Empty array means no restrictions, if filled, these options must all be enabled in game settings for the task to be eligible.
      gamecategory: [], // Empty array means no restrictions, if filled, these options must all be enabled in game settings for the task to be eligible.
      sexact: [], // Empty array means no restrictions, if filled, these options must all be enabled in game settings for the task to be eligible.
      bodyzone: [], // Empty array means no restrictions, if filled, these options must all be enabled in game settings for the task to be eligible.
    },
    participants: [
      {
        id: 0, // Unique identifier for this participant slot within the task. Used to reference this participant in effects, flags ands interaction preferences.
        slot: TASKPLAYERTARGET_ENUM.loser, // Which type of player goes into this slot. There is always only one loser. This slot gets filled first.
        player: null, // Stored player object assigned to this slot. Once assigned, this player cannot be assigned to other slots in this task and will be removed from their eligiblePlayers lists. In this case the loser will be assigned here.
        egliblePlayers: [], // Players that can be chosen for this slot. Will be filled before task assignment to randomly pick from. To determine eligibility, the player's sex is checked against the slot's required sex, the player's prefered sex is checked against the other slot's required sex and the sex of the assigned player, also other conditions can be applied here later.
        sex: SEXTARGET_ENUM.Female, // Sex required for this participant. In this case only females can be assigned to this slot.
        instructionLocalizationKey: "task.BaseTask1.participant.loser", // Localization key for task instruction this participant gets
        interactionTargets: [1, 2] // Array of ids of other participants that this participant will interact with during the task. Used to determine interaction preferences. In this case this participant will interact with both the winner and the other.
      },
      {
        id: 1, // Unique identifier for this participant slot within the task. Used to reference this participant in effects, flags ands interaction preferences.
        slot: TASKPLAYERTARGET_ENUM.winner, // Which type of player goes into this slot. There is always only one winner, the first player to finish the round. This slot gets filled second. If the first winner does not fullfill conditions, the second winning player will be assigned here, and so on.
        player: null, // Stored player object assigned to this slot. Once assigned, this player cannot be assigned to other slots in this task and will be removed from their eligiblePlayers lists. In this case only one winner, ordered by who finished first, will be assigned here.
        egliblePlayers: [], // Players that can be chosen for this slot. Will be filled before task assignment to randomly pick from. To determine eligibility, the player's sex is checked against the slot's required sex, the player's prefered sex is checked against the other slot's required sex and the sex of the assigned player, also other conditions can be applied here later.
        sex: SEXTARGET_ENUM.Male, // Sex required for this participant. In this case only males can be assigned to this slot.
        instructionLocalizationKey: "task.BaseTask1.participant.winner", // Localization key for task instruction this participant gets
        interactionTargets: [0] // Array of ids of other participants that this participant will interact with during the task. Used to determine interaction preferences. In this case this participant will only interact with the loser.
      },
      {
        id: 2, // Unique identifier for this participant slot within the task. Used to reference this participant in effects, flags ands interaction preferences.
        slot: TASKPLAYERTARGET_ENUM.other, // Which type of player goes into this slot. There can be multiple others, technically they are all winners but not assigned to the winner slot. This slot gets filled last. If there are multiple other slots, they get filled based on the lowest amount of eligible players first to increase chances of successful assignment.
        player: null, // Stored player object assigned to this slot. Once assigned, this player cannot be assigned to other slots in this task and will be removed from their eligiblePlayers lists. In this case one winning player that did not fulfill the winner slot conditions will be assigned here.
        egliblePlayers: [], // Players that can be chosen for this slot. Will be filled before task assignment to randomly pick from. To determine eligibility, the player's sex is checked against the slot's required sex, the player's prefered sex is checked against the other slot's required sex and the sex of the assigned player, also other conditions can be applied here later.
        sex: SEXTARGET_ENUM.Both, // Sex required for this participant. In this case both males and females can be assigned to this slot.
        instructionLocalizationKey: "task.BaseTask1.participant.other", // Localization key for task instruction this participant gets
        interactionTargets: [0, 1] // Array of ids of other participants that this participant will interact with during the task. Used to determine interaction preferences. In this case this participant will interact with both the loser and the winner.
      },
    ],
    effects: [
        {type: "clothing.remove", slot: TASKPLAYERTARGET_ENUM.loser, item: CLOTHING_MODEL.underwear_top }, // Effect that will be applied when task is completed. In this case the loser will have their top underwear removed.
        {type: "clothing.add", slot: TASKPLAYERTARGET_ENUM.winner, item: CLOTHING_MODEL.underwear_bottom }, // Effect that will be applied when task is completed. In this case the winner will have a bottom underwear added.
    ],
    flags: {
        taskCompleteType: {type: TASKCOMPLETETYPE_ENUM.once}, // Condition that needs to be met to complete the task. In this case the task is completed once the assigned players indicate they have completed the task.
        taskCompleteType: {type: TASKCOMPLETETYPE_ENUM.count, count: 3}, // Condition that needs to be met to complete the task. In this case the task is completed once the assigned players have performed the action 3 times.
        taskCompleteType: {type: TASKCOMPLETETYPE_ENUM.time, time: 60}, // Condition that needs to be met to complete the task. In this case the task is completed once the assigned players have performed the action for 60 seconds.
    },
  },
];
