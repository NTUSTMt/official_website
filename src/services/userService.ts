import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  real_name?: string;
  student_id?: string;
  phone?: string;
  department?: string;
  nickname?: string;
  avatar_url?: string;
  is_verified: boolean;
  role: "MEMBER" | "COMMITTEE" | "ADMIN";
  full_details?: any; // For emergency contacts, etc.
}

export const userService = {
  async getAllUsers() {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return [];
    }
    return data;
  },

  async updateUserVerification(id: string, is_verified: boolean) {
    const { error } = await supabase
      .from("user_profiles")
      .update({ is_verified })
      .eq("id", id);
    
    if (error) throw error;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  }
};
