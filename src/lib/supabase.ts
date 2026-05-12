import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 使用 placeholder 避免 Build 時因缺少環境變數而 crash
// 真實的環境變數必須在 Vercel Dashboard 中設定
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

// 用來判斷 Supabase 是否真的有設定好
export const isSupabaseConfigured =
  !!supabaseUrl && supabaseUrl !== "https://placeholder.supabase.co" &&
  !!supabaseAnonKey && supabaseAnonKey !== "placeholder-anon-key";
