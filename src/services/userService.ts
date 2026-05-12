"use client";

import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  student_id?: string;
  real_name?: string;
  nickname?: string;
  avatar_url?: string;
  department?: string;
  phone?: string;
  email?: string;
  membership_status: 'unpaid' | 'active' | 'alumni' | 'external';
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  skills?: string[];
  balance: number;
  created_at: string;
}

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

export const userService = {
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return mapDatabaseToProfile(data);
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
    return data.map(mapDatabaseToProfile);
  },

  async updateUserVerification(id: string, isVerified: boolean) {
    const { error } = await supabase
      .from("users")
      .update({ membership_status: isVerified ? 'active' : 'unpaid' })
      .eq("id", id);

    if (error) throw error;
  },

  async getPublicProfile(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return mapDatabaseToProfile(data);
  },

  async getCurrentUser() {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (!session || !session.user) {
        return null;
      }

      const lineUserId = session.user.lineUserId;
      if (!lineUserId) return null;

      // 1. 透過 accounts 資料表找到對應的 userId
      const { data: accountData, error: accountError } = await supabase
        .from("accounts")
        .select("userId")
        .eq("provider", "line")
        .eq("providerAccountId", lineUserId)
        .single();

      if (accountError || !accountData) {
        console.error("Account not found:", accountError);
        return null;
      }

      // 2. 透過 userId 取得 users 的資料
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", accountData.userId)
        .single();

      if (userError || !userData) {
        console.error("User not found:", userError);
        return null;
      }
      
      return mapDatabaseToProfile(userData);
    } catch (err) {
      console.error("Failed to fetch current user session", err);
      return null;
    }
  },

  async updateProfile(id: string, updates: Partial<UserProfile>) {
    // 將前端欄位對應回資料庫的 users 欄位
    const dbUpdates: any = { ...updates };
    if (updates.real_name !== undefined) dbUpdates.name = updates.real_name;
    if (updates.avatar_url !== undefined) dbUpdates.image = updates.avatar_url;
    
    // 移除不應該直接更新到 users 的前端虛擬欄位 (避免 Supabase 報錯)
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
  }
};