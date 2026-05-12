-- 1. 擴充 user_profiles 資料表
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS membership_status TEXT DEFAULT 'unpaid',
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS balance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'USER';

-- 2. 建立個人山岳紀錄資料表 user_peaks
CREATE TABLE IF NOT EXISTS user_peaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  peak_name TEXT NOT NULL,
  elevation INTEGER,
  climb_date DATE,
  note TEXT,
  is_official BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 設定 RLS (Row Level Security)
-- 讓使用者只能編輯自己的山岳紀錄
ALTER TABLE user_peaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own peaks" 
ON user_peaks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own peaks" 
ON user_peaks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own peaks" 
ON user_peaks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own peaks" 
ON user_peaks FOR DELETE 
USING (auth.uid() = user_id);

-- 管理員權限
CREATE POLICY "Admins can view all peaks" 
ON user_peaks FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'ADMIN'
));

CREATE POLICY "Admins can update all peaks" 
ON user_peaks FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'ADMIN'
));

CREATE POLICY "Admins can delete all peaks" 
ON user_peaks FOR DELETE
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'ADMIN'
));
