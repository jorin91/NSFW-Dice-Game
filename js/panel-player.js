import { PLAYER, onPlayerChange } from "./player.js";
import { setI18n } from "./lang_i18n.js";
import { SEXSELF_ENUM, SEXTARGET_ENUM } from "./enums.js";
import {
  makeInputField,
  makeSelectField,
  makePanel,
  getPanel,
} from "./elementHelpers.js";

const unsubscribe = onPlayerChange(() => {
  // setupPanelPlayerOverview();
  // setupPanelPlayerSetup();
});

export function setupPanelPlayerOverview(id = "player-overview") {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, true);

  // Build header
  panel.header.innerHTML = "";

  const h4Header = document.createElement("h4");
  setI18n(h4Header, "ui.panel-player-overview.header");
  panel.header.appendChild(h4Header);

  // Build body
  panel.body.innerHTML = "";

  // Name
  const nameEl = document.createElement("div");
  nameEl.className = "row small";
  const nameProp = document.createElement("span");
  setI18n(nameProp, "ui.panel-player-overview.nameProp");
  const nameVal = document.createElement("span");
  nameVal.textContent = PLAYER.name ?? "Unknown";
  nameEl.append(nameProp, nameVal);

  // Age
  const ageEl = document.createElement("div");
  ageEl.className = "row small";
  const ageProp = document.createElement("span");
  setI18n(ageProp, "ui.panel-player-overview.ageProp");
  const ageVal = document.createElement("span");
  ageVal.textContent = PLAYER.age ?? "Unknown";
  ageEl.append(ageProp, ageVal);

  // Sex
  const sexEl = document.createElement("div");
  sexEl.className = "row small";
  const sexProp = document.createElement("span");
  setI18n(sexProp, "ui.panel-player-overview.sexProp");
  const sexVal = document.createElement("span");
  if (PLAYER.sex) {
    setI18n(sexVal, PLAYER.sex);
  } else {
    sexVal.textContent = "Unknown";
  }
  sexEl.append(sexProp, sexVal);

  // Prefered Target Sex
  const sexTargetEl = document.createElement("div");
  sexTargetEl.className = "row small";
  const sexTargetProp = document.createElement("span");
  setI18n(sexTargetProp, "ui.panel-player-overview.sexTargetProp");
  const sexTargetVal = document.createElement("span");
  if (PLAYER.sexTarget) {
    setI18n(sexTargetVal, PLAYER.sexTarget);
  } else {
    sexTargetVal.textContent = "Unknown";
  }
  sexTargetEl.append(sexTargetProp, sexTargetVal);

  // Build Player Row
  const playerRow = document.createElement("div");
  playerRow.className = "row equal";
  playerRow.append(nameEl, ageEl, sexEl, sexTargetEl);
  panel.body.appendChild(playerRow);

  // Build footer
  panel.footer.innerHTML = "";

  const buttonRow = document.createElement("div");
  buttonRow.className = "row";

  const editBtn = document.createElement("button");
  editBtn.className = "btn";
  editBtn.id = `${panel.panelID}.button.edit`;
  editBtn.setAttribute("data-panel-open", "panel-player-setup");
  editBtn.setAttribute("data-panel-close", panel.panelID);
  setI18n(editBtn, "ui.panel-player-overview.button.edit");

  buttonRow.appendChild(editBtn);
  panel.footer.appendChild(buttonRow);

  // Check for complete player profile
  const warningID = `${panel.panelID}.player-no-data-warning`;
  let warning = panel.footer.querySelector(`#${warningID}`);

  if (
    (!PLAYER.name ||
      !PLAYER.age ||
      PLAYER.age <= 0 ||
      !PLAYER.sex ||
      !PLAYER.sexTarget) &&
    !warning
  ) {
    warning = document.createElement("span");
    warning.className = "footer error";
    warning.id = warningID;
    setI18n(warning, "ui.panel-player-overview.missingPlayerData");
    panel.footer.appendChild(warning);
  } else if (warning) {
    warning.remove();
  }
}

export function setupPanelPlayerSetup(id = "player-setup") {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, false);

  // Build header
  panel.header.innerHTML = "";

  const h4Header = document.createElement("h4");
  setI18n(h4Header, "ui.panel-player-setup.header");
  panel.header.appendChild(h4Header);

  // Build body
  panel.body.innerHTML = "";

  // Naam
  const { wrap: nameWrap, input: nameInput } = makeInputField(
    "player_name",
    "text",
    {
      defaultValue: PLAYER.name || "",
    },
    {
      label: "ui.panel-player-setup.nameProp",
      // eventueel: placeholder: "ui.panel-player-setup.namePlaceholder"
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
      label: "ui.panel-player-setup.ageProp",
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
      label: "ui.panel-player-setup.sexProp",
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
      label: "ui.panel-player-setup.sexTargetProp",
      optionFromValue: true,
    }
  );
  if (PLAYER.sexTarget) {
    sexTargetSelect.value = PLAYER.sexTarget;
  }

  // Add fields to body
  panel.body.append(nameWrap, ageWrap, sexWrap, sexTargetWrap);

  // Build footer
  panel.footer.innerHTML = "";

  // Save button
  const buttonRow = document.createElement("div");
  buttonRow.className = "row";

  const saveBtn = document.createElement("button");
  saveBtn.className = "btn";
  saveBtn.id = `${panel.panelID}.button.save`;
  saveBtn.setAttribute("data-panel-open", "panel-player-overview");
  saveBtn.setAttribute("data-panel-close", panel.panelID);
  setI18n(saveBtn, "ui.panel-player-setup.button.save");

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

  buttonRow.appendChild(saveBtn);
  panel.footer.appendChild(buttonRow);
}
