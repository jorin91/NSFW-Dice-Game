import { getClothesModel } from "./clothing.js";
import { deepCopy } from "./utils.js";
import {
  SEX_ENUM,
  STAGE_ENUM,
  INTENSITY_ENUM,
  EXTREMITY_ENUM,
  ACT_ENUM,
  PLAYERTARGET_ENUM,
} from "./enums.js";

export const TASKS_MODEL = {
  undress: {
    name: "",
    enabled: true,
    weight: 10,
    tasks: fillDynamicTasksUndress(),
  },

  dress: {
    name: "",
    enabled: true,
    weight: 10,
    tasks: [],
  },

  expose: {
    name: "",
    enabled: true,
    weight: 10,
    tasks: [],
  },
};

// Example
// Voorbeeld over undress self en undress other taken. Ik heb express geen geslachts filter ingesteld, spelers stellen in welke kleding ze dragen, ik wil dit dus geslacht onafhankelijk houden.
const task = {
      id: ``, // Uniek ID voor elke Task
      titleKey: "", // Titel voor opdracht panel
      instructionKey: "", // globale instructies
      instruction_args: { clothing: "", p0: "" }, // Voeg args toe voor deelnemede participants namen p<participants index>, bijvoorbeeld p0.
      conditions: {
        stage: [], // Leeg -> niet afhankelijk van
        intensity: [], // Leeg -> niet afhankelijk van
        extremity: [], // Leeg -> niet afhankelijk van
        act: [], // Leeg -> niet afhankelijk van
        clothing: {
          worn: [], // Leeg -> niet afhankelijk van, items hierin moeten aan zijn
          notWorn: [], // Leeg -> niet afhankelijk van, items hierin mogen niet aan zijn
        },
      },
      participants: [
        {
          // Personen nodig voor de opdracht, op basis van PLAYERTARGET_ENUM.Self of PLAYERTARGET_ENUM.Other word deze ingevuld. SELF moet altijd aanwezig zijn!
          player: null, // Speler object, wordt toegewezen aan opdracht wanneer deze word uitgekozen
          players: [], // Placeholder om alle passende spelers in op te slaan (bij other) om eerst bij te houden wie past en later pas alles in te vullen
          target: PLAYERTARGET_ENUM.loser, // loser is verplicht!
          conditions: {
            // Speler spot specifiek
            clothing: {
              worn: [], // Leeg -> niet afhankelijk van, items hierin moeten aan zijn
              notWorn: [], // Leeg -> niet afhankelijk van, items hierin mogen niet aan zijn
            },
          },
          sex: [], // Geslacht dat dit persoon moet hebben. SEX_ENUM.Both of leeg -> niet afhankelijk van, beide zijn goed
          secretInstructionKey: "", // secret instructie van deze speler -> Gebruikt de global instruction_args voor extra translate opties en invoegen van namen
        },
      ],
    };

function fillDynamicTasksUndress() {
  const clothes = getClothesModel();
  const tasks = [];

  Object.entries(clothes).forEach(([key, piece]) => {
    const task = {
      id: `undress_${key}`, // Uniek ID voor elke Task
      titleKey: "TASK.Undress.Self.Title", // Titel voor opdracht panel
      instructionKey: "TASK.Undress.Self.Instruction", // globale instructies
      instruction_args: { clothing: piece.name, p0: "" }, // Voeg args toe voor deelnemede participants namen p<participants index>, bijvoorbeeld p0.
      conditions: {
        stage: [], // Leeg -> niet afhankelijk van
        intensity: [], // Leeg -> niet afhankelijk van
        extremity: [], // Leeg -> niet afhankelijk van
        act: [], // Leeg -> niet afhankelijk van
        clothing: {
          worn: [], // Leeg -> niet afhankelijk van, items hierin moeten aan zijn
          notWorn: [], // Leeg -> niet afhankelijk van, items hierin mogen niet aan zijn
        },
      },
      participants: [
        {
          // Personen nodig voor de opdracht, op basis van PLAYERTARGET_ENUM.Self of PLAYERTARGET_ENUM.Other word deze ingevuld. SELF moet altijd aanwezig zijn!
          player: null, // Speler object, wordt toegewezen aan opdracht wanneer deze word uitgekozen
          players: [], // Placeholder om alle passende spelers in op te slaan (bij other) om eerst bij te houden wie past en later pas alles in te vullen
          target: PLAYERTARGET_ENUM.loser, // loser is verplicht!
          conditions: {
            // Speler spot specifiek
            clothing: {
              worn: [], // Leeg -> niet afhankelijk van, items hierin moeten aan zijn
              notWorn: [], // Leeg -> niet afhankelijk van, items hierin mogen niet aan zijn
            },
          },
          sex: [], // Geslacht dat dit persoon moet hebben. SEX_ENUM.Both of leeg -> niet afhankelijk van, beide zijn goed
          secretInstructionKey: "", // secret instructie van deze speler -> Gebruikt de global instruction_args voor extra translate opties en invoegen van namen
        },
      ],
    };

    tasks.push(task);
  });

  return tasks;
}

export function getTasksModel() {
  return deepCopy(TASKS_MODEL);
}
