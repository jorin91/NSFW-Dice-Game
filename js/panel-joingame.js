// js/panel-joingame.js
import { setI18n } from "./lang_i18n.js";
import { listGames } from "./firebase/firebase-game.js";

export function setupPanelJoinGame() {
  const joinButton = document.getElementById("panel-mainmenu.button.joinGame");
  if (joinButton) {
    joinButton.addEventListener("click", async (e) => {
      buildGameListElement();
    });
  }
}

async function buildGameListElement() {
  const body = document.getElementById("panel-joingame.body");
  if (!body) return;

  body.innerHTML = "";

  const gameIDList = await listGames();
  for (const gameID of gameIDList) {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.setAttribute("data-game-id", gameID);
    setI18n(btn, "ui.panel-joingame.body.button.gameID", { gameID: gameID }, "text");
    btn.addEventListener("click", gameButtonClick);
    body.appendChild(btn);
  }
}

function gameButtonClick(e) {
  const gameID = e.currentTarget.getAttribute("data-game-id");
}
