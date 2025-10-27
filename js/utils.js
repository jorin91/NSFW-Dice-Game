import { SEX_ENUM } from "./enums.js";

export function deepCopy(o) {
  return JSON.parse(JSON.stringify(o));
}

export function getSexIcon(sexEnumValue) {
  switch (sexEnumValue) {
    case SEX_ENUM.Male:
      return "♂";
    case SEX_ENUM.Female:
      return "♀";
    case SEX_ENUM.Both:
      return "⚥";
    default:
      return "•"; // fallback
  }
}