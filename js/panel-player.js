import { PLAYER, onPlayerChange } from "./player.js";
import { setI18n } from "./lang_i18n.js";

const unsubscribe = onPlayerChange(() => {
  setupPanelPlayer();
});

export function setupPanelPlayer() {
  const root = document.getElementById("panel-player.overview");
  if (!root) return;

  root.innerHTML = "";

  const el = document.createElement("div");
  el.className = "row"; // of: el.classList.add("row")

  // Naam
  const nameEl = document.createElement("div");
  const nameProp = document.createElement("span");
  setI18n(nameProp, "ui.panel-player.overview.nameProp");
  const nameVal = document.createElement("span");
  nameVal.textContent = (PLAYER.name ?? "Unknown");
  nameEl.append(nameProp, nameVal); // append kan meerdere nodes

  // Leeftijd
  const ageEl = document.createElement("div");
  const ageProp = document.createElement("span");
  setI18n(ageProp, "ui.panel-player.overview.ageProp");
  const ageVal = document.createElement("span");
  ageVal.textContent = (PLAYER.age ?? "Unknown");
  ageEl.append(ageProp, ageVal);

  // Geslacht
  const sexEl = document.createElement("div");
  const sexProp = document.createElement("span");
  setI18n(sexProp, "ui.panel-player.overview.sexProp");
  const sexVal = document.createElement("span");
  sexVal.textContent = (setI18n(sexVal, PLAYER.sex) ?? "Unknown");
  sexEl.append(sexProp, sexVal);

  // Geslachtsvoorkeur
  const sexTargetEl = document.createElement("div");
  const sexTargetProp = document.createElement("span");
  setI18n(sexTargetProp, "ui.panel-player.overview.sexTargetProp");
  const sexTargetVal = document.createElement("span");
  sexTargetVal.textContent = (setI18n(sexTargetVal, PLAYER.sexTarget) ?? "Unknown");
  sexTargetEl.append(sexTargetProp, sexTargetVal);

  // Voeg alle velden toe aan de rij
  el.append(nameEl, ageEl, sexEl, sexTargetEl); // gebruik append i.p.v. appendChild

  root.appendChild(el);
}
