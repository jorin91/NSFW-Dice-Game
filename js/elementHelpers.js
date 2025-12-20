// elementHelpers.js
import { setI18n } from "./lang_i18n.js";

/**
 * Maakt een gelabeld input-veld in een <label>-wrapper.
 *
 * @param {string} name   - name/id basis voor het veld
 * @param {string} type   - HTML input type (text, number, date, ...)
 *
 * @param {object} elemOpts  - element/HTML opties
 *   wrapClass?: string      - class voor de wrapper (<label>)
 *   inputClass?: string     - class voor de <input>
 *   defaultValue?: any      - standaard waarde (non-i18n)
 *   placeholderText?: string- placeholder zonder i18n
 *   labelText?: string      - labeltekst zonder i18n
 *   attrs?: object          - extra attributen op de input (min, max, etc.)
 *
 * @param {object} i18nOpts  - i18n opties
 *   label?: string          - i18n-key voor het label
 *   placeholder?: string    - i18n-key voor placeholder
 *   defaultValue?: string   - i18n-key voor default value (value attribuut)
 *   labelArgs?: object         - args voor label ("Hallo {name}")
 *   placeholderArgs?: object   - args voor placeholder
 *   defaultValueArgs?: object  - args voor value
 *
 * @returns {{ wrap: HTMLLabelElement, labelSpan: HTMLSpanElement, input: HTMLInputElement }}
 */
export function makeInputField(name, type, elemOpts = {}, i18nOpts = {}) {
  const {
    wrapClass = "row equal",
    inputClass = "",
    defaultValue = "",
    placeholderText,
    labelText,
    attrs = {},
  } = elemOpts;

  const {
    label: labelKey,
    placeholder: placeholderKey,
    defaultValue: defaultValueKey,
    labelArgs,
    placeholderArgs,
    defaultValueArgs,
  } = i18nOpts;

  const wrap = document.createElement("label");
  wrap.className = wrapClass;

  const labelSpan = document.createElement("span");

  // Label via i18n of fallback tekst
  if (labelKey) {
    setI18n(labelSpan, labelKey, labelArgs);
  } else if (labelText) {
    labelSpan.textContent = labelText;
  } else {
    labelSpan.textContent = name;
  }

  const input = document.createElement("input");
  input.type = type;
  input.name = name;
  if (inputClass) input.className = inputClass;

  // Non-i18n default value (directe value)
  if (defaultValue !== undefined && defaultValue !== null) {
    if (type === "checkbox") {
      input.checked = Boolean(defaultValue);
    } else {
      input.value = defaultValue;
    }
  }

  // Default value via i18n op het "value" attribuut
  if (defaultValueKey) {
    setI18n(input, defaultValueKey, defaultValueArgs || null, "value");
  }

  // Placeholder: eerst i18n, anders plain tekst
  if (placeholderKey) {
    setI18n(input, placeholderKey, placeholderArgs || null, "placeholder");
  } else if (placeholderText) {
    input.placeholder = placeholderText;
  }

  // Extra attributen
  Object.entries(attrs).forEach(([k, v]) => {
    input.setAttribute(k, v);
  });

  // Klein gemak voor number-inputs
  if (type === "number" && !("inputMode" in attrs)) {
    input.inputMode = "numeric";
  }

  wrap.append(labelSpan, input);
  return { wrap, labelSpan, input };
}

/**
 * Maakt een gelabeld select-veld in een <label>-wrapper.
 *
 * @param {string} name - name/id basis voor het veld
 *
 * @param {object} elemOpts  - element/HTML opties
 *   wrapClass?: string        - class voor de wrapper (<label>)
 *   selectClass?: string      - class voor de <select>
 *   entries?: Array           - items voor de opties
 *                              - standaard: Array<[key, value]>, bv Object.entries(Enum)
 *                              - of: { value, label?, i18nKey? }
 *   attrs?: object            - extra attributen op de select
 *   includeEmptyOption?:bool  - voeg lege "kies iets" optie toe
 *   emptyValue?: string       - value van de lege optie (default: "")
 *   emptyLabelText?: string   - label tekst voor lege optie (non-i18n)
 *
 * @param {object} i18nOpts  - i18n opties
 *   label?: string           - i18n-key voor het label
 *   emptyLabel?: string      - i18n-key voor de lege optie
 *   optionFromValue?: bool   - als true: setI18n(opt, value) voor elke optie
 *
 * @returns {{ wrap: HTMLLabelElement, labelSpan: HTMLSpanElement, select: HTMLSelectElement }}
 */
export function makeSelectField(name, elemOpts = {}, i18nOpts = {}) {
  const {
    wrapClass = "row equal",
    selectClass = "",
    entries = [],
    attrs = {},
    includeEmptyOption = false,
    emptyValue = "",
    emptyLabelText = "—",
  } = elemOpts;

  const {
    label: labelKey,
    emptyLabel: emptyLabelKey,
    optionFromValue = false,
  } = i18nOpts;

  const wrap = document.createElement("label");
  wrap.className = wrapClass;

  const labelSpan = document.createElement("span");
  // Label via i18n of fallback tekst
  if (labelKey) {
    setI18n(labelSpan, labelKey);
  } else {
    labelSpan.textContent = name;
  }

  const select = document.createElement("select");
  select.name = name;
  if (selectClass) select.className = selectClass;

  // Extra attributes
  Object.entries(attrs).forEach(([k, v]) => {
    select.setAttribute(k, v);
  });

  // Eventuele lege "kies iets" optie
  if (includeEmptyOption) {
    const emptyOpt = document.createElement("option");
    emptyOpt.value = emptyValue;

    if (emptyLabelKey) {
      setI18n(emptyOpt, emptyLabelKey);
    } else {
      emptyOpt.textContent = emptyLabelText;
    }

    select.appendChild(emptyOpt);
  }

  // entries: Array<[key, value]> (enum-stijl) of {value, label, i18nKey}
  for (const entry of entries) {
    let value;
    let label;
    let entryI18nKey;

    if (Array.isArray(entry)) {
      const [key, val] = entry;
      value = val;
      label = key;
      // bij enums als SEXSELF_ENUM => value is al i18n-key
      if (optionFromValue) {
        entryI18nKey = val;
      }
    } else if (entry && typeof entry === "object") {
      value = entry.value;
      label = entry.label;
      entryI18nKey = entry.i18nKey;
    }

    const opt = document.createElement("option");
    opt.value = value ?? "";

    // i18n label voor optie
    if (entryI18nKey) {
      setI18n(opt, entryI18nKey);
    } else if (optionFromValue && value) {
      setI18n(opt, value);
    }

    // fallback tekst als i18n niets doet of ontbreekt
    if (!opt.textContent && label) {
      opt.textContent = label;
    }

    select.appendChild(opt);
  }

  wrap.append(labelSpan, select);
  return { wrap, labelSpan, select };
}

/**
 * Maakt een simpele separator (scheidingslijn).
 *
 * @returns {HTMLDivElement}
 */
export function makeSeperator() {
  const el = document.createElement("div");
  el.className = "sep";
  return el;
}

export function makePanel(id, active = false) {
  if (!id) throw new Error("Panel requires an id");

  const app = document.getElementById("app");
  if (!app) throw new Error("App container (#app.app) not found");

  const base = `panel-${id}`;

  const section = document.createElement("section");
  section.className = "panel" + (active ? " active" : " inactive");
  section.id = `${base}.section`;
  section.setAttribute("data-panel", `${base}`);

  const header = document.createElement("div");
  header.className = "header col";
  header.id = `${base}.header`;
  section.appendChild(header);

  const body = document.createElement("div");
  body.className = "body col";
  body.id = `${base}.body`;
  section.appendChild(body);

  const footer = document.createElement("div");
  footer.className = "footer col";
  footer.id = `${base}.footer`;
  section.appendChild(footer);

  app.appendChild(section);

  return { panelID: base, section, header, body, footer };
}

export function getPanel(id) {
  if (!id) throw new Error("getPanel requires an id");

  const base = `panel-${id}`;

  const section = document.getElementById(`${base}.section`);
  if (!section) return null;

  const header = section.querySelector(`#${base}.header`);
  const body = section.querySelector(`#${base}.body`);
  const footer = section.querySelector(`#${base}.footer`);

  return {
    panelID: base,
    section,
    header,
    body,
    footer,
  };
}
