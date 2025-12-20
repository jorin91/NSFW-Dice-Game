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
      gamephase: [GAMEPHASE_ENUM.DISCOVERY], // Empty array means no restrictions, if filled, these options must all be enabled in game settings for the task to be eligible.
      gamecategory: [GAMECATEGORY_ENUM.DRESS], // Empty array means no restrictions, if filled, these options must all be enabled in game settings for the task to be eligible.
      sexact: [SEXACT_ENUM.MANUAL], // Empty array means no restrictions, if filled, these options must all be enabled in game settings for the task to be eligible.
      bodyzone: [BODYZONE_ENUM.BODY], // Empty array means no restrictions, if filled, these options must all be enabled in game settings for the task to be eligible.
    },
    // Participant slots define how manuy players are involved and what their roles are.
    // If a slot cannont be filled due to lack of eligible players, we will source players from other slots. For loser and winner slots we will source a player defined as other.
    // Winner (first player to finish) will never be assigned to 'loser' slots.
    // Losers (players left that didnt finish) will never be assigned to 'winner' slots.
    // Others (who finished, didnt necessarily win but havent lost either) will be used to fill remaining 'winner' or 'other' slots.
    // Winner and Loser typed players/slot have a big impact on the role of the player within the task. Other typed players/slots are more generic and less impactful.
    // Loser slots are filled first, then winner slots, then other slots. If not all slots can be filled, the task will not be assigned.
    // If there are multiple slots of the same player type, we fill the slots in order of lowest amount of eligible players first to increase chances of successful assignment.
    // When filling the eligiblePlayers list for each slot, we first test their preferences against the other slots defined in 'interactionTargets'. Preferences like the player type, sex, but also preferenced opposite sex they need to interact with.
    // When picking a final player for a slot from the eligiblePlayers list, we randomnly pick one but test their preference again against other slots in 'interactionTargets' that do have a player assigned, in both ways. As well the new player as the already assigned players need to be ok with the interaction based on their preferences.
    participants: [
      {
        id: 0, // Unique identifier for this participant slot within the task. Used to reference this participant in effects, flags ands interaction preferences.
        slot: TASKPLAYERTARGET_ENUM.loser, // Which type of player goes into this slot. In this case a loser.
        player: null, // Stored player object assigned to this slot. Once assigned, this player cannot be assigned to other slots in this task and will be removed from their eligiblePlayers lists.
        egliblePlayers: [], // Players that can be chosen for this slot. Will be filled before task assignment to randomly pick from. But we use this first to determine if we have eligible players for this slot.
        sex: SEXTARGET_ENUM.Female, // Sex required for this participant. In this case only females can be assigned to this slot.
        instructionLocalizationKey: "task.BaseTask1.participant.loser", // Localization key for task instruction this participant gets
        interactionTargets: [1, 2] // Array of ids of other participants that this participant will interact with during the task. Used to determine interaction preferences between players. In this case this participant will interact with both the winner and the other.
      },
      {
        id: 1, // Unique identifier for this participant slot within the task. Used to reference this participant in effects, flags ands interaction preferences.
        slot: TASKPLAYERTARGET_ENUM.winner, // Which type of player goes into this slot. In this case a winner.
        player: null, // Stored player object assigned to this slot. Once assigned, this player cannot be assigned to other slots in this task and will be removed from their eligiblePlayers lists.
        egliblePlayers: [], // Players that can be chosen for this slot. Will be filled before task assignment to randomly pick from. But we use this first to determine if we have eligible players for this slot.
        sex: SEXTARGET_ENUM.Male, // Sex required for this participant. In this case only males can be assigned to this slot.
        instructionLocalizationKey: "task.BaseTask1.participant.winner", // Localization key for task instruction this participant gets
        interactionTargets: [0] // Array of ids of other participants that this participant will interact with during the task. Used to determine interaction preferences between players. In this case this participant will only interact with the loser.
      },
      {
        id: 2, // Unique identifier for this participant slot within the task. Used to reference this participant in effects, flags ands interaction preferences.
        slot: TASKPLAYERTARGET_ENUM.other, // Which type of player goes into this slot. In this case an other participant.
        player: null, // Stored player object assigned to this slot. Once assigned, this player cannot be assigned to other slots in this task and will be removed from their eligiblePlayers lists.
        egliblePlayers: [], // Players that can be chosen for this slot. Will be filled before task assignment to randomly pick from. But we use this first to determine if we have eligible players for this slot.
        sex: SEXTARGET_ENUM.Both, // Sex required for this participant. In this case both males and females can be assigned to this slot.
        instructionLocalizationKey: "task.BaseTask1.participant.other", // Localization key for task instruction this participant gets
        interactionTargets: [0, 1] // Array of ids of other participants that this participant will interact with during the task. Used to determine interaction preferences between players. In this case this participant will interact with both the loser and the winner.
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
