export function storageSave(object, key) {
  try {
    localStorage.setItem(key, JSON.stringify(object));
  } catch {}
}

export function storageLoad(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storageClear(key) {
  try {
    localStorage.removeItem(key);
  } catch {}
}
