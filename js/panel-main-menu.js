import { setI18n, getSupportedLanguages } from "./lang_i18n.js";
import { makePanel, getPanel } from "./elementHelpers.js";

export function setupPanelMainMenu(id = "main-menu") {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, true);

    // Build header
    panel.header.innerHTML = "";

    const h2Header = document.createElement("h2");
    setI18n(h2Header, "ui.panel-main-menu.header");
    panel.header.appendChild(h2Header);

    // Build body
    panel.body.innerHTML = "";

    // Welcome
    const welcome = document.createElement("div");
    
    const welcomeTitle = document.createElement("h4");
    setI18n(welcomeTitle, "ui.panel-main-menu.welcome.title");

    const welcomeContent = document.createElement("p");
    setI18n(welcomeContent, "ui.panel-main-menu.welcome.content");

    welcome.append(welcomeTitle, welcomeContent);

    // Goal
    const goal = document.createElement("div");

    const goalTitle = document.createElement("h4");
    setI18n(goalTitle, "ui.panel-main-menu.goal.title");

    const goalContent = document.createElement("p");
    setI18n(goalContent, "ui.panel-main-menu.goal.content");

    goal.append(goalTitle, goalContent);

    // Game
    const game = document.createElement("div");

    const gameTitle = document.createElement("h4");
    setI18n(gameTitle, "ui.panel-main-menu.game.title");

    const gameContent = document.createElement("ul");
    gameContent.className = "list";
    setI18n(gameContent, "ui.panel-main-menu.game.content", null, "html");

    game.append(gameTitle, gameContent);

    // Score
    const score = document.createElement("div");

    const scoreTitle = document.createElement("h4");
    setI18n(scoreTitle, "ui.panel-main-menu.score.title");

    const scoreContent = document.createElement("ul");
    scoreContent.className = "list";
    setI18n(scoreContent, "ui.panel-main-menu.score.content", null, "html");

    score.append(scoreTitle, scoreContent);

    // Tasks
    const tasks = document.createElement("div");

    const tasksTitle = document.createElement("h4");
    setI18n(tasksTitle, "ui.panel-main-menu.tasks.title");

    const tasksContent = document.createElement("p");
    setI18n(tasksContent, "ui.panel-main-menu.tasks.content");

    tasks.append(tasksTitle, tasksContent);

    // Agree
    const agree = document.createElement("div");

    const agreeTitle = document.createElement("h4");
    setI18n(agreeTitle, "ui.panel-main-menu.agree.title");

    const agreeContent = document.createElement("p");
    setI18n(agreeContent, "ui.panel-main-menu.agree.content");

    agree.append(agreeTitle, agreeContent);

    // Safety
    const safety = document.createElement("div");

    const safetyTitle = document.createElement("h4");
    setI18n(safetyTitle, "ui.panel-main-menu.safety.title");

    const safetyContent = document.createElement("p");
    setI18n(safetyContent, "ui.panel-main-menu.safety.content");

    safety.append(safetyTitle, safetyContent);

    // Append all to body
    panel.body.append(welcome, goal, game, score, tasks, agree, safety);

    // Build footer
    panel.footer.innerHTML = "";

    const btnRow = document.createElement("div");
    btnRow.className = "row";

    const btnCreateGame = document.createElement("button");
    btnCreateGame.className = "btn";
    btnCreateGame.id = `${panel.panelID}.button.createGame`;
    btnCreateGame.setAttribute("data-panel-hide", "*");
    btnCreateGame.setAttribute("data-panel-show", "panel-new-game, panel-player-overview");
    setI18n(btnCreateGame, "ui.panel-main-menu.button.createGame");
    btnRow.appendChild(btnCreateGame);

    const btnJoinGame = document.createElement("button");
    btnJoinGame.className = "btn";
    btnJoinGame.id = `${panel.panelID}.button.joinGame`;
    btnJoinGame.setAttribute("data-panel-hide", "*");
    btnJoinGame.setAttribute("data-panel-show", "panel-join-game, panel-player-overview");
    setI18n(btnJoinGame, "ui.panel-main-menu.button.joinGame");
    btnRow.appendChild(btnJoinGame);

    panel.footer.appendChild(btnRow);
}