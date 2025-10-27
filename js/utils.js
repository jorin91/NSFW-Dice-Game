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

export function makeInputField(name, type, key, labelText, defaultValue = "") {
  const wrap = document.createElement("label");
  wrap.className = "col small";

  const span = document.createElement("span");
  span.textContent = key;

  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  input.placeholder = labelText;
  if (defaultValue) input.value = defaultValue;

  wrap.append(span, input);
  return wrap;
}

export function makeSelectField(name, labelText, entries) {
  const wrap = document.createElement("label");
  wrap.className = "col small";

  const span = document.createElement("span");
  span.textContent = labelText;

  const select = document.createElement("select");
  select.name = name;

  for (const [key, value] of entries) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = key;
    select.appendChild(opt);
  }

  wrap.append(span, select);
  return wrap;
}