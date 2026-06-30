import { useState } from "react";

export default function App() {
  const [mode, setMode] = useState(null); // null | 'solo' | 'group'

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

      {mode === "solo" && <div>Solo mode — coming in Step 3</div>}
      {mode === "group" && <div>Group mode — coming in Step 13</div>}
    </div>
  );
}
