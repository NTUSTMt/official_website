import { supabase } from "@/lib/supabase";
import { UserProfile } from "./userService";

export const memberService = {
  async getMembers() {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("student_id", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error);
      return [];
    }
    return data as UserProfile[];
  },

  async updateMember(id: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  },

  async updateBalance(id: string, amount: number) {
    const { data: current, error: fetchError } = await supabase
      .from("user_profiles")
      .select("balance")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const newBalance = (current?.balance || 0) + amount;

    const { data, error } = await supabase
      .from("user_profiles")
      .update({ balance: newBalance })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
