import { gameSaveState } from "./gamestate.js";

// Players
export function UpdatePlayersUI(targetId = "newgame-players") {
  const root = document.getElementById(targetId);
  if (!root) return;

  const players = Array.isArray(window.GAME?.players) ? window.GAME.players : [];
  root.innerHTML = "";

  // Zorg dat de container de bubbles laat wrappen
  root.classList.add("row"); // jouw .row heeft flex + wrap

  const frag = document.createDocumentFragment();

  players.forEach((p, index) => {
    // Bubble
    const bubble = document.createElement("div");
    bubble.className = "bubble"; // jouw bestaande stijl

    // Inhoud links (naam of fallback)
    const nameSpan = document.createElement("span");
    nameSpan.textContent = p?.name || `Player ${index + 1}`;

    // Spacer zodat de X rechts komt
    const spacer = document.createElement("span");
    spacer.className = "grow";

    // Verwijder-knop
    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.className = "bubble-remove";
    btnRemove.setAttribute("aria-label", "Remove");
    btnRemove.textContent = "×";
    btnRemove.addEventListener("click", (e) => {
      e.stopPropagation();
      removePlayerAt(index, targetId);
    });

    bubble.appendChild(nameSpan);
    bubble.appendChild(spacer);
    bubble.appendChild(btnRemove);

    frag.appendChild(bubble);
  });

  // Add Player bubble (laat functionaliteit later invullen)
  const add = document.createElement("button");
  add.type = "button";
  add.className = "bubble bubble-add";
  add.textContent = "+ Add Player"; // evt. data-i18n-auto meegeven
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
