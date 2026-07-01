import { useEffect, useState } from "react";
import { FOOD_OPTIONS } from "../data/foods.js";
import {
  createSession,
  joinSession,
  getSession,
  getMembers,
  subscribeMembers,
} from "../utils/groupSession.js";

export default function GroupMode({ onBack }) {
  const [stage, setStage] = useState("choose"); // choose | create-name | join-code | join-name | lobby
  const [name, setName] = useState("");
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [session, setSession] = useState(null);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stage !== "lobby" || !session) return;
    let active = true;

    getMembers(session.id).then((m) => active && setMembers(m));

    const unsubscribe = subscribeMembers(session.id, () => {
      getMembers(session.id).then((m) => active && setMembers(m));
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [stage, session]);

  async function handleCreateSession() {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      const newSession = await createSession(name.trim(), FOOD_OPTIONS);
      setSession(newSession);
      setStage("lobby");
    } catch (err) {
      setError("Gagal create session. Cuba lagi sekejap.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinSession() {
    if (!name.trim() || !roomCodeInput.trim()) return;
    setLoading(true);
    setError("");
    try {
      const found = await getSession(roomCodeInput.trim());
      await joinSession(found.id, name.trim());
      setSession(found);
      setStage("lobby");
    } catch (err) {
      setError("Room code tak jumpa. Check semula code tu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="solo-screen">
      <button className="back-btn" onClick={onBack}>
        ← Balik
      </button>

      {stage === "choose" && (
        <div className="mode-buttons">
          <button className="mode-btn primary" onClick={() => setStage("create-name")}>
            🆕 Buat Session
          </button>
          <button className="mode-btn" onClick={() => setStage("join-code")}>
            🔗 Join Session
          </button>
        </div>
      )}

      {stage === "create-name" && (
        <div className="form-stack">
          <h3>Nama awak?</h3>
          <input
            className="text-input"
            placeholder="cth. Amir"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="mode-btn primary" disabled={loading} onClick={handleCreateSession}>
            {loading ? "Tunggu..." : "Create Session"}
          </button>
          {error && <p className="form-error">{error}</p>}
        </div>
      )}

      {stage === "join-code" && (
        <div className="form-stack">
          <h3>Room code?</h3>
          <input
            className="text-input"
            placeholder="cth. 482913"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value)}
            inputMode="numeric"
          />
          <button className="mode-btn primary" onClick={() => setStage("join-name")} disabled={!roomCodeInput.trim()}>
            Seterusnya
          </button>
        </div>
      )}

      {stage === "join-name" && (
        <div className="form-stack">
          <h3>Nama awak?</h3>
          <input
            className="text-input"
            placeholder="cth. Siti"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="mode-btn primary" disabled={loading} onClick={handleJoinSession}>
            {loading ? "Tunggu..." : "Join Session"}
          </button>
          {error && <p className="form-error">{error}</p>}
        </div>
      )}

      {stage === "lobby" && session && (
        <div className="lobby-stack">
          <div className="room-code-card">
            <p>Room Code</p>
            <h2>{session.id}</h2>
            <p className="room-code-hint">Share code ni kat group anda</p>
          </div>

          <div className="member-list">
            <h3>Ahli ({members.length})</h3>
            {members.map((m) => (
              <div key={m.id} className="member-item">
                <span>👤 {m.name}</span>
                {m.id === members[0]?.id && <span className="host-tag">Host</span>}
              </div>
            ))}
          </div>

          <p className="empty-state">Voting flow — coming next step 🚧</p>
        </div>
      )}
    </div>
  );
}
