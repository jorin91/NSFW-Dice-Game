import { gameSaveState } from "./gamestate.js";
import { getSexIcon, makeInputField, makeSelectField } from "./utils.js";
import { SEX_ENUM } from "./enums.js";
import { createPlayer } from "./player.js";
import { switchPanel } from "./panelnavigation.js";

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
    form.noValidate = true;

    // Name
    const { wrap: nameWrap, input: nameInput } = makeInputField(
      "name",
      "text",
      "name",
      "Naam"
    );

    // Age (minimaal 18 als zachte regel)
    const { wrap: ageWrap, input: ageInput } = makeInputField(
      "age",
      "number",
      "age",
      "Leeftijd",
      18
    );
    // ageInput.min = "18";

    // Sex
    const { wrap: sexWrap, select: sexSelect } = makeSelectField(
      "sex",
      "Geslacht",
      Object.entries(SEX_ENUM)
    );

    // PreferSex
    const { wrap: prefWrap, select: prefSelect } = makeSelectField(
      "preferSex",
      "Voorkeur",
      Object.entries(SEX_ENUM)
    );

    // Consent
    const consentWrap = document.createElement("label");
    consentWrap.className = "row small";
    const cbConsent = document.createElement("input");
    cbConsent.type = "checkbox";
    cbConsent.name = "consent";
    const lblConsent = document.createElement("span");
    lblConsent.textContent = "consent";
    consentWrap.append(cbConsent, lblConsent);

    // Actieknoppen
    const actions = document.createElement("div");
    actions.className = "row small";

    const btnCancel = document.createElement("button");
    btnCancel.type = "button";
    btnCancel.className = "bubble";
    btnCancel.textContent = "Cancel";
    btnCancel.setAttribute("data-panel", "newgame");
    btnCancel.addEventListener("click", () => {
      rootNewPlayer.innerHTML = ""; // formulier weg
      // (optioneel) UpdatePlayersUI(); // lijst tonen/refreshen
    });

    const btnSave = document.createElement("button");
    btnSave.type = "submit";
    btnSave.className = "bubble";
    btnSave.textContent = "Add Player";

    actions.append(btnCancel, btnSave);

    // Opbouwen
    form.append(nameWrap, ageWrap, sexWrap, prefWrap, consentWrap, actions);
    rootNewPlayer.appendChild(form);

    // stille validatie helper
    function mark(el, ok) {
      if (!el) return true;
      el.classList.toggle("input-invalid", !ok);
      return ok;
    }

    // Form behaviour
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validatie (stil, via rode rand)
      const vName = mark(nameInput, !!nameInput.value.trim());
      const ageVal = parseInt(ageInput.value, 10);
      const vAge = mark(ageInput, Number.isFinite(ageVal) && ageVal >= 18);

      const sexVal = sexSelect.value;
      const prefVal = prefSelect.value;
      const validSex = Object.values(SEX_ENUM).includes(sexVal);
      const validPref = Object.values(SEX_ENUM).includes(prefVal);
      const vSex = mark(sexSelect, validSex);
      const vPref = mark(prefSelect, validPref);

      const vConsent = cbConsent.checked;
      // optioneel: visuele hint bij consent (bijv. rode rand om label)
      consentWrap.classList.toggle("input-invalid", !vConsent);

      const allOk = vName && vAge && vSex && vPref && vConsent;
      if (!allOk) return; // geen submit; geen meldingen

      // Alles ok → speler aanmaken
      createPlayer(
        nameInput.value.trim(),
        sexVal,
        ageVal,
        prefVal,
        !!cbConsent.checked
      );

      // UI resetten/tonen
      rootNewPlayer.innerHTML = "";
      UpdatePlayersUI();
      switchPanel("newgame");
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
