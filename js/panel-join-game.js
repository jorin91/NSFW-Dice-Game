// js/panel-joingame.js
import { setI18n } from "./lang_i18n.js";
import { listGames, gameCodeMatches } from "./firebase/firebase-game.js";
import { makeInputField, getPanel, makePanel } from "./elementHelpers.js";
import { joinGame } from "./panel-game.js";

export async function setupPanelJoinGame(id = "join-game", perRow = 6) {
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
      const buttonContainer = document.getElementById("panel-join-game.footer.buttons");
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

      confirmBtn.addEventListener("click", () => {
        const gameCode = inputField.input.value;
        if (gameCodeMatches(gameID, gameCode)) {
          // Proceed to join game
          joinGame(gameCode, gameID);
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
