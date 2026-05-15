
-- 1. 新增 missing 欄位至 equipment 資料表
ALTER TABLE public.equipment 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. 修正欄位型別 (確保 pricing 是 JSONB)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment' AND column_name = 'pricing' AND data_type = 'text') THEN
        ALTER TABLE public.equipment ALTER COLUMN pricing TYPE JSONB USING pricing::JSONB;
    END IF;
END $$;

-- 3. 修正 rental_applications 資料表
-- 確保 id 有預設值 (UUID)
ALTER TABLE public.rental_applications ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 將 user_id 從 UUID 改為 TEXT，以相容 LINE ID (例如 Ua5fdb...)
ALTER TABLE public.rental_applications ALTER COLUMN user_id TYPE TEXT;

-- 新增 missing 欄位
ALTER TABLE public.rental_applications 
ADD COLUMN IF NOT EXISTS user_type TEXT,
ADD COLUMN IF NOT EXISTS is_club_event BOOLEAN,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 4. 開放權限
GRANT ALL ON TABLE public.equipment TO anon, authenticated;
GRANT ALL ON TABLE public.rental_applications TO anon, authenticated;

-- 5. 關閉 RLS
ALTER TABLE public.equipment DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_applications DISABLE ROW LEVEL SECURITY;

-- 6. 建立原子操作 Function (用於增減庫存)
CREATE OR REPLACE FUNCTION public.increment_available_qty(row_id TEXT, delta INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE public.equipment
  SET available_qty = available_qty + delta
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
 