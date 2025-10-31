import { getSexIcon } from "./utils.js";

export function InitGame() {
  layout();
  UpdateGamePlayers();
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

  rollDiceField.append(rollDiceFieldHeader);

  // Hold Dice Field
  const holdDiceField = document.createElement("div");
  holdDiceField.id = "holdDiceField";
  holdDiceField.className = "row";

  const holdDiceFieldHeader = document.createElement("h3");
  holdDiceFieldHeader.setAttribute(
    "data-i18n-auto",
    "app.game.holdDiceField.Header"
  );

  holdDiceField.append(holdDiceFieldHeader);

  // Score Preview
  const scorePreview = document.createElement("div");
  scorePreview.id = "scorePreview";
  scorePreview.className = "col";

  const scorePreviewHeader = document.createElement("h3");
  scorePreviewHeader.setAttribute(
    "data-i18n-auto",
    "app.game.scorePreview.Header"
  );

  scorePreview.append(scorePreviewHeader);

  // Game Menu
  const gameMenu = document.createElement("div");
  gameMenu.id = "gameMenu";
  gameMenu.className = "row";

  // Append panels
  root.append(
    playerField,
    rollDiceField,
    holdDiceField,
    scorePreview,
    gameMenu
  );

  // Panel Logic
}

export function UpdateGamePlayers(targetId = "PlayerRow") {
  const root = document.getElementById(targetId);
  if (!root) return;

  const winScore = window.GAME?.settings?.score || 3;

  const players = Array.isArray(window.GAME?.players)
    ? window.GAME.players
    : [];

  players.forEach((p, index) => {
    let bubble = root.querySelector(`[id="${p.id}"]`);
    let pointsSpan;

    if (!bubble) {
      // Not existing, creating

      // Player Bubble
      bubble = document.createElement("div");
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
      pointsSpan = document.createElement("span");
      pointsSpan.id = "points";
      pointsSpan.textContent = createPointsLabel(p?.score);

      // Appending to name part
      bubble.appendChild(sexIcon);
      bubble.appendChild(nameSpan);
      bubble.appendChild(pointsSpan);

      root.append(bubble);
    } else {
      pointsSpan = bubble.querySelector(`#${p.id}`);
    }

    // Update score
    pointsSpan.textContent = createPointsLabel(p?.score);

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
