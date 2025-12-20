// js/panel-newgame.js
import { setI18n } from "./lang_i18n.js";
import {
  makeInputField,
  makeSelectField,
  makePanel,
  getPanel,
} from "./elementHelpers.js";
import { SEXSELF_ENUM, SEXTARGET_ENUM } from "./enums.js";
import { getSettingsModel } from "./settings.js";
import { GAMESTATE } from "./gamestate.js";
import { randomNumberString } from "./utils.js";
import { createGame } from "./firebase/firebase-game.js";
import { PLAYER } from "./player.js";
import { getTaskModel } from "./task.js";
import { setupPanelGame } from "./panel-game.js";
import { getClothesModel } from "./clothing.js";

// First step of new game: Player setup
export function setupPanelNewGame_Player(id = "new-game-player") {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, false);

  // Build header
  panel.header.innerHTML = "";

  const h2Header = document.createElement("h2");
  setI18n(h2Header, "ui.panel-new-game-player.header");
  panel.header.appendChild(h2Header);

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
      label: "ui.panel-new-game-player.nameProp",
      // eventueel: placeholder: "ui.panel-player-setup.namePlaceholder"
    }
  );

  nameInput.addEventListener("input", () => {
    const nameVal = nameInput.value.trim();
    PLAYER.name = nameVal || null;
    updatePlayerDataWarning();
  });

  // Leeftijd
  const { wrap: ageWrap, input: ageInput } = makeInputField(
    "player_age",
    "number",
    {
      defaultValue: PLAYER.age || "",
      attrs: { min: 0 },
    },
    {
      label: "ui.panel-new-game-player.ageProp",
    }
  );

  ageInput.addEventListener("input", () => {
    const ageVal = parseInt(ageInput.value, 10);
    PLAYER.age = Number.isFinite(ageVal) && ageVal > 0 ? ageVal : null;
    updatePlayerDataWarning();
  });

  // Geslacht (self)
  const { wrap: sexWrap, select: sexSelect } = makeSelectField(
    "player_sex",
    {
      entries: Object.entries(SEXSELF_ENUM),
      includeEmptyOption: true,
      emptyLabelText: "Unknown",
    },
    {
      label: "ui.panel-new-game-player.sexProp",
      optionFromValue: true, // enums zijn al i18n-keys
    }
  );
  if (PLAYER.sex) {
    sexSelect.value = PLAYER.sex;
  }

  sexSelect.addEventListener("change", () => {
    const sexVal = sexSelect.value;
    PLAYER.sex = sexVal || null;
    updatePlayerDataWarning();
  });

  // Geslachtsvoorkeur (target)
  const { wrap: sexTargetWrap, select: sexTargetSelect } = makeSelectField(
    "player_sexTarget",
    {
      entries: Object.entries(SEXTARGET_ENUM),
      includeEmptyOption: true,
      emptyLabelText: "Unknown",
    },
    {
      label: "ui.panel-new-game-player.sexTargetProp",
      optionFromValue: true,
    }
  );
  if (PLAYER.sexTarget) {
    sexTargetSelect.value = PLAYER.sexTarget;
  }

  sexTargetSelect.addEventListener("change", () => {
    const sexTargetVal = sexTargetSelect.value;
    PLAYER.sexTarget = sexTargetVal || null;
    updatePlayerDataWarning();
  });

  // Add fields to body
  panel.body.append(nameWrap, ageWrap, sexWrap, sexTargetWrap);

  // Build footer
  panel.footer.innerHTML = "";

  // Buttons
  const buttonRow = document.createElement("div");
  buttonRow.className = "row";

  const mainMenuButton = document.createElement("button");
  mainMenuButton.id = `${panel.panelID}.button.main-menu`;
  mainMenuButton.className = "btn";
  mainMenuButton.setAttribute("data-panel-show", "panel-main-menu");
  mainMenuButton.setAttribute("data-panel-hide", "*");
  setI18n(mainMenuButton, "ui.panel-new-game.button.main-menu");

  const nextButton = document.createElement("button");
  nextButton.id = `${panel.panelID}.button.next`;
  nextButton.className = "btn";
  nextButton.setAttribute("data-panel-show", "");
  nextButton.setAttribute("data-panel-hide", "");
  setI18n(nextButton, "ui.panel-new-game.button.next");

  buttonRow.append(mainMenuButton, nextButton);
  panel.footer.appendChild(buttonRow);

  // Local function for incomplete player data warning
  const warningID = `${panel.panelID}_player-no-data-warning`;
  updatePlayerDataWarning(); // initial call

  function updatePlayerDataWarning() {
    // zoek binnen footer, niet globaal
    let warning = panel.footer.querySelector(`#${warningID}`);

    const missing =
      !PLAYER.name ||
      !PLAYER.age ||
      PLAYER.age <= 0 ||
      !PLAYER.sex ||
      !PLAYER.sexTarget;

    if (missing) {
      // Disable next button
      nextButton.setAttribute("data-panel-show", "");
      nextButton.setAttribute("data-panel-hide", "");
      nextButton.classList.add("ghost");

      if (!warning) {
        warning = document.createElement("span");
        warning.className = "footer error";
        warning.id = warningID;
        setI18n(warning, "ui.panel-new-game-player.missingPlayerData");
        panel.footer.appendChild(warning);
      }
    } else if (!missing) {
      // Enable next button
      nextButton.setAttribute("data-panel-show", "panel-new-game-clothes");
      nextButton.setAttribute("data-panel-hide", `${panel.panelID}`);
      nextButton.classList.remove("ghost");

      if (warning) {
        warning.remove();
      }
    }
  }
}

export function setupPanelNewGame_Clothes(id = "new-game-clothes") {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, false);

  // Build header
  panel.header.innerHTML = "";

  const h2Header = document.createElement("h2");
  setI18n(h2Header, "ui.panel-new-game-clothes.header");
  panel.header.appendChild(h2Header);

  // Build body
  panel.body.innerHTML = "";

  const defClothes = getClothesModel();

  for (const clothingKey of Object.keys(defClothes)) {
    const clothingItem = defClothes[clothingKey];
    PLAYER.game.clothing[clothingKey] = clothingItem;

    // Element
    const container = document.createElement("div");
    container.className = "row setting";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = clothingItem.enabled;

    const label = document.createElement("label");
    setI18n(label, clothingItem.name);

    const description = document.createElement("span");
    setI18n(description, clothingItem.desc);

    container.append(checkbox, label, description);

    // Event
    container.addEventListener("click", (e) => {
      if (e.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event("change"));
      }
    });

    checkbox.addEventListener("change", () => {
      clothingItem.enabled = checkbox.checked;
      PLAYER.game.clothing[clothingKey] = clothingItem;
    });

    panel.body.appendChild(container);
  }

  // Build footer
  panel.footer.innerHTML = "";

  // Buttons
  const buttonRow = document.createElement("div");
  buttonRow.className = "row";

  const mainMenuButton = document.createElement("button");
  mainMenuButton.id = `${panel.panelID}.button.main-menu`;
  mainMenuButton.className = "btn";
  mainMenuButton.setAttribute("data-panel-show", "panel-main-menu");
  mainMenuButton.setAttribute("data-panel-hide", "*");
  setI18n(mainMenuButton, "ui.panel-new-game.button.main-menu");

  const backButton = document.createElement("button");
  backButton.id = `${panel.panelID}.button.back`;
  backButton.className = "btn";
  backButton.setAttribute("data-panel-show", "panel-new-game-player");
  backButton.setAttribute("data-panel-hide", `${panel.panelID}`);
  setI18n(backButton, "ui.panel-new-game.button.back");

  const nextButton = document.createElement("button");
  nextButton.id = `${panel.panelID}.button.next`;
  nextButton.className = "btn";
  nextButton.setAttribute("data-panel-show", "panel-new-game-settings");
  nextButton.setAttribute("data-panel-hide", "panel-new-game-clothes");
  setI18n(nextButton, "ui.panel-new-game.button.next");

  buttonRow.append(mainMenuButton, backButton, nextButton);
  panel.footer.appendChild(buttonRow);
}

export async function setupPanelNewGame_Settings(id = "new-game-settings") {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, false);

  // Build header
  panel.header.innerHTML = "";

  const h2Header = document.createElement("h2");
  setI18n(h2Header, "ui.panel-new-game-settings.header");
  panel.header.appendChild(h2Header);

  // Build body
  panel.body.innerHTML = "";

  const settings = getSettingsModel();
  const tasks = await getTaskModel();

  // Settings container
  const settingsContainer = document.createElement("div");
  settingsContainer.id = `${panel.footer.panelID}.settingsContainer`;
  settingsContainer.className = "col";
  panel.body.appendChild(settingsContainer);

  // Get settings used in tasks, to only show relevant settings
  const taskKeys = new Set();
  for (const categoryKey of Object.keys(tasks)) {
    const category = tasks[categoryKey];
    // Lets get all sub-keys as well
    if (
      !category.tasks ||
      !Array.isArray(category.tasks) ||
      category.tasks.length === 0
    )
      continue;
    taskKeys.add(category.value); // At this point we know the category is used and has tasks, add it as well.
    const categoryTasks = category.tasks;
    for (const task of categoryTasks) {
      if (!task.conditions) continue;
      const conditions = task.conditions;
      for (const conditionKey of Object.keys(conditions)) {
        const condition = conditions[conditionKey];
        if (!Array.isArray(condition) || condition.length === 0) continue;
        for (const key of condition) {
          taskKeys.add(key);
        }
      }
    }
  }

  // Create setting elements
  for (const key of Object.keys(settings)) {
    const setting = settings[key];
    const settingElement = createSettingElement(key, setting, taskKeys);
    if (settingElement) settingsContainer.appendChild(settingElement);
  }

  // Build footer
  panel.footer.innerHTML = "";

  // Buttons
  const buttonRow = document.createElement("div");
  buttonRow.className = "row";

  const mainMenuButton = document.createElement("button");
  mainMenuButton.id = `${panel.panelID}.button.main-menu`;
  mainMenuButton.className = "btn";
  mainMenuButton.setAttribute("data-panel-show", "panel-main-menu");
  mainMenuButton.setAttribute("data-panel-hide", "*");
  setI18n(mainMenuButton, "ui.panel-new-game.button.main-menu");

  const backButton = document.createElement("button");
  backButton.id = `${panel.panelID}.button.back`;
  backButton.className = "btn";
  backButton.setAttribute("data-panel-show", "panel-new-game-player");
  backButton.setAttribute("data-panel-hide", `${panel.panelID}`);
  setI18n(backButton, "ui.panel-new-game.button.back");

  const nextButton = document.createElement("button");
  nextButton.id = `${panel.panelID}.button.create`;
  nextButton.className = "btn";
  nextButton.setAttribute("data-panel-show", "");
  nextButton.setAttribute("data-panel-hide", `${panel.panelID}`);
  setI18n(nextButton, "ui.panel-new-game.button.create");

  const createClickHandler = handleClickCreateGame.bind(null, settings);
  nextButton.addEventListener("click", createClickHandler);

  buttonRow.append(mainMenuButton, backButton, nextButton);
  panel.footer.appendChild(buttonRow);
}

function createSettingElement(key, setting, taskKeys) {
  const container = document.createElement("div");
  container.className = "col small";
  container.id = `setting-${key}`;

  if (setting.i18nTitle) {
    const header = document.createElement("h4");
    setI18n(header, setting.i18nTitle);
    container.appendChild(header);
  }

  if (setting.i18nDesc) {
    const desc = document.createElement("p");
    setI18n(desc, setting.i18nDesc);
    container.appendChild(desc);
  }

  // Propertie to check if we added settings
  let hasSettings = false;

  // Create input for each sub-setting
  for (const subKey of Object.keys(setting)) {
    if (subKey === "i18nTitle" || subKey === "i18nDesc") continue;
    const subSetting = setting[subKey];

    const subSettingContainer = document.createElement("div");
    subSettingContainer.className = "row setting";

    // === BOOLEAN ===
    if (typeof subSetting === "boolean") {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = subSetting;

      checkbox.addEventListener("change", () => {
        setting[subKey] = checkbox.checked;
      });

      // hele row klikbaar
      subSettingContainer.addEventListener("click", (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        }
      });

      const label = document.createElement("label");
      setI18n(label, `${setting.i18nTitle}.${subKey}`);

      const description = document.createElement("span");
      setI18n(description, `${setting.i18nTitle}.${subKey}.desc`);

      subSettingContainer.append(checkbox, label, description);
    }

    // === ENUM / OBJECT ===
    else if (subSetting && typeof subSetting === "object") {
      // Check for taskKeys. If setting is not used in any task, skip it.
      if (taskKeys.size === 0 || !taskKeys.has(subSetting.value)) {
        continue;
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = subSetting.enabled;

      checkbox.addEventListener("change", () => {
        subSetting.enabled = checkbox.checked;
      });

      subSettingContainer.addEventListener("click", (e) => {
        if (e.target !== checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        }
      });

      const label = document.createElement("label");
      setI18n(label, subSetting.value);

      const description = document.createElement("span");
      setI18n(description, `${subSetting.value}.desc`);

      subSettingContainer.append(checkbox, label, description);
    }

    // === NUMBER ===
    else if (typeof subSetting === "number") {
      const input = document.createElement("input");
      input.type = "number";
      input.min = "1";
      input.step = "1";
      input.value = subSetting;

      input.addEventListener("change", () => {
        setting[subKey] = parseInt(input.value, 10);
      });

      subSettingContainer.appendChild(input);
    }

    container.appendChild(subSettingContainer);
    hasSettings = true;
  }

  if (!hasSettings) return null;
  return container;
}

async function handleClickCreateGame(settings, e) {
  // Check for complete player profile
  if (
    !PLAYER.name ||
    !PLAYER.age ||
    PLAYER.age <= 0 ||
    !PLAYER.sex ||
    !PLAYER.sexTarget
  ) {
    return;
  }

  const footer = document.getElementById("panel-newgame.footer");
  const status = document.getElementById("panel-newgame.footer.status");
  if (status) {
    status.remove();
  }

  PLAYER.game.consent = true;

  GAMESTATE.gameID = randomNumberString(8);
  GAMESTATE.gameCode = randomNumberString(4);
  GAMESTATE.settings = settings;
  GAMESTATE.tasks = await getTaskModel();
  GAMESTATE.players = [PLAYER];
  const result = await createGame();

  if (result.message && footer) {
    const message = document.createElement("div");
    message.id = "panel-newgame.footer.status";
    setI18n(message, result.message);
    footer.appendChild(message);
  }

  if (!result.success) {
    return;
  }

  setupPanelGame();
}
