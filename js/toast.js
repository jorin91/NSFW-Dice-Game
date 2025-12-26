import { setI18n } from "./lang_i18n.js";

export function toast(msg, isError = false, logConsole = false) {
  let toastDiv = document.getElementById("toast");
  if (!toastDiv) {
    toastDiv = document.createElement("div");
    toastDiv.id = "toast";
    toastDiv.className = "toast";
    document.body.appendChild(toastDiv);
  }

  if (isError) {
    toastDiv.classList.add("error");
  } else {
    toastDiv.classList.remove("error");
  }

  toastDiv.textContent = msg;
  setI18n(toastDiv, msg, null, null, true);
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
