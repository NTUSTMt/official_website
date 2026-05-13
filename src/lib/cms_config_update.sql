-- ==========================================
-- 首頁內容 CMS 欄位同步腳本 (Supabase SQL)
-- 請在 Supabase SQL Editor 中執行以下指令
-- ==========================================

-- 1. 建立或更新 cms_config 資料表
CREATE TABLE IF NOT EXISTS cms_config (
    id TEXT PRIMARY KEY,
    site_name TEXT,
    hero_tagline TEXT,
    hero_subtext TEXT,
    stats JSONB,
    announcement JSONB,
    fees JSONB,
    office_hours TEXT,
    introduction TEXT,
    slogan TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 插入或更新初始資料 (確保欄位存在)
INSERT INTO cms_config (
    id, 
    site_name, 
    hero_tagline, 
    hero_subtext, 
    stats, 
    announcement, 
    fees, 
    office_hours, 
    introduction, 
    slogan
)
VALUES (
    'global_config',
    '台科大登山社',
    'EXPLORE THE UNKNOWN',
    '與我們一起探索台灣百岳的壯麗，挑戰自我，尋找群山中的歸屬感。',
    '{"expeditions": "450+", "members": "1200+", "years": "45+"}'::jsonb,
    '{"enabled": true, "text": "🔥 113學年度下學期新血招募說明會將於 2/25 舉辦，點此報名！", "link": "/events/recruitment-113"}'::jsonb,
    '{"membershipFee": 1500, "bankCode": "700", "bankName": "中華郵政", "accountNumber": "0001234-5678901"}'::jsonb,
    '週一至週五 18:30 - 21:00',
    '來山社，賞山色，與山為伴，與我們同樂\n\n----------\n\n台科大登山社於1979年創立至今，每學期開設大量精彩的登山戶外活動，為凝聚與傳承台科大登山人的交流天地，同時以專業領隊嚮導的培訓為目標!\n\n歡迎加入我們~ 來這裡跟我們一起上山、一起瘋享青春、一起創造精彩ㄉ大學生活!',
    '登山不是為了征服山，實是為了在山的懷抱中，學會謙卑與誠實'
) 
ON CONFLICT (id) DO UPDATE SET
    site_name = COALESCE(EXCLUDED.site_name, cms_config.site_name),
    hero_subtext = COALESCE(EXCLUDED.hero_subtext, cms_config.hero_subtext),
    introduction = COALESCE(EXCLUDED.introduction, cms_config.introduction),
    slogan = COALESCE(EXCLUDED.slogan, cms_config.slogan),
    updated_at = NOW();

-- 3. 設定 RLS (Row Level Security) - 任何人可讀，僅管理員可寫
ALTER TABLE cms_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view config" ON cms_config;
CREATE POLICY "Anyone can view config" ON cms_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update config" ON cms_config;
CREATE POLICY "Admins can update config" ON cms_config FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_profiles 
  WHERE id = auth.uid() AND role = 'ADMIN'
));
