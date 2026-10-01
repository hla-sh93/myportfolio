/**
 * Web Storage that never throws.
 *
 * With cookies and site data blocked (Chrome's "Block all cookies", some
 * privacy modes and embedded webviews) merely reading `window.localStorage`
 * raises a SecurityError. Uncaught inside an effect, that took the whole page
 * down to Next's "This page couldn't load". Every read here answers null and
 * every write reports whether it stuck, so callers degrade instead.
 */
type Area = "local" | "session";

function storage(area: Area): Storage | null {
  try {
    return area === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readStorage(area: Area, key: string): string | null {
  try {
    return storage(area)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStorage(area: Area, key: string, value: string): boolean {
  try {
    const s = storage(area);
    if (!s) return false;
    s.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(area: Area, key: string): void {
  try {
    storage(area)?.removeItem(key);
  } catch {
    /* nothing to undo */
  }
}
