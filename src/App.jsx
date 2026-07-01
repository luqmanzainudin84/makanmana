import { useState } from "react";
import SpinWheel from "./components/SpinWheel.jsx";
import BlacklistPanel from "./components/BlacklistPanel.jsx";
import GroupMode from "./components/GroupMode.jsx";
import { FOOD_OPTIONS } from "./data/foods.js";
import {
  getBlacklist,
  toggleBlacklist,
  getYesterdayFoodIds,
  addHistoryEntry,
  getStreak,
  bumpStreak,
  evaluateBadges,
  getRecentFoodCount,
} from "./utils/storage.js";
import { getRoastCaption } from "./utils/roast.js";

export default function App() {
  const [mode, setMode] = useState(null); // null | 'solo' | 'group'
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [blacklist, setBlacklist] = useState(() => getBlacklist());
  const [showBlacklist, setShowBlacklist] = useState(false);
  const [avoidYesterday, setAvoidYesterday] = useState(true);
  const [streak, setStreak] = useState(() => getStreak());
  const [newBadge, setNewBadge] = useState(null);
  const [roast, setRoast] = useState(null);

  function handleBack() {
    setMode(null);
    setResult(null);
  }

  function handleToggleBlacklist(foodId) {
    const next = toggleBlacklist(foodId);
    setBlacklist(next);
  }

  function handleResult(food) {
    const recentCount = getRecentFoodCount(food.id, 7);
    setResult(food);
    setRoast(getRoastCaption(food, recentCount));
    addHistoryEntry(food.id);
    const nextStreak = bumpStreak();
    setStreak(nextStreak);

    const { newlyEarned } = evaluateBadges();
    if (newlyEarned.length > 0) {
      setNewBadge(newlyEarned[0]);
      setTimeout(() => setNewBadge(null), 3500);
    }
  }

  const yesterdayIds = avoidYesterday ? getYesterdayFoodIds() : [];

  let availableFoods = FOOD_OPTIONS.filter((f) => !blacklist.includes(f.id));
  const beforeYesterdayFilter = availableFoods;
  if (avoidYesterday) {
    const filtered = availableFoods.filter((f) => !yesterdayIds.includes(f.id));
    if (filtered.length > 0) availableFoods = filtered;
  }

  return (
    <div className="app-shell">
      {!mode && (
        <div className="landing">
          <div>
            <h1 className="landing-title">MakanMana? 🍜</h1>
            <p className="landing-tagline">
              Selesai masalah paling annoying Malaysia sejak 1957.
            </p>
          </div>

          <div className="mode-buttons">
            <button className="mode-btn primary" onClick={() => setMode("solo")}>
              🎯 Solo — Sorang Je
            </button>
            <button className="mode-btn" onClick={() => setMode("group")}>
              👥 Group — Ramai-Ramai
            </button>
          </div>

          {streak.count > 0 && (
            <p className="streak-badge">🔥 Streak {streak.count} hari</p>
          )}
        </div>
      )}

      {mode === "solo" && (
        <div className="solo-screen">
          <div className="solo-topbar">
            <button className="back-btn" onClick={handleBack}>
              ← Balik
            </button>
            <button className="blacklist-trigger" onClick={() => setShowBlacklist(true)}>
              🙅 Tak Nak List {blacklist.length > 0 && `(${blacklist.length})`}
            </button>
          </div>

          <label className="avoid-toggle">
            <input
              type="checkbox"
              checked={avoidYesterday}
              onChange={(e) => setAvoidYesterday(e.target.checked)}
            />
            <span>Elak ulang makanan semalam</span>
          </label>

          {beforeYesterdayFilter.length === 0 ? (
            <p className="empty-state">
              Semua makanan dah masuk Tak Nak List! Buka senarai tu balik dan
              unblock sikit. 😅
            </p>
          ) : (
            <SpinWheel
              foods={availableFoods}
              spinning={spinning}
              setSpinning={setSpinning}
              onResult={handleResult}
            />
          )}

          {result && (
            <div className="result-card">
              <span className="result-emoji">{result.emoji}</span>
              <h2>{result.name}</h2>
              <p className="result-meta">
                {result.type} · {result.price} · {result.time}
              </p>
              {roast && <p className="roast-caption">{roast}</p>}
            </div>
          )}
        </div>
      )}

      {mode === "group" && <GroupMode onBack={handleBack} />}

      {showBlacklist && (
        <BlacklistPanel
          foods={FOOD_OPTIONS}
          blacklist={blacklist}
          onToggle={handleToggleBlacklist}
          onClose={() => setShowBlacklist(false)}
        />
      )}

      {newBadge && (
        <div className="badge-toast">
          <span className="badge-toast-icon">🏆</span>
          <div>
            <strong>{newBadge.label}</strong>
            <p>{newBadge.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}
