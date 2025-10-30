export function InitGame() {
  layout();
}

function layout(targetId = "GamePanel") {
  const root = document.getElementById(targetId);
  if (!root) return;

root.innerHTML = "";

// Player overview
const playerField = document.createElement("div");
playerField.id = "playerField";
playerField.className = "col"

const playerFieldHeader = document.createElement("h3");
playerFieldHeader.setAttribute("data-i18n-auto", "app.game.playerField.Header")

playerField.append(playerFieldHeader);

// Roll Dice Field
const rollDiceField = document.createElement("div");
rollDiceField.id = "rollDiceField";
rollDiceField.className = "col"

const rollDiceFieldHeader = document.createElement("h3");
rollDiceFieldHeader.setAttribute("data-i18n-auto", "app.game.rollDiceField.Header")

rollDiceField.append(rollDiceFieldHeader);

// Hold Dice Field
const holdDiceField = document.createElement("div");
holdDiceField.id = "holdDiceField";
holdDiceField.className = "row"

const holdDiceFieldHeader = document.createElement("h3");
holdDiceFieldHeader.setAttribute("data-i18n-auto", "app.game.holdDiceField.Header")

holdDiceField.append(holdDiceFieldHeader);

// Score Preview
const scorePreview = document.createElement("div");
scorePreview.id = "scorePreview";
scorePreview.className = "col"

const scorePreviewHeader = document.createElement("h3");
scorePreviewHeader.setAttribute("data-i18n-auto", "app.game.scorePreview.Header")

scorePreview.append(scorePreviewHeader);

// Game Menu
const gameMenu = document.createElement("div");
gameMenu.id = "gameMenu";
gameMenu.className = "row"

// Append panels
root.append(playerField,  rollDiceField, holdDiceField, scorePreview, gameMenu)

// Panel Logic
}
