import { PLAYER, onPlayerChange } from "./player.js";
import { setI18n } from "./lang_i18n.js";
import { SEXSELF_ENUM, SEXTARGET_ENUM } from "./enums.js";
import { makeInputField, makeSelectField } from "./utils.js";

const unsubscribe = onPlayerChange(() => {
  setupPanelPlayer();
  setupPanelPlayerSetup();
});

export function setupPanelPlayer() {
  const rootPlayer = document.getElementById("panel-player.overview");
  const rootPanel = document.getElementById("player-overview");
  if (!rootPlayer || !rootPanel) return;

  rootPlayer.innerHTML = "";

  const el = document.createElement("div");
  el.className = "row"; // of: el.classList.add("row")

  // Naam
  const nameEl = document.createElement("div");
  const nameProp = document.createElement("span");
  setI18n(nameProp, "ui.panel-player.overview.nameProp");
  const nameVal = document.createElement("span");
  nameVal.textContent = PLAYER.name ?? "Unknown";
  nameEl.append(nameProp, nameVal); // append kan meerdere nodes

  // Leeftijd
  const ageEl = document.createElement("div");
  const ageProp = document.createElement("span");
  setI18n(ageProp, "ui.panel-player.overview.ageProp");
  const ageVal = document.createElement("span");
  ageVal.textContent = PLAYER.age ?? "Unknown";
  ageEl.append(ageProp, ageVal);

  // Geslacht
  const sexEl = document.createElement("div");
  const sexProp = document.createElement("span");
  setI18n(sexProp, "ui.panel-player.overview.sexProp");
  const sexVal = document.createElement("span");

  if (PLAYER.sex) {
    setI18n(sexVal, PLAYER.sex);
  } else {
    sexVal.textContent = "Unknown";
  }

  sexEl.append(sexProp, sexVal);

  // Geslachtsvoorkeur
  const sexTargetEl = document.createElement("div");
  const sexTargetProp = document.createElement("span");
  setI18n(sexTargetProp, "ui.panel-player.overview.sexTargetProp");
  const sexTargetVal = document.createElement("span");

  if (PLAYER.sexTarget) {
    setI18n(sexTargetVal, PLAYER.sexTarget);
  } else {
    sexTargetVal.textContent = "Unknown";
  }

  sexTargetEl.append(sexTargetProp, sexTargetVal);

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.className = "btn";
  editBtn.setAttribute("data-panel-hide", "player-overview");
  editBtn.setAttribute("data-panel-show", "player-setup");
  setI18n(editBtn, "ui.panel-player.overview.editButton");

  // Voeg alle velden toe aan de rij
  el.append(nameEl, ageEl, sexEl, sexTargetEl, editBtn); // gebruik append i.p.v. appendChild

  // Check for complete player profile
  if (!PLAYER.name || !PLAYER.age || PLAYER.age <= 0 || !PLAYER.sex || !PLAYER.sexTarget) {
    const noDataEl = document.createElement("div");
    noDataEl.className = "footer error";
    noDataEl.id = "player-overview.player-no-data-warning";

    setI18n(noDataEl, "ui.panel-player.overview.missingPlayerData");

    rootPanel.appendChild(noDataEl);
  } else {
    const existingWarning = document.getElementById(
      "player-overview.player-no-data-warning"
    );
    if (existingWarning) {
      existingWarning.remove();
    }
  }

  rootPlayer.appendChild(el);
}

export function setupPanelPlayerSetup() {
  const rootSetup = document.getElementById("panel-player.setup");
  const rootPanel = document.getElementById("player-overview");
  if (!rootSetup || !rootPanel) return;

  rootSetup.innerHTML = "";

  // Naam
  const nameEl = makeInputField("name", "text", {
    labelI18n: "ui.panel-player.setup.nameProp",
    defaultValue: PLAYER.name || ""
  });

  // Leeftijd
  const ageEl = makeInputField("age", "number", {
    labelI18n: "ui.panel-player.setup.ageProp",
    defaultValue: PLAYER.age || 0,
    attrs: { min: 0 }
  });

  // Geslacht
  const sexEl = makeSelectField("sex", {
    labelI18n: "ui.panel-player.setup.sexProp",
    entries: Object.entries(SEXSELF_ENUM)
  });

  // Geslachtsvoorkeur
  const sexTargetEl = makeSelectField("sexTarget", {
    labelI18n: "ui.panel-player.setup.sexTargetProp",
    entries: Object.entries(SEXTARGET_ENUM)
  });

  // Save button
  const saveBtn = document.createElement("button");
  saveBtn.className = "btn";
  saveBtn.setAttribute("data-panel-show", "player-overview");
  saveBtn.setAttribute("data-panel-hide", "player-setup");
  saveBtn.addEventListener("click", () => {
    // Waarden opslaan in PLAYER
    const nameVal = nameEl.input.value.trim();
    const ageVal = parseInt(ageEl.input.value, 10);
    const sexVal = sexEl.select.value;
    const sexTargetVal = sexTargetEl.select.value;
  });
  setI18n(saveBtn, "ui.panel-player.setup.button.save");

  // Voeg alle velden toe aan de rij
  el.append(nameEl, ageEl, sexEl, sexTargetEl, saveBtn); // gebruik append i.p.v. appendChild
}