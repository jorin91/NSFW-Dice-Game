import { setI18n } from "./lang_i18n";

export function toast(msg, logConsole = false) {
  let toastDiv = document.getElementById("toast");
  if (!toastDiv) {
    toastDiv = document.createElement("div");
    toastDiv.id = "toast";
    toastDiv.className = "toast";
    document.body.appendChild(toastDiv);
  }
  toastDiv.textContent = msg;
  setI18n(toastDiv, null, null, null, true);
  if (logConsole) console.log(`Toast Message:\n${msg}`);
  toastDiv.style.pointerEvents = "auto";
  toastDiv.style.opacity = "1";
  clearTimeout(toastDiv._t);
  toastDiv._t = setTimeout(() => {
    toastDiv.style.opacity = "0";
    toastDiv.style.pointerEvents = "none";
  }, 5000);
  return toastDiv;
}
