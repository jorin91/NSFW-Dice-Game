import { getClothesModel } from "./clothing.js";
import { deepCopy } from "./utils.js";

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

function fillDynamicTasksUndress() {
  const clothes = getClothesModel();
  const tasks = [];
  
  Object.entries(clothes).forEach(([key, piece]) => {
    const task = {
      id: `undress_${key}`,
      title: "TASK.Undress.Title",
      instruction: "TASK.Undress.Dynamic",
      arg: {clothing: piece.name}
    };

    tasks.push(task);
  });

  return tasks;
}

export function getTasksModel() {
  return deepCopy(TASKS_MODEL);
}
