import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase env vars tak set. Group mode takkan jalan sehingga VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY ditambah dalam .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
