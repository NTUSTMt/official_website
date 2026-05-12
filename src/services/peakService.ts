import { supabase } from "@/lib/supabase";

export interface UserPeak {
  id: string;
  user_id: string;
  peak_name: string;
  elevation?: number;
  climb_date: string;
  note?: string;
  is_official: boolean;
  created_at: string;
}

export const peakService = {
  async getUserPeaks(userId: string) {
    const { data, error } = await supabase
      .from("user_peaks")
      .select("*")
      .eq("user_id", userId)
      .order("climb_date", { ascending: false });

    if (error) {
      console.error("Error fetching user peaks:", error);
      return [];
    }
    return data as UserPeak[];
  },

  async addPeak(peak: Omit<UserPeak, "id" | "created_at">) {
    const { data, error } = await supabase
      .from("user_peaks")
      .insert(peak)
      .select()
      .single();

    if (error) throw error;
    return data as UserPeak;
  },

  async deletePeak(id: string) {
    const { error } = await supabase
      .from("user_peaks")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
};
