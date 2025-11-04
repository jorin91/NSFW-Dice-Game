import { SEX_ENUM } from "./enums.js";
import { setI18n } from "./lang_i18n.js";

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

// labelI18n?: i18n-key voor label (span)
// placeholderI18n?: i18n-key voor placeholder attribuut
// defaultValue?: beginwaarde
// attrs?: extra attributen { min: "18", type:"number", ... }
export function makeInputField(
  name,
  type,
  { labelI18n, placeholderI18n, defaultValue = "", attrs = {} } = {}
) {
  const wrap = document.createElement("label");
  wrap.className = "col small";

  const span = document.createElement("span");
  if (labelI18n) {
    setI18n(span, labelI18n);
  } else {
    span.textContent = name;
  }

  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  if (defaultValue !== undefined && defaultValue !== null)
    input.value = defaultValue;

  // i18n voor placeholder (attribuut)
  if (placeholderI18n) {
    setI18n(input, labelI18n, null, "attr", false, "placeholder");
  }

  // extra attributen
  Object.entries(attrs).forEach(([k, v]) => input.setAttribute(k, v));
  if (type === "number" && !("inputMode" in attrs)) input.inputMode = "numeric";

  wrap.append(span, input);
  return { wrap, input };
}

export function makeSelectField(name, { labelI18n, entries } = {}) {
  const wrap = document.createElement("label");
  wrap.className = "col small";

  const span = document.createElement("span");
  if (labelI18n) {
    setI18n(span, labelI18n);
  } else {
    span.textContent = name;
  }

  const select = document.createElement("select");
  select.name = name;

  // entries: Array<[key, value]> zoals Object.entries(SEX_ENUM)
  for (const [key, value] of entries) {
    const opt = document.createElement("option");
    opt.value = value;
    // optie-label via i18n (als je keys voor enum hebt), anders fallback naar key
    // Probeer i18n automatisch: data-i18n-auto="SEX_ENUM.Male"
    setI18n(opt, value);
    opt.textContent = key;
    select.appendChild(opt);
  }

  wrap.append(span, select);
  return { wrap, select };
}

export function makeSeperator() {
  const el = document.createElement("div");
  el.className = "sep";
  return el;
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}