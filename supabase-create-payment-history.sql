
-- 1. 建立繳費紀錄表
CREATE TABLE IF NOT EXISTS public.payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- 使用者 UUID 或 LINE ID
  amount INTEGER NOT NULL, -- 正值為存入，負值為支出
  type TEXT NOT NULL, -- 'rental', 'activity', 'club_fee', 'topup'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 權限設定 (比照其他表，暫時關閉 RLS 以確保功能順利)
ALTER TABLE public.payment_history DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.payment_history TO anon, authenticated;

-- 3. 修正 users 表的 balance 預設值 (確保不會是 null)
ALTER TABLE public.users ALTER COLUMN balance SET DEFAULT 0;
UPDATE public.users SET balance = 0 WHERE balance IS NULL;
