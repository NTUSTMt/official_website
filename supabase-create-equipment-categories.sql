-- Create equipment_categories table
CREATE TABLE IF NOT EXISTS equipment_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    emoji TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Initial migration: Insert existing unique categories from equipment table
INSERT INTO equipment_categories (name)
SELECT DISTINCT category FROM equipment
ON CONFLICT (name) DO NOTHING;

-- Update existing emojis if we have them (optional initial set)
UPDATE equipment_categories SET emoji = '🍳' WHERE name = '炊事系統';
UPDATE equipment_categories SET emoji = '⛺' WHERE name = '營帳系統';
UPDATE equipment_categories SET emoji = '🛌' WHERE name = '睡眠系統';
UPDATE equipment_categories SET emoji = '🎒' WHERE name = '行進裝備';
UPDATE equipment_categories SET emoji = '⛏️' WHERE name = '技術裝備';
