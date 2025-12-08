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
}
