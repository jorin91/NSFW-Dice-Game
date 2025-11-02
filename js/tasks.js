import { getClothesModel } from "./clothing.js";
import { deepCopy } from "./utils.js";
import {
  SEX_ENUM,
  STAGE_ENUM,
  INTENSITY_ENUM,
  EXTREMITY_ENUM,
  PLAYERTARGET_ENUM,
  ACT_ON_ENUM,
  ACT_WITH_ENUM,
} from "./enums.js";
import { getRoundResult } from "./game.js";

import { tasks_undress_self } from "./tasks/undress_self.js";
import { tasks_undress_other_self } from "./tasks/undress_other_self.js";
import { tasks_undress_self_other } from "./tasks/undress_self_other.js";
import { tasks_dress_self } from "./tasks/dress_self.js";
import { tasks_dress_other_self } from "./tasks/dress_other_self.js";
import { tasks_dress_self_other } from "./tasks/dress_self_other.js";

export const TASKS_MODEL = {
  undress_self: {
    enabled: true,
    weight: 10,
    tasks: tasks_undress_self,
  },

  undress_other_self: {
    enabled: true,
    weight: 8,
    tasks: tasks_undress_other_self,
  },

  undress_self_other: {
    enabled: true,
    weight: 8,
    tasks: tasks_undress_self_other,
  },

  dress_self: {
    name: "",
    enabled: true,
    weight: 6,
    tasks: tasks_dress_self,
  },

  dress_other_self: {
    name: "",
    enabled: true,
    weight: 4,
    tasks: tasks_dress_other_self,
  },

  dress_self_other: {
    name: "",
    enabled: true,
    weight: 4,
    tasks: tasks_dress_self_other,
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
  const players = window.GAME?.tasks ?? {};
  const tasksModel = window.GAME?.game?.players ?? [];
  const gameSettings = window.GAME?.game?.settings ?? {};
  const gameWeights = window.GAME?.game?.settings ?? {};

  const {loser, winners} = getRoundResult();

  const taskPool = [];
}
