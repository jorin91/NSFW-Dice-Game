export function createWrapper() {}

export function CreatePanel() {
  const panel = document.createElement("section");
  panel.className = "panel card";

  return panel;
}

export function CreatePanelHeader() {
  const header = document.createElement("div");
  header.className = "hd";

  return header;
}

export function CreatePanelBody() {
  const body = document.createElement("div");
  body.className = "bd col";

  return body;
}

export function CreateHeader() {
  const header = document.createElement("h2");

  return header;
}

export function CreateBody() {
  const body = document.createElement("p");

  return body;
}

export function CreateBodyMuted() {
  const body = document.createElement("p");
  body.className = "muted";

  return body;
}

export function CreateRow() {
  const row = document.createElement("div");
  row.className = "row";

  return row;
}

export function CreateCol() {
  const col = document.createElement("div");
  col.className = "col";

  return col;
}

export function CreateSeperator() {
  const el = document.createElement("div");
  el.className = "sep";
  return el;
}
