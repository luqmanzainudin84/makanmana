import { useState } from "react";
import SpinWheel from "./components/SpinWheel.jsx";
import { FOOD_OPTIONS } from "./data/foods.js";

export default function App() {
  const [mode, setMode] = useState(null); // null | 'solo' | 'group'
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  function handleBack() {
    setMode(null);
    setResult(null);
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
        </div>
      )}

      {mode === "solo" && (
        <div className="solo-screen">
          <button className="back-btn" onClick={handleBack}>
            ← Balik
          </button>

          <SpinWheel
            foods={FOOD_OPTIONS}
            spinning={spinning}
            setSpinning={setSpinning}
            onResult={setResult}
          />

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
    </div>
  );
}
