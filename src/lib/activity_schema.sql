-- 1. 活動資料表
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY, -- 使用自定義 ID 或 UUID
  title TEXT NOT NULL,
  date_display TEXT NOT NULL,
  calendar_dates DATE[] NOT NULL,
  difficulty TEXT NOT NULL,
  cost TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- open, closed, upcoming
  cover_image TEXT,
  summary TEXT,
  registration_deadline DATE,
  description TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]',
  requirements TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  max_participants INTEGER DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 活動報名紀錄表
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  signup_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, waitlist
  payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, refunding
  note TEXT,
  UNIQUE(event_id, user_id) -- 防止重複報名
);

-- 3. RLS 政策
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- 任何人都可以查看活動
CREATE POLICY "Anyone can view events" ON events FOR SELECT USING (true);

-- 只有管理員可以編輯活動 (角色判斷請根據您資料庫中的 users 表)
CREATE POLICY "Admins can manage events" ON events FOR ALL 
USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));

-- 使用者可以查看自己的報名紀錄
CREATE POLICY "Users can view own registrations" ON event_registrations FOR SELECT 
USING (auth.uid() = user_id);

-- 登入使用者可以報名活動
CREATE POLICY "Users can register for events" ON event_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 管理員可以查看所有報名
CREATE POLICY "Admins can view all registrations" ON event_registrations FOR SELECT 
USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN'));
