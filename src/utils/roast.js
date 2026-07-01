const ROAST_LINES = [
  "{food} lagi? Korang memang tak kreatif. 😂",
  "Wah, {food} lagi ke? Lidah dah hafal jalan ke kedai tu kot.",
  "Confirm ni bukan AI rosak — memang korang yang asyik {food} je.",
  "{food}... lagi. Takpe, kami tak judge. Banyak sangat pun.",
  "Spin wheel pun dah malas nak bagi pilihan baru kat korang.",
  "Routine sangat dah ni. {food} jadi default hidup korang ke?",
];

const NO_ROAST = null;

/**
 * @param {object} food - hasil spin
 * @param {number} recentCount - berapa kali food ni muncul dalam N hari kebelakangan
 * @returns {string|null} caption roast, atau null kalau tak perlu roast
 */
export function getRoastCaption(food, recentCount) {
  if (recentCount < 2) return NO_ROAST; // baru sekali/jarang — tak payah roast
  const line = ROAST_LINES[Math.floor(Math.random() * ROAST_LINES.length)];
  return line.replace("{food}", food.name);
}
