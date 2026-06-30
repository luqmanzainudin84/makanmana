import { useState } from "react";
import SpinWheel from "./components/SpinWheel.jsx";
import BlacklistPanel from "./components/BlacklistPanel.jsx";
import { FOOD_OPTIONS } from "./data/foods.js";
import { getBlacklist, toggleBlacklist } from "./utils/storage.js";

export default function App() {
  const [mode, setMode] = useState(null); // null | 'solo' | 'group'
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [blacklist, setBlacklist] = useState(() => getBlacklist());
  const [showBlacklist, setShowBlacklist] = useState(false);

  function handleBack() {
    setMode(null);
    setResult(null);
  }

  function handleToggleBlacklist(foodId) {
    const next = toggleBlacklist(foodId);
    setBlacklist(next);
  }

  const availableFoods = FOOD_OPTIONS.filter((f) => !blacklist.includes(f.id));

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

          {availableFoods.length === 0 ? (
            <p className="empty-state">
              Semua makanan dah masuk Tak Nak List! Buka senarai tu balik dan
              unblock sikit. 😅
            </p>
          ) : (
            <SpinWheel
              foods={availableFoods}
              spinning={spinning}
              setSpinning={setSpinning}
              onResult={setResult}
            />
          )}

          {result && (
            <div className="result-card">
              <span className="result-emoji">{result.emoji}</span>
              <h2>{result.name}</h2>
              <p className="result-meta">
                {result.type} · {result.price} · {result.time}
              </p>
            </div>
          )}
        </div>
      )}

      {mode === "group" && <div>Group mode — coming in Step 13</div>}

      {showBlacklist && (
        <BlacklistPanel
          foods={FOOD_OPTIONS}
          blacklist={blacklist}
          onToggle={handleToggleBlacklist}
          onClose={() => setShowBlacklist(false)}
        />
      )}
    </div>
  );
}
