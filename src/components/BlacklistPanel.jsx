export default function BlacklistPanel({ foods, blacklist, onToggle, onClose }) {
  return (
    <div className="blacklist-overlay" onClick={onClose}>
      <div className="blacklist-panel" onClick={(e) => e.stopPropagation()}>
        <div className="blacklist-header">
          <h3>🙅 Tak Nak List</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <p className="blacklist-sub">Tandakan makanan yang tak nak masuk wheel.</p>

        <div className="blacklist-list">
          {foods.map((food) => {
            const isOut = blacklist.includes(food.id);
            return (
              <button
                key={food.id}
                className={`blacklist-item ${isOut ? "is-out" : ""}`}
                onClick={() => onToggle(food.id)}
              >
                <span className="blacklist-emoji">{food.emoji}</span>
                <span className="blacklist-name">{food.name}</span>
                <span className="blacklist-check">{isOut ? "🚫" : "✓"}</span>
              </button>
            );
          })}
        </div>

        <button className="mode-btn primary blacklist-done" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}
