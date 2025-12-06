export function deepCopy(o) {
  return JSON.parse(JSON.stringify(o));
}

export function generateRandomID() {
    return crypto.randomUUID();
}