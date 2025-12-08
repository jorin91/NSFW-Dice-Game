// js/panel-joingame.js

export function setupPanelJoinGame() {
  const joinButton = document.getElementById("panel-mainmenu.button.joinGame");
  if (joinButton) {
    joinButton.addEventListener("click", (e) => {
        buildGameListElement();
    });
  }
}

function buildGameListElement() {
  const body = document.getElementById("panel-joingame.body");
  if (!body) return;


}