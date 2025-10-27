import { gameSaveState } from "./gamestate.js";
import { getSexIcon, makeInputField, makeSelectField } from "./utils.js";

// Players
export function UpdatePlayersUI(targetId = "newgame-players") {
  const root = document.getElementById(targetId);
  if (!root) return;

  const players = Array.isArray(window.GAME?.players)
    ? window.GAME.players
    : [];
  root.innerHTML = "";
  root.classList.add("row");

  const frag = document.createDocumentFragment();

  players.forEach((p, index) => {
    // Bubble
    const bubble = document.createElement("div");
    bubble.className = "bubble row";

    // Sub-row: naam + icoon dicht bij elkaar
    const nameGroup = document.createElement("div");
    nameGroup.className = "row small";

    // Naam
    const nameSpan = document.createElement("span");
    nameSpan.textContent = p?.name || `Player ${index + 1}`;

    // Leeftijd
    const ageSpan = document.createElement("span");
    ageSpan.textContent = `(${p?.age})` || "";

    // Geslachticoon
    const sexIcon = document.createElement("span");
    sexIcon.className = "player-sex";
    sexIcon.textContent = getSexIcon(p?.sex);

    nameGroup.appendChild(nameSpan);
    nameGroup.appendChild(ageSpan);
    nameGroup.appendChild(sexIcon);

    // Verwijder-knop
    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.className = "bubble-x";
    btnRemove.setAttribute("aria-label", "Remove");
    btnRemove.textContent = "×";
    btnRemove.addEventListener("click", (e) => {
      e.stopPropagation();
      removePlayerAt(index, targetId);
    });

    bubble.appendChild(nameGroup);
    bubble.appendChild(btnRemove);
    frag.appendChild(bubble);
  });

  // Add Player bubble (laat functionaliteit later invullen)
  const add = document.createElement("button");
  add.type = "button";
  add.className = "bubble";
  add.setAttribute("data-i18n-auto", "button.addplayer");
  add.setAttribute("data-panel", "newplayer");
  add.addEventListener("click", () => {
    const rootNewPlayer = document.getElementById("add-newplayer");
    if (!rootNewPlayer) return;

    rootNewPlayer.innerHTML = "";

    // Bouw het formulier
    const form = document.createElement("form");
    form.className = "col gap-md";

    // Name
    form.appendChild(makeInputField("name", "text", "name", "Naam"));

    // Age
    form.appendChild(makeInputField("age", "number", "age", "Leeftijd", 18));

    // Sex (geslacht)
    form.appendChild(
      makeSelectField("sex", "Geslacht", Object.entries(SEX_ENUM))
    );

    // PreferSex (voorkeur)
    form.appendChild(
      makeSelectField("preferSex", "Voorkeur", Object.entries(SEX_ENUM))
    );

    // Consent (instemming)
    const consentWrap = document.createElement("label");
    consentWrap.className = "row small";
    const cbConsent = document.createElement("input");
    cbConsent.type = "checkbox";
    cbConsent.name = "consent";
    const lblConsent = document.createElement("span");
    lblConsent.textContent = "consent";
    consentWrap.append(cbConsent, lblConsent);
    form.appendChild(consentWrap);

    // Submit-knop
    const btnSave = document.createElement("button");
    btnSave.type = "submit";
    btnSave.className = "bubble";
    btnSave.textContent = "Add Player";

    form.appendChild(btnSave);
    rootNewPlayer.appendChild(form);

    // Form behaviour
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const player = {
        id: Date.now(),
        name: data.get("name") || "Unknown",
        age: parseInt(data.get("age")) || 18,
        sex: data.get("sex") || SEX_ENUM.Male,
        preferSex: data.get("preferSex") || SEX_ENUM.Both,
        consent: !!data.get("consent"),
        score: 0,
        safe: false,
        clothing: null,
      };

      // Voeg toe aan game state
      if (!Array.isArray(window.GAME.players)) window.GAME.players = [];
      window.GAME.players.push(player);

      gameSaveState();

      // Vernieuw de lijst met spelers
      UpdatePlayersUI();
    });
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
