import { getSexIcon } from "./utils.js";
import { createDiceInstance, bindDiceToImage, rollAllDice } from "./dices.js";
import { gameSaveState } from "./gamestate.js";
import { applyI18nToElement } from "./lang_i18n.js";

const DiceSet = [];

export function InitGame() {
  layout();
  UpdateGamePlayers();
  updateDiceSet();
  updateGameControls();
  updateGameStatus();
}

function layout(targetId = "GamePanel") {
  const root = document.getElementById(targetId);
  if (!root) return;

  root.innerHTML = "";

  // Player overview
  const playerField = document.createElement("div");
  playerField.id = "playerField";
  playerField.className = "col";

  const playerFieldHeader = document.createElement("h3");
  playerFieldHeader.setAttribute(
    "data-i18n-auto",
    "app.game.playerField.Header"
  );

  const playerFieldPlayerRow = document.createElement("div");
  playerFieldPlayerRow.id = "PlayerRow";
  playerFieldPlayerRow.className = "row";

  playerField.append(playerFieldHeader, playerFieldPlayerRow);

  // Roll Dice Field
  const rollDiceField = document.createElement("div");
  rollDiceField.id = "rollDiceField";
  rollDiceField.className = "col";

  const rollDiceFieldHeader = document.createElement("h3");
  rollDiceFieldHeader.setAttribute(
    "data-i18n-auto",
    "app.game.rollDiceField.Header"
  );

  const rollDiceRow = document.createElement("div");
  rollDiceRow.id = "rollDiceRow";
  rollDiceRow.className = "row";

  rollDiceField.append(rollDiceFieldHeader, rollDiceRow);

  // Hold Dice Field
  const holdDiceField = document.createElement("div");
  holdDiceField.id = "holdDiceField";
  holdDiceField.className = "col";

  const holdDiceFieldHeader = document.createElement("h3");
  holdDiceFieldHeader.setAttribute(
    "data-i18n-auto",
    "app.game.holdDiceField.Header"
  );

  const holdDiceRow = document.createElement("div");
  holdDiceRow.id = "holdDiceRow";
  holdDiceRow.className = "row";

  holdDiceField.append(holdDiceFieldHeader, holdDiceRow);

  // Game Status
  const GameStatus = document.createElement("div");
  GameStatus.id = "GameStatus";
  GameStatus.className = "col";

  const GameStatusHeader = document.createElement("h3");
  GameStatusHeader.setAttribute("data-i18n-auto", "app.game.GameStatus.Header");

  const GameStatusPlayerTurn = document.createElement("p");
  GameStatusPlayerTurn.id = "GameStatusPlayerTurn";
  GameStatusPlayerTurn.setAttribute(
    "data-i18n-auto",
    "app.game.GameStatus.PlayerTurn"
  );

  const GameStatusCurrentScore = document.createElement("p");
  GameStatusCurrentScore.id = "GameStatusCurrentScore";
  GameStatusCurrentScore.setAttribute(
    "data-i18n-auto",
    "app.game.GameStatus.CurrentScore"
  );

  const GameStatusGameProgress = document.createElement("p");
  GameStatusGameProgress.id = "GameStatusGameProgress";
  GameStatusGameProgress.className = "muted";
  GameStatusGameProgress.setAttribute(
    "data-i18n-auto",
    "app.game.GameStatus.GameProgress"
  );

  GameStatus.append(
    GameStatusHeader,
    GameStatusPlayerTurn,
    GameStatusCurrentScore,
    GameStatusGameProgress
  );

  // Game Menu
  const gameMenu = document.createElement("div");
  gameMenu.id = "gameControls";
  gameMenu.className = "col";

  const gameMenuHeader = document.createElement("h3");
  gameMenuHeader.setAttribute("data-i18n-auto", "app.game.gameControls.Header");

  const gameMenuRow = document.createElement("div");
  gameMenuRow.id = "gameControlsRow";
  gameMenuRow.className = "row grid3";

  gameMenu.append(gameMenuHeader, gameMenuRow);

  // Append panels
  root.append(playerField, rollDiceField, holdDiceField, GameStatus, gameMenu);

  // Panel Logic
}

export function UpdateGamePlayers(targetId = "PlayerRow") {
  const root = document.getElementById(targetId);
  if (!root) return;

  root.innerHTML = "";

  const winScore = window.GAME?.game?.score || 3;

  const players = Array.isArray(window.GAME?.players)
    ? window.GAME.players
    : [];

  players.forEach((p, index) => {
    /*
    let bubble = root.querySelector(`[id="${p.id}"]`);
    let pointsSpan;
    

    if (!bubble) {
      // Not existing, creating
      */

    // Player Bubble
    const bubble = document.createElement("div");
    bubble.className = "bubble row";
    bubble.id = p?.id;

    // Naam
    const nameSpan = document.createElement("span");
    nameSpan.textContent = p?.name || `Player ${index + 1}`;

    // Geslachticoon
    const sexIcon = document.createElement("span");
    sexIcon.className = "player-sex";
    sexIcon.textContent = getSexIcon(p?.sex);

    // Points
    const pointsSpan = document.createElement("span");
    pointsSpan.id = "points";
    pointsSpan.textContent = createPointsLabel(p?.score);

    // Appending to name part
    bubble.appendChild(sexIcon);
    bubble.appendChild(nameSpan);
    bubble.appendChild(pointsSpan);

    root.append(bubble);
    /*
    } else {
      pointsSpan = bubble.querySelector(`#${p.id}`);
    }

    // Update score
    pointsSpan.textContent = createPointsLabel(p?.score);
    */

    if (p.score >= winScore) {
      p.safe = true;
    } else {
      p.safe = false;
    }

    if (p.safe) {
      bubble.classList.add("safe");
    } else {
      bubble.classList.remove("safe");
    }
  });
}

function createPointsLabel(points = 0) {
  return `(${points || 0})`;
}

function updateDiceSet(
  targetIdRollField = "rollDiceRow",
  targetIdHoldField = "holdDiceRow"
) {
  const savedDiceSet = window.GAME?.game?.diceSet;
  if (!Array.isArray(savedDiceSet) || savedDiceSet.length === 0) return;

  if (savedDiceSet.length === 0) {
    
  }

  const containerRoll = document.getElementById(targetIdRollField);
  const containerHold = document.getElementById(targetIdHoldField);
  if (!containerRoll || !containerHold) return;

  savedDiceSet.forEach((d, index) => {
    const dice = createDiceInstance(
      d.id || `dice${index + 1}`,
      d.value ?? 6,
      d.hold ?? false
    );

    // Create html element
    const img = document.createElement("img");
    img.className = "dice-img";
    img.style.width = "128px";
    img.style.height = "128px";
    img.style.objectFit = "contain";

    img.addEventListener("click", () => {
      dice.hold = !dice.hold;

      window.GAME.game.diceSet = DiceSet;
      gameSaveState();

      switch (dice.hold) {
        case true:
          containerHold.append(img);
          break;

        case false:
          containerRoll.append(img);
          break;
      }
    });

    // Initial Add
    switch (dice.hold) {
      case true:
        containerHold.append(img);
        break;

      case false:
        containerRoll.append(img);
        break;
    }

    // bind model ↔ element (patcht roll en voegt refresh/setValue toe)
    const linked = bindDiceToImage(dice, img);

    // bewaar het model (zoals je vroeg) in DiceSet
    DiceSet.push(linked);
  });
}

export function updateGameControls(targetId = "gameControlsRow") {
  const root = document.getElementById(targetId);
  if (!root) return;

  root.innerHTML = "";

  const rollButton = document.createElement("button");
  rollButton.type = "button";
  rollButton.className = "btn";
  rollButton.id = "rollDicesButton";
  rollButton.setAttribute("data-i18n-auto", "button.rollDices");
  rollButton.addEventListener("click", async () => {
    const turnRoll = window.GAME?.game?.turnRoll ?? 0;
    const maxRoll = window.GAME?.game?.settings?.rolls ?? 3;

    if (turnRoll >= maxRoll) return;

    await rollAllDice(DiceSet);
    window.GAME.game.diceSet = DiceSet;
    window.GAME.game.turnRoll++;
    gameSaveState();
    updateGameStatus();
  });

  const endTurnButton = document.createElement("button");
  endTurnButton.type = "button";
  endTurnButton.className = "btn";
  endTurnButton.id = "endTurnButton";
  endTurnButton.setAttribute("data-i18n-auto", "button.endTurn");
  endTurnButton.addEventListener("click", () => {});

  const stopButton = document.createElement("button");
  stopButton.type = "button";
  stopButton.className = "btn";
  stopButton.id = "stopButton";
  stopButton.setAttribute("data-i18n-auto", "button.stopgame");
  stopButton.setAttribute("data-panel", "mainmenu");
  stopButton.addEventListener("click", () => {});

  root.append(rollButton, endTurnButton, stopButton);
}

function updateGameStatus() {
  const PlayerTurn = document.getElementById("GameStatusPlayerTurn");
  const CurrentScore = document.getElementById("GameStatusCurrentScore");
  const GameProgress = document.getElementById("GameStatusGameProgress");

  if (!PlayerTurn || !CurrentScore || !GameProgress) return;

  // PlayerTurn
  const turnIndex = window.GAME?.game?.turnIndex;
  const activePlayer = window.GAME?.players?.[turnIndex];
  PlayerTurn.setAttribute(
    "data-i18n-args",
    JSON.stringify({ turnPlayer: activePlayer.name })
  );
  applyI18nToElement(PlayerTurn);

  // CurrentScore
  CurrentScore.setAttribute(
    "data-i18n-args",
    JSON.stringify({
      playerScore: CalculateScore(),
    })
  );
  applyI18nToElement(CurrentScore);

  // GameProgress via i18n
  const turnRoll = window.GAME?.game?.turnRoll ?? 0;
  const maxRoll = window.GAME?.game?.settings?.rolls ?? 3;
  const gameRound = window.GAME?.game?.round ?? 0;

  GameProgress.setAttribute(
    "data-i18n-args",
    JSON.stringify({
      gameRoll: `${turnRoll}/${maxRoll}`,
      gameRound: `${gameRound}`,
    })
  );
  applyI18nToElement(GameProgress);
}

export function CalculateScore() {
  const counts = {};

  // Tel hoeveel keer elk getal voorkomt
  DiceSet.forEach(dice => {
    const v = dice.value;
    if (!counts[v]) counts[v] = 0;
    counts[v]++;
  });

  // Bereken de totale score
  let total = 0;
  for (const [valueStr, count] of Object.entries(counts)) {
    const value = parseInt(valueStr);
    // jouw regel: waarde × 10^(aantalZelfde - 1)
    const score = value * Math.pow(10, count - 1);
    total += score;
  }

  return total;
}
