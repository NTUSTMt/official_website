-- 建立山岳足跡資料表
CREATE TABLE IF NOT EXISTS public.user_peaks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    peak_name text NOT NULL,
    elevation integer,
    climb_date text NOT NULL,
    note text,
    is_official boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 開啟 RLS
ALTER TABLE public.user_peaks ENABLE ROW LEVEL SECURITY;

-- 建立權限規範
CREATE POLICY "Users can view their own peaks" ON public.user_peaks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own peaks" ON public.user_peaks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own peaks" ON public.user_peaks
    FOR DELETE USING (auth.uid() = user_id);
