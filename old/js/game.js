import { getSexIcon } from "./utils.js";
import { createDiceInstance, bindDiceToImage, rollAllDice } from "./dices.js";
import { gameSaveState } from "./gamestate.js";
import { applyI18nToElement, setI18n } from "./lang_i18n.js";
import { buildTaskPanel } from "./tasks.js";

const DiceSet = [];

export function InitGame() {
  layout();
  UpdateGamePlayers();
  updateDiceSet(true);
  updateGameControls();
  updateGameStatus();
  continueGame();
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
  setI18n(playerFieldHeader, "app.game.playerField.Header");

  const playerFieldPlayerRow = document.createElement("div");
  playerFieldPlayerRow.id = "PlayerRow";
  playerFieldPlayerRow.className = "row";

  playerField.append(playerFieldHeader, playerFieldPlayerRow);

  // Roll Dice Field
  const rollDiceField = document.createElement("div");
  rollDiceField.id = "rollDiceField";
  rollDiceField.className = "col";

  const rollDiceFieldHeader = document.createElement("h3");
  setI18n(rollDiceFieldHeader, "app.game.rollDiceField.Header");

  const rollDiceRow = document.createElement("div");
  rollDiceRow.id = "rollDiceRow";
  rollDiceRow.className = "row";

  rollDiceField.append(rollDiceFieldHeader, rollDiceRow);

  // Hold Dice Field
  const holdDiceField = document.createElement("div");
  holdDiceField.id = "holdDiceField";
  holdDiceField.className = "col";

  const holdDiceFieldHeader = document.createElement("h3");
  setI18n(holdDiceFieldHeader, "app.game.holdDiceField.Header");

  const holdDiceRow = document.createElement("div");
  holdDiceRow.id = "holdDiceRow";
  holdDiceRow.className = "row";

  holdDiceField.append(holdDiceFieldHeader, holdDiceRow);

  // Game Status
  const GameStatus = document.createElement("div");
  GameStatus.id = "GameStatus";
  GameStatus.className = "col";

  const GameStatusHeader = document.createElement("h3");
  setI18n(GameStatusHeader, "app.game.GameStatus.Header");

  const GameStatusPlayerTurn = document.createElement("p");
  GameStatusPlayerTurn.id = "GameStatusPlayerTurn";
  setI18n(GameStatusPlayerTurn, "app.game.GameStatus.PlayerTurn", null, "html");

  const GameStatusCurrentScore = document.createElement("p");
  GameStatusCurrentScore.id = "GameStatusCurrentScore";
  setI18n(
    GameStatusCurrentScore,
    "app.game.GameStatus.CurrentScore",
    null,
    "html"
  );

  const GameStatusGameProgress = document.createElement("p");
  GameStatusGameProgress.id = "GameStatusGameProgress";
  GameStatusGameProgress.className = "muted";
  setI18n(
    GameStatusGameProgress,
    "app.game.GameStatus.GameProgress",
    null,
    "html"
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
  setI18n(gameMenuHeader, "app.game.gameControls.Header");

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
  resetDice = false,
  targetIdRollField = "rollDiceRow",
  targetIdHoldField = "holdDiceRow"
) {
  const savedDiceSet = window.GAME?.game?.diceSet;
  if (!Array.isArray(savedDiceSet) || savedDiceSet.length === 0) return;

  const containerRoll = document.getElementById(targetIdRollField);
  const containerHold = document.getElementById(targetIdHoldField);
  if (!containerRoll || !containerHold) return;

  if (!DiceSet || DiceSet.length === 0) {
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
  } else {
    if (resetDice) {
      DiceSet.forEach((d, index) => {
        if (resetDice) {
          d.hold = false;
          d.setValue(1);

          containerRoll.append(d.element);
        }
      });
    } else {
      DiceSet.forEach((d, index) => {
        d.refresh();
      });
    }
  }
}

export function updateGameControls(targetId = "gameControlsRow") {
  const root = document.getElementById(targetId);
  if (!root) return;

  root.innerHTML = "";

  const endTurnButton = document.createElement("button");
  endTurnButton.type = "button";
  endTurnButton.className = "btn";
  endTurnButton.id = "endTurnButton";
  setI18n(endTurnButton, "button.endTurn");
  endTurnButton.setAttribute("data-panel", "!");
  endTurnButton.addEventListener("click", () => {
    endTurn();
  });

  const rollButton = document.createElement("button");
  rollButton.type = "button";
  rollButton.className = "btn";
  rollButton.id = "rollDicesButton";
  setI18n(rollButton, "button.rollDices");
  rollButton.addEventListener("click", async () => {
    const turnRoll = window.GAME?.game?.turnRoll ?? 0;
    const maxRoll = window.GAME?.game?.settings?.rolls ?? 3;

    if (turnRoll >= maxRoll) return;

    endTurnButton.classList.add("ghost");
    endTurnButton.disabled = true;
    rollButton.classList.add("ghost");
    rollButton.disabled = true;

    await rollAllDice(DiceSet);
    window.GAME.game.diceSet = DiceSet;
    window.GAME.game.turnRoll++;
    gameSaveState();
    updateGameStatus();

    endTurnButton.classList.remove("ghost");
    endTurnButton.disabled = false;
  });

  const stopButton = document.createElement("button");
  stopButton.type = "button";
  stopButton.className = "btn";
  stopButton.id = "stopButton";
  setI18n(stopButton, "button.stopgame");
  stopButton.setAttribute("data-panel", "mainmenu");
  stopButton.addEventListener("click", () => {});

  root.append(rollButton, endTurnButton, stopButton);
}

function resetGame() {}

function updateGameStatus() {
  // elements
  const PlayerTurn = document.getElementById("GameStatusPlayerTurn");
  const CurrentScore = document.getElementById("GameStatusCurrentScore");
  const GameProgress = document.getElementById("GameStatusGameProgress");
  const rollDicesButton = document.getElementById("rollDicesButton");

  // properties
  const turnIndex = window.GAME?.game?.turnIndex;
  const activePlayer = window.GAME?.game?.players?.[turnIndex];
  const turnRoll = window.GAME?.game?.turnRoll ?? 0;
  const maxRoll = window.GAME?.game?.settings?.rolls ?? 3;
  const gameRound = window.GAME?.game?.round ?? 0;
  const turnScore = CalculateScore();

  if (PlayerTurn) {
    // PlayerTurn
    setI18n(
      PlayerTurn,
      null,
      {
        turnPlayer: activePlayer?.name ?? `Player ${turnIndex + 1}`,
      },
      null,
      true
    );
  }

  if (CurrentScore) {
    // CurrentScore
    setI18n(
      CurrentScore,
      null,
      {
        playerScore: turnScore,
      },
      null,
      true
    );
  }

  if (GameProgress) {
    // GameProgress
    setI18n(
      GameProgress,
      null,
      {
        gameRoll: `${turnRoll}/${maxRoll}`,
        gameRound: `${gameRound}`,
      },
      null,
      true
    );
  }

  if (rollDicesButton) {
    // rollDicesButton
    if (turnRoll >= maxRoll) {
      rollDicesButton.classList.add("ghost");
      rollDicesButton.disabled = true;
    } else {
      rollDicesButton.classList.remove("ghost");
      rollDicesButton.disabled = false;
    }
  }
}

function continueGame() {
  const storedTask = window.GAME?.game?.currentTask ?? null;
  if (storedTask) {
    buildTaskPanel();
  }
}

function endTurn() {
  const players = window.GAME?.game?.players ?? [];
  const playerCount = players.length;
  if (playerCount === 0) return; // geen spelers → niets doen

  const currentTurnIndex = window.GAME?.game?.turnIndex ?? 0;
  const currentRound = window.GAME?.game?.round ?? 0;

  // 1) Score opslaan
  const turnScore = CalculateScore();
  players[currentTurnIndex].roundScore = turnScore;

  // 2) Is er in deze ronde nog iemand NA de huidige index die niet safe is?
  const nextSameRoundIndex = findNextInSameRound(currentTurnIndex, players);

  if (nextSameRoundIndex === -1) {
    // 3) Ronde voorbij → eerst winner/loser/reset
    window.GAME.game.round = currentRound + 1;
    CheckForWinner(); // let op: hierbinnen score cappen met Math.min(safeScore, score+1)
    CheckForLoser();
    ResetPlayers(true); // reset roundScore

    // 4) Nieuwe ronde: kies eerste niet-safe vanaf index 0
    const startIndex = findNextFromStart(players);
    window.GAME.game.turnIndex = startIndex;
  } else {
    // Volgende speler binnen dezelfde ronde
    window.GAME.game.turnIndex = nextSameRoundIndex;
  }

  // Nieuwe beurt
  window.GAME.game.turnRoll = 0;
  updateDiceSet(true);
  gameSaveState();
  UpdateGamePlayers();
  updateGameStatus();
}

// Helper: zoek eerstvolgende niet-safe speler NA currentIndex, zonder wrap
function findNextInSameRound(currentIndex, players) {
  for (let i = currentIndex + 1; i < players.length; i++) {
    if (!players[i]?.safe) return i;
  }
  return -1; // geen volgende binnen deze ronde
}

// Helper: zoek eerste niet-safe speler vanaf index 0
function findNextFromStart(players) {
  for (let i = 0; i < players.length; i++) {
    if (!players[i]?.safe) return i;
  }
  return 0; // fallback: niemand actief → 0; jouw andere logica (loser/nieuwe cyclus) pakt dit verder op
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
  winner.score = Math.min(safeScore, (winner.score ?? 0) + 1);

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

    // ResetPlayers(true, true);
    buildTaskPanel();
  }
}

export function getRoundResult() {
  const players = window.GAME?.game?.players ?? [];
  if (players.length === 0) return null; // geen spelers → niets doen

  const loser = players.find((p) => !p.safe);
  const winners = players.filter((p) => p.safe);
  return { loser, winners };
}

function ResetPlayers(resetRound = false, resetGameCycle = false) {
  const players = window.GAME?.game?.players ?? [];
  const playerCount = players.length;
  if (playerCount === 0) return; // geen spelers → niets doen

  players.forEach((player) => {
    if (resetRound) {
      player.roundScore = 0;
    }

    if (resetGameCycle) {
      player.score = 0;
      player.safe = false;
    }
  });
}

function findNextActivePlayerIndex(currentIndex, players) {
  const n = players.length;
  if (n === 0) return { next: 0, wrapped: false };

  let idx = currentIndex;
  let wrapped = false;

  // Max 1 volledige rondgang
  for (let step = 0; step < n; step++) {
    idx = (idx + 1) % n;
    if (idx === 0) wrapped = true; // we zijn over het einde heen gegaan

    if (!players[idx]?.safe) {
      return { next: idx, wrapped };
    }
  }

  // Niemand actief: forceer reset naar 0 en markeer als wrap
  return { next: 0, wrapped: true };
}
