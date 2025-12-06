import { PLAYER, onPlayerChange } from "./player.js";
import { setI18n } from "./lang_i18n.js";

const unsubscribe = onPlayerChange((player, change) => {
  setupPanelPlayer();
});

export function setupPanelPlayer() {
  const root = document.getElementById("panel-player.overview");
  if (!root) return;

  root.innerHTML = "";

  const el = document.createElement("div");
  el.class = "row";

  const nameEl = document.createElement("div");
  const nameProp = document.createElement("span");
  setI18n(nameProp, "ui.panel-player.overview.nameProp");
  const nameVal = document.createElement("span");
  nameVal.textContent = PLAYER.name || "Unknown";

  nameEl.appendChild(nameProp, nameVal);

  const ageEl = document.createElement("div");
  const ageProp = document.createElement("span");
  setI18n(ageProp, "ui.panel-player.overview.ageProp");
  const ageVal = document.createElement("span");
  ageVal.textContent = PLAYER.age || "Unknown";

  ageEl.appendChild(ageProp, ageVal);

  const sexEl = document.createElement("div");
  const sexProp = document.createElement("span");
  setI18n(sexProp, "ui.panel-player.overview.sexProp");
  const sexVal = document.createElement("span");
  sexVal.textContent = PLAYER.sex || "Unknown";
  sexEl.appendChild(sexProp, sexVal);

  el.appendChild(nameEl, ageEl, sexEl);
  root.appendChild(el);
}
