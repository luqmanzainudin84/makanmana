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

// ---- History (untuk "Elak ulang semalam") ----
function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function getHistory() {
  return safeGet(KEYS.history, []); // [{ date: 'YYYY-MM-DD', foodId }]
}

export function addHistoryEntry(foodId) {
  const history = getHistory();
  const next = [...history, { date: todayStr(), foodId }].slice(-100); // keep last 100
  safeSet(KEYS.history, next);
  return next;
}

export function getYesterdayFoodIds() {
  const history = getHistory();
  const y = yesterdayStr();
  return [...new Set(history.filter((h) => h.date === y).map((h) => h.foodId))];
}

// Berapa kali makanan ni muncul dalam N hari kebelakangan (termasuk hari ni)
export function getRecentFoodCount(foodId, days = 7) {
  const history = getHistory();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return history.filter((h) => h.foodId === foodId && new Date(h.date) >= cutoff).length;
}

// ---- Streak ----
export function getStreak() {
  return safeGet(KEYS.streak, { count: 0, lastDate: null });
}

export function bumpStreak() {
  const streak = getStreak();
  const today = todayStr();
  const yest = yesterdayStr();

  if (streak.lastDate === today) {
    return streak; // dah spin hari ni, takyah ubah
  }

  let count;
  if (streak.lastDate === yest) {
    count = streak.count + 1; // sambung streak
  } else {
    count = 1; // streak reset / mula baru
  }

  const next = { count, lastDate: today };
  safeSet(KEYS.streak, next);
  return next;
}

// ---- Badges ----
const BADGE_DEFS = [
  {
    id: "explorer-20",
    label: "Penjelajah Rasa",
    desc: "Cuba 20 jenis makanan berbeza",
    check: ({ uniqueFoodCount }) => uniqueFoodCount >= 20,
  },
  {
    id: "night-owl",
    label: "Burung Hantu Lapar",
    desc: "Spin lepas pukul 11 malam",
    check: ({ hour }) => hour >= 23 || hour < 4,
  },
  {
    id: "streak-3",
    label: "Konsisten",
    desc: "Streak 3 hari berturut-turut",
    check: ({ streakCount }) => streakCount >= 3,
  },
  {
    id: "streak-7",
    label: "Seminggu Penuh",
    desc: "Streak 7 hari berturut-turut",
    check: ({ streakCount }) => streakCount >= 7,
  },
];

export function getBadges() {
  return safeGet(KEYS.badges, []);
}

export function evaluateBadges() {
  const history = getHistory();
  const uniqueFoodCount = new Set(history.map((h) => h.foodId)).size;
  const hour = new Date().getHours();
  const streakCount = getStreak().count;

  const earned = getBadges();
  const earnedIds = new Set(earned.map((b) => b.id));
  const newlyEarned = [];

  for (const def of BADGE_DEFS) {
    if (earnedIds.has(def.id)) continue;
    if (def.check({ uniqueFoodCount, hour, streakCount })) {
      newlyEarned.push({ id: def.id, label: def.label, desc: def.desc, earnedAt: todayStr() });
    }
  }

  if (newlyEarned.length > 0) {
    const next = [...earned, ...newlyEarned];
    safeSet(KEYS.badges, next);
    return { all: next, newlyEarned };
  }

  return { all: earned, newlyEarned: [] };
}
