// js/panel-joingame.js
import { setI18n } from "./lang_i18n.js";
import { listGames, gameCodeMatches } from "./firebase/firebase-game.js";
import { makeInputField, getPanel, makePanel } from "./elementHelpers.js";
import { joinGame } from "./panel-game.js";
import { toast } from "./toast.js";
import { switchPanel } from "./panelnavigation.js";
import { PLAYER } from "./player.js";

export async function setupPanelJoinGame(id = "join-game", perRow = 6) {
  // Check player data first
  const missing =
    !PLAYER.name ||
    !PLAYER.age ||
    PLAYER.age <= 0 ||
    !PLAYER.sex ||
    !PLAYER.sexTarget;

  if (missing) {
    switchPanel("*", "join-game-player");
    return;
  }

  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, false);

  // Build header
  panel.header.innerHTML = "";

  const h2Header = document.createElement("h2");
  setI18n(h2Header, "ui.panel-join-game.header");
  panel.header.appendChild(h2Header);

  // Build body
  panel.body.innerHTML = "";

  const gameIDList = await listGames();
  let rowEl = null;
  let count = 0;

  for (const game of gameIDList) {
    // New row when needed
    if (count % perRow === 0) {
      rowEl = document.createElement("div");
      rowEl.className = "row centerWrap centerContent";
      panel.body.appendChild(rowEl);
    }

    const btn = document.createElement("button");
    btn.className = "btn game";
    btn.setAttribute("data-game-id", game.gameID);
    btn.setAttribute("data-game-name", game.gameName);
    btn.textContent = `${game.gameName} (${game.gameID})`;
    rowEl.appendChild(btn);

    btn.addEventListener("click", () => {
      const buttonContainer = document.getElementById(
        "panel-join-game.footer.buttons"
      );
      if (!buttonContainer) return;

      buttonContainer.innerHTML = "";
      const gameID = btn.getAttribute("data-game-id");

      const inputField = makeInputField(
        "gamecode",
        "text",
        {},
        { label: "ui.panel-join-game.code.label", labelArgs: { gameID } }
      );

      buttonContainer.appendChild(inputField.wrap);

      const confirmBtn = document.createElement("button");
      setI18n(confirmBtn, "ui.panel-join-game.code.confirm-button");
      confirmBtn.className = "btn";

      confirmBtn.addEventListener("click", async () => {
        const gameCode = inputField.input.value;
        if (gameCode && (await gameCodeMatches(gameID, gameCode))) {
          // Proceed to join game
          joinGame(gameCode, gameID);
        } else {
          // Show error (could use toast or similar)
          toast("{ui.panel-join-game.error.wrongCode}", true);
        }
      });

      buttonContainer.appendChild(confirmBtn);
    });

    count++;
  }

  // Build footer
  panel.footer.innerHTML = "";
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "row";
  buttonContainer.id = "panel-join-game.footer.buttons";
  panel.footer.appendChild(buttonContainer);
}

export function setupPanelJoinGame_Player(id = "join-game-player") {
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
    updatePlayerDataWarning(true);
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
    updatePlayerDataWarning(true);
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
    updatePlayerDataWarning(true);
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
    updatePlayerDataWarning(true);
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
  setI18n(mainMenuButton, "ui.panel-join-game.button.return");

  const nextButton = document.createElement("button");
  nextButton.id = `${panel.panelID}.button.next`;
  nextButton.className = "btn";
  setI18n(nextButton, "ui.panel-join-game.button.next");

  nextButton.addEventListener("click", async (e) => {
    if (updatePlayerDataWarning()) {
      switchPanel("*", "join-game");
    }
  });

  buttonRow.append(mainMenuButton, nextButton);
  panel.footer.appendChild(buttonRow);

  // Local function for incomplete player data warning
  updatePlayerDataWarning(true); // initial call

  function updatePlayerDataWarning(initial = false) {
    const missing =
      !PLAYER.name ||
      !PLAYER.age ||
      PLAYER.age <= 0 ||
      !PLAYER.sex ||
      !PLAYER.sexTarget;

    if (missing) {
      // Disable next button
      nextButton.disabled = true;

      if (!initial) {
        toast("{ui.panel-new-game-player.missingPlayerData}", true);
      }
    } else if (!missing) {
      // Enable next button
      nextButton.disabled = false;
    }

    return !missing;
  }
}
