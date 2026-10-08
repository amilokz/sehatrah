// Safe localStorage wrappers. ALL keys are prefixed with "sehatrah-".
const PREFIX = 'sehatrah-';

function key(name: string): string {
  return `${PREFIX}${name}`;
}

export function readJSON<T>(name: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key(name));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(name: string, value: unknown): void {
  try {
    window.localStorage.setItem(key(name), JSON.stringify(value));
  } catch {
    // storage unavailable — demo continues without persistence
  }
}

export function readString(name: string, fallback: string): string {
  try {
    return window.localStorage.getItem(key(name)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeString(name: string, value: string): void {
  try {
    window.localStorage.setItem(key(name), value);
  } catch {
    // ignore
  }
}

/** Remove every key belonging to this demo (used by "Reset demo data"). */
export function clearAllDemoData(): void {
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(PREFIX)) toRemove.push(k);
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
