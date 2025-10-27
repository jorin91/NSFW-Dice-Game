import { gameSetActivePanel } from "./gamestate.js";

export function showPanel(key) {
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.toggle("active", p.dataset.panel === key));
}

// helper die je 1x (of vaker) kunt aanroepen; werkt ook voor nieuw toegevoegde buttons
let _panelNavHandler = null;
export function attachPanelNavigation() {
  if (_panelNavHandler) {
    document.removeEventListener("click", _panelNavHandler);
  }
  _panelNavHandler = (e) => {
    const btn = e.target.closest("[data-panel]");
    if (!btn) return;
    const key = btn.dataset.panel;
    showPanel(key);
    // ⤵ sla de actieve panel op als gameSetActivePanel beschikbaar is
    gameSetActivePanel(key);
  };
  document.addEventListener("click", _panelNavHandler);
}
