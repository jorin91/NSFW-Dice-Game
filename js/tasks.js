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

import { tasks_undress_self } from "./tasks/undress_self.js";

export const TASKS_MODEL = {
  undress_self: {
    enabled: true,
    weight: 10,
    tasks: tasks_undress_self,
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

export function getTasksModel() {
  return deepCopy(TASKS_MODEL);
}

export function generateTask() {
  
}