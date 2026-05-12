import { supabase } from "@/lib/supabase";
import { UserProfile } from "./userService";

// 輔助函數：將資料庫的 users 資料轉為前端的 UserProfile 格式
const mapDatabaseToProfile = (data: any): UserProfile => {
  return {
    ...data,
    real_name: data.name || data.real_name,
    avatar_url: data.image || data.avatar_url,
    membership_status: data.membership_status || 'unpaid',
    balance: data.balance || 0,
  };
};

export const memberService = {
  async getMembers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("student_id", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error);
      return [];
    }
    return data.map(mapDatabaseToProfile);
  },

  async updateMember(id: string, updates: Partial<UserProfile>) {
    const dbUpdates: any = { ...updates };
    if (updates.real_name !== undefined) dbUpdates.name = updates.real_name;
    if (updates.avatar_url !== undefined) dbUpdates.image = updates.avatar_url;
    delete dbUpdates.real_name;
    delete dbUpdates.avatar_url;

    const { data, error } = await supabase
      .from("users")
      .update(dbUpdates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapDatabaseToProfile(data);
  },

  async updateBalance(id: string, amount: number) {
    const { data: current, error: fetchError } = await supabase
      .from("users")
      .select("balance")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const newBalance = (current?.balance || 0) + amount;

    const { data, error } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapDatabaseToProfile(data);
  }
};
