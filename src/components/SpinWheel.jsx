import { useRef, useState } from "react";

const COLORS = ["#FFD600", "#FF6B00"]; // alternating yellow/orange slices
const SIZE = 320;
const CENTER = SIZE / 2;
const RADIUS = SIZE / 2 - 6;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSlice(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export default function SpinWheel({ foods, onResult, spinning, setSpinning }) {
  const wheelRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const sliceAngle = 360 / foods.length;

  function handleSpin() {
    if (spinning || foods.length === 0) return;
    setSpinning(true);

    const targetIndex = Math.floor(Math.random() * foods.length);
    // Slice i is centered at angle: i * sliceAngle. Pointer is at top (0deg).
    // We want targetIndex's slice to land at 0deg after spin.
    const targetSliceCenter = targetIndex * sliceAngle;
    const fullSpins = 5; // extra full rotations for visual effect
    const randomJitter = (Math.random() - 0.5) * (sliceAngle * 0.6);
    const finalRotation =
      rotation + fullSpins * 360 + (360 - targetSliceCenter) + randomJitter;

    setRotation(finalRotation);

    const wheelEl = wheelRef.current;
    function handleEnd() {
      wheelEl.removeEventListener("transitionend", handleEnd);
      setSpinning(false);
      onResult(foods[targetIndex]);
    }
    wheelEl.addEventListener("transitionend", handleEnd);
  }

  return (
    <div className="wheel-wrap">
      <div className="wheel-pointer">▼</div>
      <svg
        ref={wheelRef}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning
            ? "transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            : "none",
        }}
      >
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="var(--card)" stroke="var(--yellow-border)" strokeWidth="2" />
        {foods.map((food, i) => {
          const startAngle = i * sliceAngle;
          const endAngle = startAngle + sliceAngle;
          const midAngle = startAngle + sliceAngle / 2;
          const labelPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.62, midAngle);
          return (
            <g key={food.id}>
              <path
                d={describeSlice(CENTER, CENTER, RADIUS, startAngle, endAngle)}
                fill={COLORS[i % 2]}
                opacity={i % 2 === 0 ? 1 : 0.85}
                stroke="var(--bg)"
                strokeWidth="2"
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                fontSize="22"
                transform={`rotate(${midAngle}, ${labelPos.x}, ${labelPos.y})`}
              >
                {food.emoji}
              </text>
            </g>
          );
        })}
        <circle cx={CENTER} cy={CENTER} r={28} fill="var(--bg)" stroke="var(--yellow)" strokeWidth="3" />
      </svg>

      <button className="spin-btn" onClick={handleSpin} disabled={spinning}>
        {spinning ? "Pusing..." : "🎯 Spin!"}
      </button>
    </div>
  );
}
