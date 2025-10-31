import { gameSaveState, resetGameState } from "./gamestate.js";
import {
  getSexIcon,
  makeInputField,
  makeSelectField,
  makeSeperator,
} from "./utils.js";
import { SEX_ENUM } from "./enums.js";
import { createPlayer } from "./player.js";
import { switchPanel } from "./panelnavigation.js";
import { getClothesModel } from "./clothing.js";
import { InitUpdate } from "./init.js";
import { UpdateGamePlayers } from "./game.js";
import { createDiceSet } from "./dices.js";

export function InitNewGame() {
  UpdatePlayersUI(); // Fill players UI for new game
  UpdateNewPlayerUI(); // Fill new player UI
  ResetGame(); // Reset Game Button
  StartGame(); // Start Game Button
}

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
    bubble.id = p.id;

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

    nameGroup.appendChild(sexIcon);
    nameGroup.appendChild(nameSpan);
    nameGroup.appendChild(ageSpan);

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
    UpdateNewPlayerUI();
  });

  frag.appendChild(add);

  root.appendChild(frag);
}

export function UpdateNewPlayerUI() {
  const rootNewPlayer = document.getElementById("add-newplayer");
  if (!rootNewPlayer) return;

  rootNewPlayer.innerHTML = "";

  const form = document.createElement("form");
  form.className = "col gap-md";
  form.noValidate = true;

  // Naam
  const { wrap: nameWrap, input: nameInput } = makeInputField("name", "text", {
    labelI18n: "app.newplayer.form.name",
    placeholderI18n: "app.newplayer.form.name",
  });

  // Leeftijd (min 18)
  const { wrap: ageWrap, input: ageInput } = makeInputField("age", "number", {
    labelI18n: "app.newplayer.form.age",
    placeholderI18n: "app.newplayer.form.age",
    defaultValue: 18,
    attrs: { min: "1" },
  });

  // Geslacht
  const { wrap: sexWrap, select: sexSelect } = makeSelectField("sex", {
    labelI18n: "app.newplayer.form.sex",
    entries: Object.entries(SEX_ENUM),
  });

  // Seksuele voorkeur
  const { wrap: prefWrap, select: prefSelect } = makeSelectField("preferSex", {
    labelI18n: "app.newplayer.form.preferSex",
    entries: Object.entries(SEX_ENUM),
  });

  // Kleding
  const playerClothes = getClothesModel();
  const clothesWrap = document.createElement("div");
  clothesWrap.className = "col small";

  const headerClothes = document.createElement("p");
  headerClothes.setAttribute("data-i18n-auto", "app.newplayer.form.clothes");
  clothesWrap.append(headerClothes);

  Object.entries(playerClothes).forEach(([key, piece]) => {
    const clothesRow = document.createElement("label");
    clothesRow.className = "row grid3";

    const cbClothingPiece = document.createElement("input");
    cbClothingPiece.type = "checkbox";
    cbClothingPiece.name = "clothing";
    cbClothingPiece.checked = !!piece.enabled;

    const lbClothingPiece = document.createElement("span");
    lbClothingPiece.setAttribute("data-i18n-auto", piece.name);

    const lbInfo = document.createElement("p");
    lbInfo.className = "muted";
    lbInfo.setAttribute("data-i18n-auto", piece.desc);

    clothesRow.append(cbClothingPiece, lbClothingPiece, lbInfo);

    clothesWrap.append(clothesRow);

    cbClothingPiece.addEventListener("change", () => {
      playerClothes[key].enabled = cbClothingPiece.checked;
    });
  });

  // Consent met muted uitleg
  const consentWrap = document.createElement("div");
  consentWrap.className = "col small";

  const consentRow = document.createElement("label");
  consentRow.className = "row small";

  const cbConsent = document.createElement("input");
  cbConsent.type = "checkbox";
  cbConsent.name = "consent";

  const lblConsent = document.createElement("span");
  lblConsent.setAttribute("data-i18n-auto", "app.newplayer.form.consent");

  consentRow.append(cbConsent, lblConsent);

  const consentInfo = document.createElement("p");
  consentInfo.className = "muted";
  consentInfo.setAttribute(
    "data-i18n-auto",
    "app.newplayer.form.consent.content"
  );

  consentWrap.append(consentRow, consentInfo);

  // Actieknoppen
  const actions = document.createElement("div");
  actions.className = "row small";

  const btnCancel = document.createElement("button");
  btnCancel.type = "button";
  btnCancel.className = "btn";
  btnCancel.setAttribute("data-i18n-auto", "button.cancel");
  btnCancel.setAttribute("data-panel", "newgame");
  btnCancel.addEventListener("click", () => {
    rootNewPlayer.innerHTML = "";
    // eventueel: switchPanel("mainmenu") of terug naar players-overzicht
  });

  const btnSave = document.createElement("button");
  btnSave.type = "submit";
  btnSave.className = "btn";
  btnSave.setAttribute("data-i18n-auto", "button.addplayer");

  actions.append(btnCancel, btnSave);

  // Samenstellen
  form.append(
    nameWrap,
    ageWrap,
    sexWrap,
    prefWrap,
    makeSeperator(),
    clothesWrap,
    makeSeperator(),
    consentWrap,
    makeSeperator(),
    actions
  );
  rootNewPlayer.appendChild(form);

  // Stille validatie (rode rand) — zoals eerder
  function mark(el, ok) {
    if (!el) return true;
    el.classList.toggle("input-invalid", !ok);
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const vName = mark(nameInput, !!nameInput.value.trim());
    const ageVal = parseInt(ageInput.value, 10);
    const vAge = mark(ageInput, Number.isFinite(ageVal) && ageVal > 0);

    const sexVal = sexSelect.value;
    const prefVal = prefSelect.value;
    const vSex = mark(sexSelect, Object.values(SEX_ENUM).includes(sexVal));
    const vPref = mark(prefSelect, Object.values(SEX_ENUM).includes(prefVal));
    const vConsent = cbConsent.checked;
    consentRow.classList.toggle("input-invalid", !vConsent);

    if (!(vName && vAge && vSex && vPref && vConsent)) return;

    // Aanmaken via bestaande helper
    createPlayer(
      nameInput.value.trim(),
      sexVal,
      ageVal,
      prefVal,
      vConsent,
      playerClothes
    );

    // reset UI
    rootNewPlayer.innerHTML = "";
    UpdatePlayersUI();
    switchPanel("newgame");
  });
}

function removePlayerAt(index, targetId) {
  if (!Array.isArray(window.GAME?.players)) return;
  if (index < 0 || index >= window.GAME.players.length) return;

  window.GAME.players.splice(index, 1);
  gameSaveState();
  UpdatePlayersUI(targetId);
}

export function ResetGame(targetId = "newgamebuttons", elementID = "ResetGameButton") {
  const root = document.getElementById(targetId);
  if (!root) return;

  const existing = root.querySelector(`#${elementID}`);
  if (existing) existing.remove();

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "btn";
  resetButton.id = elementID;
  resetButton.setAttribute("data-i18n-auto", "button.resetgame");
  resetButton.setAttribute("data-panel", "mainmenu");
  resetButton.addEventListener("click", () => {
    resetGameState();
    InitUpdate();
  });

  root.append(resetButton);
}

export function StartGame(targetId = "newgamebuttons", elementID = "StartGameButton") {
  const root = document.getElementById(targetId);
  if (!root) return;

  const existing = root.querySelector(`#${elementID}`);
  if (existing) existing.remove();

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "btn";
  resetButton.id = elementID;
  resetButton.setAttribute("data-i18n-auto", "button.startgame");
  resetButton.setAttribute("data-panel", "game");
  resetButton.addEventListener("click", () => {
    // Copy settings to game instance
    window.GAME?.game?.stage = window.GAME?.settings?.stage;
    window.GAME?.game?.intensity = window.GAME?.settings?.intensity;
    window.GAME?.game?.extremity = window.GAME?.settings?.extremity;
    window.GAME?.game?.act = window.GAME?.settings?.act;
    window.GAME?.game?.secretTasks = window.GAME?.settings?.secretTasks;
    window.GAME?.game?.rolls = window.GAME?.settings?.rolls;
    window.GAME?.game?.score = window.GAME?.settings?.score;
    window.GAME?.game?.dices = window.GAME?.settings?.dices;

    // Set initial values for new game
    window.GAME?.game?.round = 0;
    window.GAME?.game?.turnIndex = 0;
    window.GAME?.game?.diceSet = createDiceSet(window.GAME?.game?.dices || window.GAME?.settings?.dices || 5);

    // init
    UpdateGamePlayers();

    // save game state
    gameSaveState();
  });

  root.append(resetButton);
}