import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("Supabase Admin client initialized without URL or Service Key. Check environment variables.");
}

// 僅在伺服器端使用的 Admin Client，可繞過 RLS
export const supabaseAdmin = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder-service-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
