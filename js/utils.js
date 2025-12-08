// js/utils.js
export function deepCopy(o) {
  return JSON.parse(JSON.stringify(o));
}

export function generateRandomID() {
    return crypto.randomUUID();
}

export function generateTimestampID() {
  return String(Date.now());
}

export function randomNumberString(length = 6) {
  let num = Math.floor(Math.random() * 10 ** length).toString();
  return num.padStart(length, "0");
}

export function randomNumber(length = 6) {
  if (length <= 0) return 0;
  const min = 10 ** (length - 1);
  const max = 10 ** length;
  return Math.floor(Math.random() * (max - min)) + min;
}