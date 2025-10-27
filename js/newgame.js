import { gameSaveState } from "./gamestate.js";
import { getSexIcon } from "./utils.js";

// Players
export function UpdatePlayersUI(targetId = "newgame-players") {
  const root = document.getElementById(targetId);
  if (!root) return;

  const players = Array.isArray(window.GAME?.players) ? window.GAME.players : [];
  root.innerHTML = "";
  root.classList.add("row");

  const frag = document.createDocumentFragment();

  players.forEach((p, index) => {
    // Bubble
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    // Naam
    const nameSpan = document.createElement("span");
    nameSpan.textContent = p?.name || `Player ${index + 1}`;

    // Geslachticoon
    const sexIcon = document.createElement("span");
    sexIcon.className = "player-sex";
    sexIcon.textContent = getSexIcon(p?.sex);

    // Spacer zodat de X rechts komt
    const spacer = document.createElement("span");
    spacer.className = "grow";

    // Verwijder-knop
    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.className = "btn";
    btnRemove.setAttribute("aria-label", "Remove");
    btnRemove.textContent = "×";
    btnRemove.addEventListener("click", (e) => {
      e.stopPropagation();
      removePlayerAt(index, targetId);
    });

    bubble.appendChild(nameSpan);
    bubble.appendChild(sexIcon);
    bubble.appendChild(spacer);
    bubble.appendChild(btnRemove);
    frag.appendChild(bubble);
  });

  // Add Player bubble (laat functionaliteit later invullen)
  const add = document.createElement("button");
  add.type = "button";
  add.className = "bubble";
  add.setAttribute("data-i18n-auto", "button.addplayer");
  add.addEventListener("click", () => {
    // TODO: jouw add-flow
    // document.dispatchEvent(new CustomEvent("players:add"));
  });

  frag.appendChild(add);

  root.appendChild(frag);
}

function removePlayerAt(index, targetId) {
  if (!Array.isArray(window.GAME?.players)) return;
  if (index < 0 || index >= window.GAME.players.length) return;

  window.GAME.players.splice(index, 1);
  gameSaveState();
  UpdatePlayersUI(targetId);
}
