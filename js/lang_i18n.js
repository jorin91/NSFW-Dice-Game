// js/i18n.js  (laad als ES module: <script type="module" src="js/i18n.js"></script>)
const LANG_KEY = "NSFWDiceGame_lang";
let currentLang = "en";
let dict = {};
const cache = new Map();
const listeners = new Set();
export const I18N_MODULES = ["clothes", "enums", "tasks", "ui"];

// Helper: veilig JSON laden uit submap; 404 wordt stilletjes overgeslagen
async function fetchModuleDict(lang, mod) {
  const path = mod ? `i18n/${mod}/${lang}.json` : `i18n/${lang}.json`;
  const r = await fetch(path, { cache: "no-store" });
  if (r.status === 404) return {}; // module ontbreekt: negeren
  if (!r.ok) throw new Error(`Failed to load ${path}`);
  return r.json();
}

async function loadDict(lang) {
  // Cache key hangt af van taal én de gekozen modules
  const cacheKey = `${lang}::${(I18N_MODULES || []).join("|")}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  const p = (async () => {
    // Als er geen modules gedefinieerd zijn, val terug op root i18n/{lang}.json
    const modules =
      Array.isArray(I18N_MODULES) && I18N_MODULES.length ? I18N_MODULES : [""];
    const parts = await Promise.all(
      modules.map((m) =>
        fetchModuleDict(lang, m).catch((e) => {
          console.warn(
            `[i18n] overslaan wegens laadfout: ${m}/${lang}.json`,
            e
          );
          return {};
        })
      )
    );
    // Platte merge: latere modules overschrijven eerdere keys
    return Object.assign({}, ...parts);
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

export async function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  dict = await loadDict(lang);
  applyI18n(document); // update zichtbare nodes
  updateLangButtons(lang);
  listeners.forEach((fn) => {
    try {
      fn(lang);
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
        }
      });
    }
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // optionele topbar language buttons
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      if (lang) setLang(lang);
    });
  });
}

export function setI18n(el, key, argsObj = null, target = null) {
  if (target) {
    // Gerichte binding, bijvoorbeeld: data-i18n="text" of data-i18n="placeholder"
    el.setAttribute("data-i18n", key);
    el.setAttribute("data-i18n-target", target);
  } else {
    // Automatische vertaling (standaard)
    el.setAttribute("data-i18n-auto", key);
  }

  if (argsObj && typeof argsObj === "object") {
    el.setAttribute("data-i18n-args", JSON.stringify(argsObj));
  }

  return el;
}