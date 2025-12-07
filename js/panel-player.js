import { PLAYER, onPlayerChange } from "./player.js";
import { setI18n } from "./lang_i18n.js";
import { SEXSELF_ENUM, SEXTARGET_ENUM } from "./enums.js";
import { makeInputField, makeSelectField } from "./elementHelpers.js";

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
  el.className = "row equal"; // of: el.classList.add("row")

  // Naam
  const nameEl = document.createElement("div");
  nameEl.className = "row small";
  const nameProp = document.createElement("span");
  setI18n(nameProp, "ui.panel-player.overview.nameProp");
  const nameVal = document.createElement("span");
  nameVal.textContent = PLAYER.name ?? "Unknown";
  nameEl.append(nameProp, nameVal); // append kan meerdere nodes

  // Leeftijd
  const ageEl = document.createElement("div");
  ageEl.className = "row small";
  const ageProp = document.createElement("span");
  setI18n(ageProp, "ui.panel-player.overview.ageProp");
  const ageVal = document.createElement("span");
  ageVal.textContent = PLAYER.age ?? "Unknown";
  ageEl.append(ageProp, ageVal);

  // Geslacht
  const sexEl = document.createElement("div");
  sexEl.className = "row small";
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
  sexTargetEl.className = "row small";
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
  const existingWarning = document.getElementById(
    "player-overview.player-no-data-warning"
  );

  if (
    !PLAYER.name ||
    !PLAYER.age ||
    PLAYER.age <= 0 ||
    !PLAYER.sex ||
    !PLAYER.sexTarget
  ) {
    if (!existingWarning) {
      const noDataEl = document.createElement("div");
      noDataEl.className = "footer error";
      noDataEl.id = "player-overview.player-no-data-warning";

      setI18n(noDataEl, "ui.panel-player.overview.missingPlayerData");

      rootPanel.appendChild(noDataEl);
    }
  } else {
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
  const { wrap: nameWrap, input: nameInput } = makeInputField(
    "player_name",
    "text",
    {
      defaultValue: PLAYER.name || "",
    },
    {
      label: "ui.panel-player.setup.nameProp",
      // eventueel: placeholder: "ui.panel-player.setup.namePlaceholder"
    }
  );

  // Leeftijd
  const { wrap: ageWrap, input: ageInput } = makeInputField(
    "player_age",
    "number",
    {
      defaultValue: PLAYER.age || "",
      attrs: { min: 0 },
    },
    {
      label: "ui.panel-player.setup.ageProp",
    }
  );

  // Geslacht (self)
  const { wrap: sexWrap, select: sexSelect } = makeSelectField(
    "player_sex",
    {
      entries: Object.entries(SEXSELF_ENUM),
      includeEmptyOption: true,
      emptyLabelText: "Unknown",
    },
    {
      label: "ui.panel-player.setup.sexProp",
      optionFromValue: true, // enums zijn al i18n-keys
    }
  );
  if (PLAYER.sex) {
    sexSelect.value = PLAYER.sex;
  }

  // Geslachtsvoorkeur (target)
  const { wrap: sexTargetWrap, select: sexTargetSelect } = makeSelectField(
    "player_sexTarget",
    {
      entries: Object.entries(SEXTARGET_ENUM),
      includeEmptyOption: true,
      emptyLabelText: "Unknown",
    },
    {
      label: "ui.panel-player.setup.sexTargetProp",
      optionFromValue: true,
    }
  );
  if (PLAYER.sexTarget) {
    sexTargetSelect.value = PLAYER.sexTarget;
  }

  // Save button
  const saveBtn = document.createElement("button");
  saveBtn.className = "btn";
  saveBtn.setAttribute("data-panel-show", "player-overview");
  saveBtn.setAttribute("data-panel-hide", "player-setup");
  setI18n(saveBtn, "ui.panel-player.setup.button.save");

  saveBtn.addEventListener("click", () => {
    const nameVal = nameInput.value.trim();
    const ageVal = parseInt(ageInput.value, 10);
    const sexVal = sexSelect.value;
    const sexTargetVal = sexTargetSelect.value;

    PLAYER.name = nameVal || null;
    PLAYER.age = Number.isFinite(ageVal) && ageVal > 0 ? ageVal : null;
    PLAYER.sex = sexVal || null;
    PLAYER.sexTarget = sexTargetVal || null;
  });

  // Velden + button toevoegen
  rootSetup.append(nameWrap, ageWrap, sexWrap, sexTargetWrap, saveBtn);
}
