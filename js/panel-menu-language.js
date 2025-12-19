import { setI18n, getSupportedLanguages } from "./lang_i18n.js";
import { makePanel, getPanel } from "./elementHelpers.js";

export async function setupPanelMenuLanguage(id = "menu-language") {
  let panel = getPanel(id);
  if (!panel) panel = makePanel(id, true);

  // Build header
  panel.header.innerHTML = "";

  const h4Header = document.createElement("h4");
  setI18n(h4Header, "ui.panel-menu-language.header");
  panel.header.appendChild(h4Header);

  // Build body
  panel.body.innerHTML = "";

  const buttonRow = document.createElement("div");
  buttonRow.className = "row";

  const languages = await getSupportedLanguages();
  languages.forEach((lang) => {
    const langBtn = document.createElement("button");
    langBtn.className = "btn lang-btn ghost";
    langBtn.id = `${panel.panelID}.button.lang.${lang.code}`;
    langBtn.setAttribute("data-lang", lang.code);
    langBtn.textContent = lang.name;
    buttonRow.appendChild(langBtn);
  });

    panel.body.appendChild(buttonRow);
    
  // Build footer
  panel.footer.innerHTML = "";
}
