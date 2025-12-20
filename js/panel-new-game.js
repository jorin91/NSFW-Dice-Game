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
import { getClothesModel } from "./clothing.js";
import { createGame, joinGame } from "./panel-game.js";

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
      nextButton.disabled = true;

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
      nextButton.disabled = false;

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
  PLAYER.game.clothing = defClothes;

  for (const clothingKey of Object.keys(defClothes)) {
    const clothingItem = defClothes[clothingKey];

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
      // clothingItem.enabled = checkbox.checked;
      PLAYER.game.clothing[clothingKey].enabled = checkbox.checked;
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

  // Default settings values
  settings.gameID = randomNumberString(8);
  settings.gameCode = randomNumberString(4);

  // Helpers
  function container() {
    const div = document.createElement("div");
    div.className = "col small";
    return div;
  }

  // Game Name
  const gameNameContainer = container();
  const gameNameHeader = document.createElement("h4");
  setI18n(gameNameHeader, "ui.settings.gameName");
  const gameNameInput = makeInputField(
    "settings_gameName",
    "text",
    {
      defaultValue: settings.gameName,
    },
    {
      label: "ui.settings.gameName.desc",
      defaultValue: "ui.settings.gameName.placeholder",
      defaultValueArgs: { ID: settings.gameID },
    }
  );
  gameNameInput.input.addEventListener("change", () => {
    settings.gameName = gameNameInput.input.value;
    updateIncompleteSettingsWarning();
  });
  gameNameContainer.append(gameNameHeader, gameNameInput.wrap);

  // Rolls
  const rollsContainer = container();
  const rollsHeader = document.createElement("h4");
  setI18n(rollsHeader, "ui.settings.rolls");
  const rollsInput = makeInputField(
    "settings_rolls",
    "number",
    {
      defaultValue: settings.rolls,
      attrs: { min: 1, max: 10, step: 1 },
    },
    {
      label: "ui.settings.rolls.desc",
    }
  );
  rollsInput.input.addEventListener("change", () => {
    const val = parseInt(rollsInput.input.value, 10);
    settings.rolls = Number.isFinite(val) && val > 0 ? val : 3;
    updateIncompleteSettingsWarning();
  });
  rollsContainer.append(rollsHeader, rollsInput.wrap);

  // score to win
  const pointsContainer = container();
  const pointsHeader = document.createElement("h4");
  setI18n(pointsHeader, "ui.settings.score");
  const pointsInput = makeInputField(
    "settings_score",
    "number",
    {
      defaultValue: settings.score,
      attrs: { min: 1, max: 100, step: 1 },
    },
    {
      label: "ui.settings.score.desc",
    }
  );
  pointsInput.input.addEventListener("change", () => {
    const val = parseInt(pointsInput.input.value, 10);
    settings.score = Number.isFinite(val) && val > 0 ? val : 3;
    updateIncompleteSettingsWarning();
  });
  pointsContainer.append(pointsHeader, pointsInput.wrap);

  // Amount Dices
  const dicesContainer = container();
  const dicesHeader = document.createElement("h4");
  setI18n(dicesHeader, "ui.settings.dices");
  const dicesInput = makeInputField(
    "settings_dices",
    "number",
    {
      defaultValue: settings.dices,
      attrs: { min: 1, max: 10, step: 1 },
    },
    {
      label: "ui.settings.dices.desc",
    }
  );
  dicesInput.input.addEventListener("change", () => {
    const val = parseInt(dicesInput.input.value, 10);
    settings.dices = Number.isFinite(val) && val > 0 ? val : 5;
    updateIncompleteSettingsWarning();
  });
  dicesContainer.append(dicesHeader, dicesInput.wrap);

  // Players Can Reroll
  const canRerollContainer = container();
  const canRerollHeader = document.createElement("h4");
  setI18n(canRerollHeader, "ui.settings.playersCanReroll");
  const canRerollInput = makeInputField(
    "settings_playersCanReroll",
    "checkbox",
    {
      defaultValue: settings.playersCanReroll,
    },
    {
      label: "ui.settings.playersCanReroll.desc",
    }
  );
  canRerollInput.input.addEventListener("change", () => {
    settings.playersCanReroll = canRerollInput.input.checked;
    updateIncompleteSettingsWarning();
  });
  canRerollContainer.append(canRerollHeader, canRerollInput.wrap);

  // Amount of Rerolls
  const playerRerollsContainer = container();
  const playerRerollsHeader = document.createElement("h4");
  setI18n(playerRerollsHeader, "ui.settings.playerRerolls");
  const playerRerollsInput = makeInputField(
    "settings_playerRerolls",
    "number",
    {
      defaultValue: settings.playerRerolls,
      attrs: { min: 0, max: 100, step: 1 },
    },
    {
      label: "ui.settings.playerRerolls.desc",
    }
  );
  playerRerollsInput.input.addEventListener("change", () => {
    const val = parseInt(playerRerollsInput.input.value, 10);
    settings.playerRerolls = Number.isFinite(val) && val >= 0 ? val : 3;
    updateIncompleteSettingsWarning();
  });
  playerRerollsContainer.append(playerRerollsHeader, playerRerollsInput.wrap);

  // Amount of losing players
  const loserCountContainer = container();
  const loserCountHeader = document.createElement("h4");
  setI18n(loserCountHeader, "ui.settings.loserCount");
  const loserCountInput = makeInputField(
    "settings_loserCount",
    "number",
    {
      defaultValue: settings.loserCount,
      attrs: { min: 1, max: 100, step: 1 },
    },
    {
      label: "ui.settings.loserCount.desc",
    }
  );
  loserCountInput.input.addEventListener("change", () => {
    const val = parseInt(loserCountInput.input.value, 10);
    settings.loserCount = Number.isFinite(val) && val > 0 ? val : 1;
    updateIncompleteSettingsWarning();
  });
  loserCountContainer.append(loserCountHeader, loserCountInput.wrap);

  // Append simple settings so far
  panel.body.append(
    gameNameContainer,
    rollsContainer,
    pointsContainer,
    dicesContainer,
    canRerollContainer,
    playerRerollsContainer,
    loserCountContainer
  );

  // Task related settings
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
    if (setting && typeof setting === "object") {
      const settingElement = createSettingElement(key, setting, taskKeys);
      if (settingElement) panel.body.appendChild(settingElement);
    }
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
  backButton.setAttribute("data-panel-show", "panel-new-game-clothes");
  backButton.setAttribute("data-panel-hide", `${panel.panelID}`);
  setI18n(backButton, "ui.panel-new-game.button.back");

  const nextButton = document.createElement("button");
  nextButton.id = `${panel.panelID}.button.create`;
  nextButton.className = "btn";
  setI18n(nextButton, "ui.panel-new-game.button.create");

  const createClickHandler = handleClickCreateGame.bind(null, settings);
  nextButton.addEventListener("click", createClickHandler);

  buttonRow.append(mainMenuButton, backButton, nextButton);
  panel.footer.appendChild(buttonRow);

  // Local function to check complete settings
  const warningID = `${panel.panelID}_incomplete-settings-warning`;
  updateIncompleteSettingsWarning(); // initial call

  function updateIncompleteSettingsWarning() {
    // zoek binnen footer, niet globaal
    let warning = panel.footer.querySelector(`#${warningID}`);
    const missing =
      !settings.gameName ||
      !settings.gameCode ||
      !settings.gameID ||
      !settings.rolls ||
      settings.rolls < 1 ||
      !settings.score ||
      settings.score < 1 ||
      !settings.dices ||
      settings.dices < 1 ||
      !settings.loserCount ||
      settings.loserCount < 1;

    if (missing) {
      // Disable next button
      nextButton.disabled = true;

      if (!warning) {
        warning = document.createElement("span");
        warning.className = "footer error";
        warning.id = warningID;
        setI18n(warning, "ui.panel-new-game-settings.incompleteSettings");
        panel.footer.appendChild(warning);
      }
    } else if (!missing) {
      // Enable next button
      nextButton.disabled = false;

      if (warning) {
        warning.remove();
      }
    }
  }
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

    // === ENUM / OBJECT ===
    if (subSetting && typeof subSetting === "object") {
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

    container.appendChild(subSettingContainer);
    hasSettings = true;
  }

  if (!hasSettings) return null;
  return container;
}

async function handleClickCreateGame(settings, e) {
  // Since this player creates the game, they automatically give consent
  PLAYER.game.consent = true;

  if (await createGame(settings)) {
    // Lets join game
    await joinGame(settings.gameCode, settings.gameID);
  }
}
