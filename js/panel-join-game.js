// js/panel-joingame.js
import { setI18n } from "./lang_i18n.js";
import { listGames } from "./firebase/firebase-game.js";
import { makeInputField, getPanel, makePanel } from "./elementHelpers.js";

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
    setI18n(
      btn,
      "ui.panel-join-game.button.game",
      { gameID: game.gameID, gameName: game.gameName },
      "text"
    );
    // btn.addEventListener("click", gameButtonClick);
    rowEl.appendChild(btn);
    count++;
  }

  // Build footer
  panel.footer.innerHTML = "";
}

function gameButtonClick(e) {
  const gameID = e.currentTarget.getAttribute("data-game-id");

  let bodyCode = document.getElementById("panel-joingame.body.code");
  if (bodyCode) {
    bodyCode.innerHTML = "";
  } else {
    const body = document.getElementById("panel-joingame.body");
    if (!body) return;

    const parent = body.parentElement;

    bodyCode = document.createElement("div");
    bodyCode.id = "panel-joingame.body.code";
    bodyCode.className = "row centerWrap centerContent";
    parent.insertBefore(bodyCode, body.nextSibling);
  }

  const inputField = makeInputField(
    "gamecode",
    "text",
    {},
    { label: "ui.panel-joingame.body.code.label", labelArgs: { gameID } }
  );
  inputField.wrap.className = "row";
  bodyCode.appendChild(inputField.wrap);
}

function codeConfirmClick(e) {}
