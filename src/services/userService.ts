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
    // In a real app, this would get the ID from session/auth
    // For now, we'll try to get the first profile or a saved ID
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .limit(1)
      .single();

    if (error) return null;
    return data as UserProfile;
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
