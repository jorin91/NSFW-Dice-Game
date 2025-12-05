const PANEL_SELECTOR = "section[data-panel]";
let _panelNavHandler = null;

// Alle panels ophalen
function getAllPanels() {
  return Array.from(document.querySelectorAll(PANEL_SELECTOR));
}

// keys normaliseren: "*", string, array
function normalizeKeys(keys) {
  if (keys === undefined || keys === null) return [];
  if (keys === "*") return ["*"];
  if (Array.isArray(keys)) return keys;
  if (typeof keys === "string") return [keys.trim()];
  return [];
}

// Panels zoeken op basis van keys
// ["*"] => alle panels
// anders: match op data-panel
function findPanelsByKeys(rawKeys) {
  const keys = normalizeKeys(rawKeys);
  const all = getAllPanels();

  if (keys.length === 0) return [];
  if (keys.includes("*")) return all;

  const set = new Set(keys);
  return all.filter((panel) => set.has(panel.dataset.panel));
}

// Verberg één panel + alle child-panels
function hidePanelRecursive(panel) {
  panel.classList.remove("active");
  panel.classList.add("inactive");

  const children = panel.querySelectorAll(PANEL_SELECTOR);
  children.forEach((child) => {
    child.classList.remove("active");
    child.classList.add("inactive");
  });
}

// Toon één panel + alle parent-panels (maar geen children)
function showPanelWithParents(panel) {
  let current = panel;

  while (current && current.matches && current.matches(PANEL_SELECTOR)) {
    current.classList.remove("inactive");
    current.classList.add("active");

    // zoek de eerstvolgende ancestor met data-panel
    const parentSection = current.parentElement
      ? current.parentElement.closest(PANEL_SELECTOR)
      : null;

    current = parentSection;
  }
}

// PUBLIC: showPanel – accepteert "*", string of array
export function showPanel(keys) {
  const panels = findPanelsByKeys(keys);
  panels.forEach((panel) => showPanelWithParents(panel));
}

// PUBLIC: hidePanel – accepteert "*", string of array
export function hidePanel(keys) {
  const panels = findPanelsByKeys(keys);
  panels.forEach((panel) => hidePanelRecursive(panel));
}

// PUBLIC: switchPanel – eerst hide, dan show
// hideKeys/showKeys: "*", string of array (allemaal optioneel)
export function switchPanel(hideKeys, showKeys) {
  const hideNorm = normalizeKeys(hideKeys);
  const showNorm = normalizeKeys(showKeys);

  if (hideNorm.length > 0) {
    hidePanel(hideNorm);
  }
  if (showNorm.length > 0) {
    showPanel(showNorm);
  }
}

// Helper voor data-attribuut parsing: "*", "a,b,c"
function parseAttrKeys(value) {
  if (!value) return [];
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (trimmed === "*") return ["*"];
  return trimmed
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
}

// Init: click handler voor declaratieve navigatie
// gebruik op buttons/links:
//  data-panel-show="menu,settings" of "*"
//  data-panel-hide="menu,settings" of "*"
export function initPanelNavigation() {
  if (_panelNavHandler) {
    document.removeEventListener("click", _panelNavHandler);
  }

  _panelNavHandler = (e) => {
    const trigger = e.target.closest("[data-panel-show], [data-panel-hide]");
    if (!trigger) return;

    const hideKeys = parseAttrKeys(trigger.getAttribute("data-panel-hide"));
    const showKeys = parseAttrKeys(trigger.getAttribute("data-panel-show"));

    switchPanel(hideKeys, showKeys);
  };

  document.addEventListener("click", _panelNavHandler);
}
