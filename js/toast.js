export function toast(msg, logConsole = false) {
  let toastDiv = document.getElementById("toast");
  if (!toastDiv) {
    toastDiv = document.createElement("div");
    toastDiv.id = "toast";
    Object.assign(toastDiv.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      maxWidth: "500px",
      backgroundColor: uiMainBackgroundColor,
      color: uiMainFontColor,
      padding: uiMainPadding,
      border: uiMainBorder,
      borderRadius: uiMainBorderRadius,
      boxShadow: uiBoxShadow,
      whiteSpace: "pre-wrap",
      font: uiMainFont,
      zIndex: 99999,
      opacity: "0",
      transition: "opacity 1s ease",
      pointerEvents: "none",
    });
    document.body.appendChild(toastDiv);
  }
  toastDiv.textContent = msg;
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
