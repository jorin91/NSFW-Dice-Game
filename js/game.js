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

  const players = Array.isArray(window.GAME?.game?.players)
    ? window.GAME?.game?.players
    : [];

  players.forEach((p, index) => {
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

    // turnScore
    const roundScoreSpan = document.createElement("span");
    roundScoreSpan.id = "roundScore";
    roundScoreSpan.textContent = p?.roundScore ?? 0;

    // Points
    const pointsSpan = document.createElement("span");
    pointsSpan.id = "points";
    pointsSpan.textContent = createPointsLabel(p?.score);

    // Appending to name part
    bubble.appendChild(sexIcon);
    bubble.appendChild(nameSpan);
    bubble.appendChild(roundScoreSpan);
    bubble.appendChild(pointsSpan);

    root.append(bubble);

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
  endTurnButton.addEventListener("click", () => {
    endTurn();
  });

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
  // elements
  const PlayerTurn = document.getElementById("GameStatusPlayerTurn");
  const CurrentScore = document.getElementById("GameStatusCurrentScore");
  const GameProgress = document.getElementById("GameStatusGameProgress");
  const rollDicesButton = document.getElementById("rollDicesButton");

  // properties
  const turnIndex = window.GAME?.game?.turnIndex;
  const activePlayer = window.GAME?.players?.[turnIndex];
  const turnRoll = window.GAME?.game?.turnRoll ?? 0;
  const maxRoll = window.GAME?.game?.settings?.rolls ?? 3;
  const gameRound = window.GAME?.game?.round ?? 0;
  const turnScore = CalculateScore();

  if (PlayerTurn) {
    // PlayerTurn
    PlayerTurn.setAttribute(
      "data-i18n-args",
      JSON.stringify({ turnPlayer: activePlayer.name })
    );
    applyI18nToElement(PlayerTurn);
  }

  if (CurrentScore) {
    // CurrentScore
    CurrentScore.setAttribute(
      "data-i18n-args",
      JSON.stringify({
        playerScore: turnScore,
      })
    );
    applyI18nToElement(CurrentScore);
  }

  if (GameProgress) {
    // GameProgress
    GameProgress.setAttribute(
      "data-i18n-args",
      JSON.stringify({
        gameRoll: `${turnRoll}/${maxRoll}`,
        gameRound: `${gameRound}`,
      })
    );
    applyI18nToElement(GameProgress);
  }

  if (rollDicesButton) {
    // rollDicesButton
    if (turnRoll >= maxRoll) {
      rollDicesButton.classList.add("ghost");
    } else {
      rollDicesButton.classList.remove("ghost");
    }
  }
}

function endTurn() {
  const players = window.GAME?.game?.players ?? [];
  const playerCount = players.length;
  if (playerCount === 0) return; // geen spelers → niets doen

  const currentTurnIndex = window.GAME?.game?.turnIndex ?? 0;
  const currentRound = window.GAME?.game?.round ?? 0;
  const turnScore = CalculateScore();

  // Sla speler score op
  players[currentTurnIndex].roundScore = turnScore;

  // Volgende speler met wrap
  const nextIndex = (currentTurnIndex + 1) % playerCount;
  window.GAME.game.turnIndex = nextIndex;

  // Als we terug springen naar 0, is de ronde voorbij
  if (nextIndex === 0) {
    window.GAME.game.round = currentRound + 1;
    CheckForWinner();
    CheckForLoser();
  }

  // Reset rolls voor nieuwe beurt
  window.GAME.game.turnRoll = 0;

  gameSaveState();
  UpdateGamePlayers();
  updateGameStatus();
}

function CalculateScore() {
  const counts = {};

  const turnRoll = window.GAME?.game?.turnRoll ?? 0;
  if (turnRoll <= 0) return 0;

  // Tel hoeveel keer elk getal voorkomt
  DiceSet.forEach((dice) => {
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

function CheckForWinner() {
  const players = window.GAME?.game?.players ?? [];
  const playerCount = players.length;
  if (playerCount === 0) return; // geen spelers → niets doen

  const safeScore = window.GAME?.game?.score ?? 3;

  // Zoek speler met hoogste roundScore
  let winner = players[0];
  for (let i = 1; i < playerCount; i++) {
    if ((players[i].roundScore ?? 0) > (winner.roundScore ?? 0)) {
      winner = players[i];
    }
  }

  // Verhoog zijn score met 1
  winner.score = (winner.score ?? 0) + 1;

  // Controleer op safe-status
  if (winner.score >= safeScore) {
    winner.safe = true;
  }
}

function CheckForLoser() {
  const players = window.GAME?.game?.players ?? [];
  if (players.length === 0) return; // geen spelers → niets doen

  // Filter alle spelers die nog niet 'safe' zijn
  const activePlayers = players.filter((p) => !p.safe);

  // Als er nog maar één over is, voer iets uit met die speler
  if (activePlayers.length === 1) {
    const loser = activePlayers[0];

    // TODO: hier komt jouw logica, bijv. opdracht toewijzen
    console.log("Verliezer van de ronde:", loser.name);

    // voorbeeld:
    // triggerTaskForLoser(loser);
  }
}
