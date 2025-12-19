// js/i18n.js  (laad als ES module: <script type="module" src="js/i18n.js"></script>)
const LANG_KEY = "NSFWDiceGame_lang";
let currentLang = "en";
let dict = {};
const cache = new Map();
const listeners = new Set();
export const I18N_FILES_FALLBACK = ["clothes", "enums", "tasks", "ui"];
const I18N_MANIFEST_PATH = "i18n/manifest.json";

async function fetchJson(path) {
  const r = await fetch(path, { cache: "no-store" });
  if (r.status === 404) return null; // ontbreekt: stil skippen
  if (!r.ok) throw new Error(`Failed to load ${path}`);
  return r.json();
}

async function loadManifest() {
  const man = await fetchJson(I18N_MANIFEST_PATH);
  if (!man) return null;

  // files is vereist om manifest bruikbaar te maken
  if (!Array.isArray(man.files)) return null;

  // languages is optioneel
  return {
    files: man.files,
    languages: Array.isArray(man.languages)
      ? man.languages
          .filter(
            (x) => x && typeof x === "object" && typeof x.code === "string"
          )
          .map((x) => ({
            code: String(x.code).toLowerCase().trim(),
            name: typeof x.name === "string" ? x.name : String(x.code),
          }))
      : [],
  };
}

async function loadDict(lang) {
  // 1) manifest proberen (automatisch uitbreidbaar)
  const manifest = await loadManifest();
  const files = manifest?.files?.length ? manifest.files : I18N_FILES_FALLBACK;

  // Cache key hangt af van taal én files-lijst
  const cacheKey = `${lang}::${files.join("|")}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const p = (async () => {
    // 2) laad alle i18n/<name>_<lang>.json bestanden
    const paths = files.map((name) => `i18n/${name}_${lang}.json`);

    const parts = await Promise.all(
      paths.map((path) =>
        fetchJson(path).catch((e) => {
          console.warn(`[i18n] overslaan wegens laadfout: ${path}`, e);
          return null;
        })
      )
    );

    // 3) merge (latere files overschrijven eerdere keys)
    return Object.assign({}, ...parts.filter(Boolean));
  })();

  cache.set(cacheKey, p);
  return p;
}

export function t(key, vars) {
  let s = dict[key] ?? key; // fallback toont key
  if (typeof s !== "string") return s;

  const reg = /\{([^}]+)\}/g;
  let prev;

  do {
    prev = s;
    s = s.replace(reg, (match, name) => {
      const k = name.trim();

      // 1) vars heeft voorrang als aanwezig
      if (vars && Object.prototype.hasOwnProperty.call(vars, k)) {
        return String(vars[k]);
      }

      // 2) anders: probeer i18n-key
      if (Object.prototype.hasOwnProperty.call(dict, k)) {
        const v = dict[k];
        return typeof v === "string" ? v : String(v);
      }

      // 3) onbekend -> placeholder laten staan
      return match;
    });
  } while (s !== prev); // recursief door blijven gaan tot er niets meer verandert

  return s;
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function updateLangButtons(activeLang) {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const lang = btn.dataset.lang;
    // alleen de actieve knop is géén ghost
    btn.classList.toggle("ghost", lang !== activeLang);
  });
}

async function resolveLanguage(requestedLang) {
  const manifest = await loadManifest();
  const allowed = manifest?.languages || [];
  const allowedCodes = allowed.map((l) => l.code);

  // normalize
  let lang = (requestedLang || "").toLowerCase().trim();

  // 1) als er een whitelist is: altijd beperken tot manifest
  if (allowedCodes.length) {
    if (!allowedCodes.includes(lang)) lang = allowedCodes[0];
  } else {
    // geen whitelist: oude gedrag (maar nog steeds netjes)
    if (!lang) lang = "en";
  }

  // 2) probeer gekozen taal te laden
  let d = await loadDict(lang);
  if (d && Object.keys(d).length) return { lang, dict: d };

  // 3) fallback: eerste taal uit manifest die echt iets laadt
  for (const cand of allowed) {
    const dd = await loadDict(cand.code);
    if (dd && Object.keys(dd).length) return { lang: cand.code, dict: dd };
  }

  // 4) als whitelist bestaat maar alles is leeg: pak alsnog allowed[0] (niet "en")
  if (allowed.length) {
    const first = allowed[0].code;
    const fd = await loadDict(first);
    return { lang: first, dict: fd || {} };
  }

  // 5) laatste fallback als er geen whitelist is
  const en = await loadDict("en");
  return { lang: "en", dict: en || {} };
}

export async function setLang(lang) {
  const resolved = await resolveLanguage(lang);

  currentLang = resolved.lang;
  localStorage.setItem(LANG_KEY, currentLang);
  document.documentElement.lang = currentLang;

  dict = resolved.dict || {};
  applyI18n(document);
  updateLangButtons(currentLang);

  listeners.forEach((fn) => {
    try {
      fn(currentLang);
    } catch (e) {
      console.error(e);
    }
  });
}

export function getLang() {
  return currentLang;
}

function safeJsonParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

function findLabelSlot(el) {
  return el.querySelector(
    '[data-i18n-slot="text"], .label, .btn__label, .button__label, span, p'
  );
}

function canSetTextDirect(el) {
  if (el.children.length === 0) return true;
  const onlyText = [...el.childNodes].every(
    (n) => n.nodeType === Node.TEXT_NODE
  );
  return onlyText;
}

function bindLangButtons(root = document) {
  root.querySelectorAll?.(".lang-btn").forEach((btn) => {
    if (btn.dataset.langBound === "1") return; // al gebonden

    btn.dataset.langBound = "1";
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang || btn.getAttribute("data-lang");
      if (lang) setLang(lang);
    });
  });
}

// Kern: pas i18n toe op 1 element
export function applyI18nToElement(el) {
  const key = el.getAttribute?.("data-i18n");
  const attrMap = el.getAttribute?.("data-i18n-attr");
  const argsRaw = el.getAttribute?.("data-i18n-args");
  const target = el.getAttribute?.("data-i18n-target"); // "text"|"html"|attribuutnaam
  const vars = argsRaw ? safeJsonParse(argsRaw) : undefined;

  // 1) attribuut-mapping, bv: placeholder:settings.search,aria-label:hints.close
  if (attrMap) {
    attrMap.split(",").forEach((pair) => {
      const [attr, k] = pair.split(":").map((s) => s.trim());
      if (attr && k) el.setAttribute(attr, t(k, vars));
    });
  }

  // 2) expliciete key
  if (key) {
    const val = t(key, vars);
    if (target === "html") el.innerHTML = val;
    else if (target === "text" || !target) {
      if (target === "text" || canSetTextDirect(el)) el.textContent = val;
      else {
        const slot = findLabelSlot(el);
        if (slot) slot.textContent = val;
      }
    } else {
      el.setAttribute(target, val); // bv "value" / "title" / "aria-label"
    }
    return;
  }

  // 3) auto-mapping per elementtype
  const tag = (el.tagName || "").toUpperCase();
  switch (tag) {
    case "INPUT": {
      const type = (el.getAttribute("type") || "").toLowerCase();
      if (type === "button" || type === "submit" || type === "reset") {
        const k = el.getAttribute("data-i18n-auto") || el.name || el.id;
        if (k) el.value = t(k, vars);
      } else {
        const k = el.getAttribute("data-i18n-auto-placeholder");
        if (k) el.setAttribute("placeholder", t(k, vars));
      }
      break;
    }
    case "TEXTAREA": {
      const k = el.getAttribute("data-i18n-auto-placeholder");
      if (k) el.setAttribute("placeholder", t(k, vars));
      break;
    }
    case "IMG": {
      const altK = el.getAttribute("data-i18n-auto-alt");
      if (altK) el.setAttribute("alt", t(altK, vars));
      const titleK = el.getAttribute("data-i18n-auto-title");
      if (titleK) el.setAttribute("title", t(titleK, vars));
      break;
    }
    case "BUTTON": {
      const k =
        el.getAttribute("data-i18n-auto") || el.getAttribute("aria-label");
      if (k) {
        const slot = findLabelSlot(el);
        const val = t(k, vars);
        if (slot) slot.textContent = val;
        else if (canSetTextDirect(el)) el.textContent = val;
        else el.setAttribute("aria-label", val);
      }
      break;
    }
    case "OPTION":
    case "LABEL":
    case "LEGEND":
    case "A":
    case "H1":
    case "H2":
    case "H3":
    case "H4":
    case "H5":
    case "H6":
    case "P":
    case "SPAN":
    case "DIV":
    case "LI":
    case "TH":
    case "TD": {
      const k = el.getAttribute("data-i18n-auto");
      if (k) {
        const val = t(k, vars);
        if (canSetTextDirect(el)) el.textContent = val;
        else {
          const slot = findLabelSlot(el);
          if (slot) slot.textContent = val;
        }
      }
      break;
    }
    case "SUMMARY": {
      const k = el.getAttribute("data-i18n-auto");
      if (k) {
        const val = t(k, vars);
        if (canSetTextDirect(el)) el.textContent = val;
        else {
          const slot = findLabelSlot(el);
          if (slot) slot.textContent = val;
        }
      }
      break;
    }
    case "SVG": {
      const k = el.getAttribute("data-i18n-auto-title");
      if (k) {
        let title = el.querySelector("title");
        if (!title) {
          title = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "title"
          );
          el.prepend(title);
        }
        title.textContent = t(k, vars);
      }
      break;
    }
    default:
      break;
  }
}

// Pas i18n toe op hele document/subtree
export function applyI18n(root = document) {
  const sel = [
    "[data-i18n]",
    "[data-i18n-attr]",
    "[data-i18n-auto]",
    "[data-i18n-auto-placeholder]",
    "[data-i18n-auto-alt]",
    "[data-i18n-auto-title]",
  ].join(",");
  root.querySelectorAll(sel).forEach(applyI18nToElement);
}

// init: taal laden, observer voor nieuw toegevoegde nodes, switcher koppelen
export async function initI18n() {
  const saved =
    localStorage.getItem(LANG_KEY) || (navigator.language || "en").slice(0, 2);
  await setLang(saved);

  // auto-apply voor dynamisch toegevoegde UI
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          const el = node;

          // i18n apply
          if (
            el.matches?.(
              "[data-i18n], [data-i18n-attr], [data-i18n-auto], [data-i18n-auto-placeholder], [data-i18n-auto-alt], [data-i18n-auto-title]"
            )
          ) {
            applyI18nToElement(el);
          }
          el.querySelectorAll?.(
            "[data-i18n], [data-i18n-attr], [data-i18n-auto], [data-i18n-auto-placeholder], [data-i18n-auto-alt], [data-i18n-auto-title]"
          ).forEach(applyI18nToElement);

          // lang buttons bind (nieuw)
          if (el.matches?.(".lang-btn")) bindLangButtons(el);
          bindLangButtons(el); // bind ook eventuele descendants
        }
      });
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // bind bestaande (als ze er al zijn)
  bindLangButtons(document);
}

/**
 * setI18n(el, key = null, argsObj = null, target = null, update = false, attr = null)
 *
 * Centrale helper om een element te "koppelen" aan jouw i18n-systeem.
 * Je gebruikt deze functie als je vanuit JavaScript UI-elementen maakt,
 * en daar direct de juiste data-i18n-attributen op wilt zetten.
 *
 * -----------------------------------------------------------
 * PARAMS
 * -----------------------------------------------------------
 * el        : HTMLElement
 *   Het element dat vertaald moet worden.
 *
 * key       : string | null
 *   De i18n-key die gebruikt moet worden.
 *
 *   Gedrag:
 *   - Als 'target' is meegegeven → wordt "data-i18n" gezet
 *     en richt de vertaling zich op een specifieke output
 *     (bijv. innerText, innerHTML, placeholder, title, etc.).
 *
 *   - Als er GEEN 'target' is → wordt "data-i18n-auto" gebruikt
 *     en laat je de automatische detectie bepalen hoe de tekst
 *     geplaatst wordt (op basis van tagtype en childnodes).
 *
 *   Voorbeelden:
 *     setI18n(btn, "ui.save");                  → data-i18n-auto="ui.save"
 *     setI18n(input, "ui.search", null, "placeholder");
 *                                               → data-i18n="ui.search"
 *                                                 data-i18n-target="placeholder"
 *
 * argsObj   : object | null
 *   Optionele variabelen voor placeholders binnen de vertaalstring.
 *   Wordt JSON-geencodeerd in data-i18n-args.
 *
 *   In JSON: { "name": "Jorin" }
 *   In tekst: "Hallo {name}" → "Hallo Jorin"
 *
 *
 * target    : string | null
 *   Bepaalt HOE de vertaling moet worden toegepast.
 *   Mogelijke waarden zijn o.a.:
 *   - "text"  → el.textContent
 *   - "html"  → el.innerHTML
 *   - iedere andere attribuutnaam (bijv. "placeholder", "title")
 *
 *   Gedrag:
 *   - Als target is gezet → gebruik data-i18n + data-i18n-target
 *   - Als target niet is gezet → gebruik data-i18n-auto
 *
 *
 * update    : boolean
 *   Als true → direct applyI18nToElement(el) uitvoeren.
 *   Dit is handig wanneer je een element maakt en direct wilt
 *   vertalen zonder te wachten op een globale applyI18n() call.
 *
 *   Let op: als je meerdere attributen in stappen zet, kun je
 *   update beter op false laten en handmatig aan het einde één
 *   keer applyI18nToElement() doen.
 *
 *
 * attr      : string | null
 *   Hiermee kun je extra attribuut-vertalingen instellen.
 *   Bijvoorbeeld: "placeholder:ui.search,aria-label:ui.close"
 *
 *   Dit vult data-i18n-attr.
 *
 *
 * -----------------------------------------------------------
 * RETURN
 * -----------------------------------------------------------
 * Retourneert hetzelfde element zodat chaining mogelijk is.
 *
 * -----------------------------------------------------------
 * ALGEMEEN GEBRUIK
 * -----------------------------------------------------------
 * 1) Automatische tekst:
 *      setI18n(btn, "ui.save");
 *
 * 2) Vertaling naar specifiek attribuut:
 *      setI18n(input, "ui.search", null, "placeholder");
 *
 * 3) Met variabelen:
 *      setI18n(span, "player.score", { score: 12 });
 *
 * 4) Direct updaten:
 *      setI18n(btn, "ui.ok", null, null, true);
 *
 * 5) Meerdere attribuut-bindings:
 *      setI18n(icon, null, null, null, false, "title:ui.info,aria-label:ui.info");
 */
export function setI18n(
  el,
  key = null,
  argsObj = null,
  target = null,
  update = false,
  attr = null
) {
  if (target) {
    // Gerichte binding, bijvoorbeeld: data-i18n="text" of data-i18n="placeholder"
    el.setAttribute("data-i18n", key);
    el.setAttribute("data-i18n-target", target);
  } else if (key) {
    // Automatische vertaling (standaard)
    el.setAttribute("data-i18n-auto", key);
  }

  if (argsObj && typeof argsObj === "object") {
    el.setAttribute("data-i18n-args", JSON.stringify(argsObj));
  }

  if (update) {
    applyI18nToElement(el);
  }

  if (attr) {
    el.setAttribute("data-i18n-attr", attr);
  }

  return el;
}

export async function getSupportedLanguages() {
  const manifest = await loadManifest();
  return manifest?.languages?.length ? manifest.languages : [];
}
