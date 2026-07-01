import { supabase } from "./supabaseClient.js";

function generateRoomCode() {
  // 6-digit numeric, senang verbal share
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Host create session baru. Cuba beberapa kali kalau room code clash.
 */
export async function createSession(hostName, foodPool) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const roomCode = generateRoomCode();
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        id: roomCode,
        host_name: hostName,
        food_pool: foodPool,
        status: "lobby",
      })
      .select()
      .single();

    if (!error) {
      // Host terus jadi member pertama
      await joinSession(roomCode, hostName);
      return data;
    }
    // kalau error sebab id clash (primary key violation), cuba lagi dengan code baru
    if (error.code !== "23505") throw error;
  }
  throw new Error("Gagal generate room code unik, cuba lagi.");
}

export async function getSession(roomCode) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", roomCode)
    .single();
  if (error) throw error;
  return data;
}

export async function joinSession(roomCode, name) {
  const { data, error } = await supabase
    .from("members")
    .insert({ session_id: roomCode, name })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMembers(roomCode) {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("session_id", roomCode)
    .order("joined_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function castVote(memberId, foodId) {
  const { error } = await supabase
    .from("members")
    .update({ has_voted: true, vote_choice: foodId })
    .eq("id", memberId);
  if (error) throw error;
}

export async function setSessionStatus(roomCode, status) {
  const { error } = await supabase
    .from("sessions")
    .update({ status })
    .eq("id", roomCode);
  if (error) throw error;
}

/**
 * Subscribe realtime ke perubahan members dalam satu session.
 * @returns unsubscribe function
 */
export function subscribeMembers(roomCode, onChange) {
  const channel = supabase
    .channel(`members-${roomCode}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "members", filter: `session_id=eq.${roomCode}` },
      onChange
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}

export function subscribeSession(roomCode, onChange) {
  const channel = supabase
    .channel(`session-${roomCode}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "sessions", filter: `id=eq.${roomCode}` },
      onChange
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}
