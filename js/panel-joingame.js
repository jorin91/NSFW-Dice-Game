// js/panel-joingame.js
import { setI18n } from "./lang_i18n.js";
import { listGames } from "./firebase/firebase-game.js";
import { makeInputField } from "./elementHelpers.js";

export function setupPanelJoinGame() {
  const joinButton = document.getElementById("panel-mainmenu.button.joinGame");
  if (joinButton) {
    joinButton.addEventListener("click", async (e) => {
      buildGameListElement();
    });
  }
}

async function buildGameListElement(perRow = 6) {
  const body = document.getElementById("panel-joingame.body");
  if (!body) return;

  body.innerHTML = "";

  const gameIDList = await listGames();

  let rowEl = null;
  let count = 0;

  for (const gameID of gameIDList) {
    // Nieuwe row starten wanneer nodig
    if (count % perRow === 0) {
      rowEl = document.createElement("div");
      rowEl.className = "row centerWrap centerContent";
      body.appendChild(rowEl);
    }

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.setAttribute("data-game-id", gameID);
    setI18n(
      btn,
      "ui.panel-joingame.body.button.gameID",
      { gameID: gameID },
      "text"
    );
    btn.addEventListener("click", gameButtonClick);
    rowEl.appendChild(btn);
    count++;
  }
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
  bodyCode.appendChild(inputField.wrap);
}
