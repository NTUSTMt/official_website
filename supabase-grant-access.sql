-- 開放給前端 (anon) 與登入用戶 (authenticated) 的存取權限
GRANT ALL ON TABLE public.users TO anon, authenticated;
GRANT ALL ON TABLE public.accounts TO anon, authenticated;

-- 關閉 RLS (Row Level Security)，允許前端 API 直接讀取
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;
