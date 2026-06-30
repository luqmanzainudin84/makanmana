// Senarai makanan starting list — boleh expand nanti
export const FOOD_OPTIONS = [
  { id: "nasi-lemak", name: "Nasi Lemak", emoji: "🍛", type: "Melayu", price: "RM 5–12", time: "5 min" },
  { id: "ckt", name: "Char Kuey Teow", emoji: "🍜", type: "Cina", price: "RM 7–10", time: "8 min" },
  { id: "roti-canai", name: "Roti Canai", emoji: "🫓", type: "Mamak", price: "RM 2–5", time: "3 min" },
  { id: "nasi-ayam", name: "Nasi Ayam", emoji: "🍗", type: "Cina", price: "RM 8–12", time: "5 min" },
  { id: "laksa", name: "Laksa", emoji: "🍲", type: "Melayu", price: "RM 8–15", time: "10 min" },
  { id: "wantan-mee", name: "Wantan Mee", emoji: "🍝", type: "Cina", price: "RM 7–9", time: "7 min" },
  { id: "mee-goreng", name: "Mee Goreng", emoji: "🍜", type: "Mamak", price: "RM 6–8", time: "6 min" },
  { id: "nasi-campur", name: "Nasi Campur", emoji: "🍱", type: "Melayu", price: "RM 7–12", time: "5 min" },
];

export const MOOD_FILTERS = ["Semua", "Melayu", "Cina", "Mamak", "Jimat", "Laju"];

export function filterByMood(foods, mood) {
  if (mood === "Semua") return foods;
  if (mood === "Jimat") {
    // Jimat = harga minimum bawah RM 6
    return foods.filter((f) => {
      const min = parseInt(f.price.match(/\d+/)[0], 10);
      return min <= 6;
    });
  }
  if (mood === "Laju") {
    // Laju = masa bawah 6 min
    return foods.filter((f) => parseInt(f.time, 10) <= 6);
  }
  return foods.filter((f) => f.type === mood);
}
