// task.js
import { deepCopy } from "./utils.js";

export const TASK_MODEL = {
  pose: {
    enabled: true,
    weight: 0,
    tasks: [],
  },
  expose: {
    enabled: true,
    weight: 0,
    tasks: [],
  },
  touch: {
    enabled: true,
    weight: 0,
    tasks: [],
  },
  dress: {
    enabled: true,
    weight: 0,
    tasks: [],
  },
  undress: {
    enabled: true,
    weight: 0,
    tasks: [],
  },
  challenge: {
    enabled: true,
    weight: 0,
    tasks: [],
  },
  movement: {
    enabled: true,
    weight: 0,
    tasks: [],
  },
};

export function getTaskModel() {
  return deepCopy(TASK_MODEL);
}
