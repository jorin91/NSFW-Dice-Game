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
const example_model_task_undress = {
  id: "undress_${key}", // Uniek ID voor elke Task
  variants: [
    {
      titleKey: "TASK.Undress.Self.Title", // Titel voor opdracht panel
      instructionKey: "TASK.Undress.Self.Instruction", // tran
      instruction_args: { clothing: "piece.name", p0: "" }, // Voeg args toe voor deelnemede participants namen p<participants index>, bijvoorbeeld p0.
      stage: [], // Leeg -> niet afhankelijk van
      intensity: [], // Leeg -> niet afhankelijk van
      extremity: [], // Leeg -> niet afhankelijk van
      act: [], // Leeg -> niet afhankelijk van
      participants: [
        {
          // Personen nodig voor de opdracht, op basis van PLAYERTARGET_ENUM.Self of PLAYERTARGET_ENUM.Other word deze ingevuld. SELF moet altijd aanwezig zijn!
          player: null, // Speler object, wordt toegewezen aan opdracht wanneer deze word uitgegeven
          target: PLAYERTARGET_ENUM.Self,
          sex: [], // Geslacht dat dit persoon moet hebben. SEX_ENUM.Both of leeg -> niet afhankelijk van, beide zijn goed
        },
      ],
    },
  ],
};

function fillDynamicTasksUndress() {
  const clothes = getClothesModel();
  const tasks = [];

  Object.entries(clothes).forEach(([key, piece]) => {
    const task = {
      id: `undress_${key}`, // Uniek ID voor elke Task
      variants: [
        {
          titleKey: "TASK.Undress.Self.Title", // Titel voor opdracht panel
          instructionKey: "TASK.Undress.Self.Instruction", // tran
          instruction_args: { clothing: piece.name, p0: "" }, // Voeg args toe voor deelnemede participants namen p<participants index>, bijvoorbeeld p0.
          stage: [], // Leeg -> niet afhankelijk van
          intensity: [], // Leeg -> niet afhankelijk van
          extremity: [], // Leeg -> niet afhankelijk van
          act: [], // Leeg -> niet afhankelijk van
          participants: [
            {
              // Personen nodig voor de opdracht, op basis van PLAYERTARGET_ENUM.Self of PLAYERTARGET_ENUM.Other word deze ingevuld. SELF moet altijd aanwezig zijn!
              player: null, // Speler object, wordt toegewezen aan opdracht wanneer deze word uitgegeven
              target: PLAYERTARGET_ENUM.Self,
              sex: [], // Geslacht dat dit persoon moet hebben. SEX_ENUM.Both of leeg -> niet afhankelijk van, beide zijn goed
            },
          ],
        },
        {
          titleKey: "TASK.Undress.Other.Title", // Titel voor opdracht panel
          instructionKey: "TASK.Undress.Other.Instruction", // tran
          instruction_args: { clothing: piece.name, p0: "participant", p1: "participant" }, // Voeg args toe voor deelnemede participants namen p<participants index>, bijvoorbeeld p0.
          stage: [], // Leeg -> niet afhankelijk van
          intensity: [], // Leeg -> niet afhankelijk van
          extremity: [], // Leeg -> niet afhankelijk van
          act: [], // Leeg -> niet afhankelijk van
          participants: [
            {
              // Personen nodig voor de opdracht, op basis van PLAYERTARGET_ENUM.Self of PLAYERTARGET_ENUM.Other word deze ingevuld. SELF moet altijd aanwezig zijn!
              player: null, // Speler object, wordt toegewezen aan opdracht wanneer deze word uitgegeven
              target: PLAYERTARGET_ENUM.Self,
              sex: [], // Geslacht dat dit persoon moet hebben. SEX_ENUM.Both of leeg -> niet afhankelijk van, beide zijn goed
            },
            {
              // Personen nodig voor de opdracht, op basis van PLAYERTARGET_ENUM.Self of PLAYERTARGET_ENUM.Other word deze ingevuld. SELF moet altijd aanwezig zijn!
              player: null, // Speler object, wordt toegewezen aan opdracht wanneer deze word uitgegeven
              target: PLAYERTARGET_ENUM.Other,
              sex: [], // Geslacht dat dit persoon moet hebben. SEX_ENUM.Both of leeg -> niet afhankelijk van, beide zijn goed
            },
          ],
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
