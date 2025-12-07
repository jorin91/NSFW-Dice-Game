import { setI18n } from "./lang_i18n.js";

/*
 * makeInputField(name, type, options)
 * Maakt een gelabeld <input>-veld in een <label>-wrapper.
 *
 * name            → naam van het veld + name-attribuut van de input
 * type            → html-inputtype (text, number, date, etc.)
 *
 * options:
 *   labelI18n         → i18n-key voor labeltekst
 *   placeholderI18n   → i18n-key voor de placeholder-tekst
 *   defaultValue      → standaardwaarde voor de input
 *   attrs             → object met extra HTML-attributen (bv. {min:0})
 *
 * Return: { wrap: <label>, input: <input> }
 */
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

/*
 * makeSelectField(name, options)
 * Maakt een <select> met opties op basis van entries.
 *
 * name        → naam van het veld + name-attribuut van de select
 *
 * options:
 *   labelI18n → i18n-key voor labeltekst
 *   entries   → Array<[key, value]>; meestal Object.entries(enum)
 *               key   = fallback tekst die zichtbaar is
 *               value = waarde in de select + i18n-key om label te zetten
 *
 * Return: { wrap: <label>, select: <select> }
 */
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

/*
 * makeSeperator()
 * Maakt een simpele scheidingslijn / layout-element.
 *
 * Return: <div class="sep">
 */
export function makeSeperator() {
  const el = document.createElement("div");
  el.className = "sep";
  return el;
}