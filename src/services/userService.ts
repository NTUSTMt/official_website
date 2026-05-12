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

export const userService = {
  async getProfile(id: string) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as UserProfile;
  },

  async getAllUsers() {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all users:", error);
      return [];
    }
    return data;
  },

  async updateUserVerification(id: string, isVerified: boolean) {
    // This is for backward compatibility or future use
    const { error } = await supabase
      .from("user_profiles")
      .update({ membership_status: isVerified ? 'active' : 'unpaid' })
      .eq("id", id);

    if (error) throw error;
  },

  async getPublicProfile(id: string) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  },

  async getCurrentUser() {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      
      if (!session || !session.user || !session.user.email) {
        return null;
      }

      // 根據 email 或 lineUserId 從 public.users 取出詳細資料
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", session.user.email)
        .single();

      if (error) return null;
      
      // 將 public.users 的資料對應到 UserProfile 介面 (補上預設值避免報錯)
      return {
        id: data.id,
        real_name: data.name || "",
        email: data.email || "",
        avatar_url: data.image || "",
        membership_status: "unpaid", // 預設值，後續可從資料庫擴充
        balance: 0,
      } as UserProfile;
    } catch (err) {
      console.error("Failed to fetch current user session", err);
      return null;
    }
  },

  async updateProfile(id: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as UserProfile;
  }
};
