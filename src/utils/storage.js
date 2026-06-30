const KEYS = {
  blacklist: "makanmana_blacklist",
  history: "makanmana_history",
  streak: "makanmana_streak",
  badges: "makanmana_badges",
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (private mode etc) — fail silently
  }
}

// ---- Tak Nak List (blacklist) ----
export function getBlacklist() {
  return safeGet(KEYS.blacklist, []);
}

export function toggleBlacklist(foodId) {
  const current = getBlacklist();
  const next = current.includes(foodId)
    ? current.filter((id) => id !== foodId)
    : [...current, foodId];
  safeSet(KEYS.blacklist, next);
  return next;
}

export { KEYS };
