"use client";

import React, { useState, useEffect } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { userService, UserProfile } from "@/services/userService";
import { Save, Edit2, X, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ProfileDetailsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await userService.getCurrentUser();
        if (profile) {
          setUser(profile);
          setFormData(profile);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    try {
      const updated = await userService.updateProfile(user.id, formData);
      setUser(updated);
      setIsEditing(false);
    } catch (err) {
      alert("儲存失敗");
    }
  };

  const Field = ({ label, value, name, placeholder }: { label: string, value: string, name: keyof UserProfile, placeholder?: string }) => (
    <div className="py-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
      <label className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] md:w-48 group-hover:text-accent transition-colors">{label}</label>
      {isEditing ? (
        <input 
          type="text"
          placeholder={placeholder}
          value={formData[name] as string || ""}
          onChange={(e) => setFormData({...formData, [name]: e.target.value})}
          className="flex-1 max-w-md bg-surface border border-border px-6 py-3 rounded-2xl font-serif text-sm text-foreground outline-none focus:border-accent transition-all shadow-inner"
        />
      ) : (
        <div className="flex-1 font-serif text-lg text-foreground/80">{value || <span className="text-muted/30 italic">未填寫</span>}</div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="p-20 text-center font-mono animate-pulse text-xs tracking-widest text-muted">
          FETCHING_PROFILE_METADATA...
        </div>
      </ProfileLayout>
    );
  }

  if (!user) {
    return (
      <ProfileLayout>
        <div className="p-20 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center font-serif text-muted italic mb-8">
            無法載入個人資料，請嘗試登入。
          </div>
          <Link 
            href="/login" 
            className="px-10 py-4 bg-accent text-white rounded-2xl font-mono text-[10px] uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all shadow-xl shadow-accent/20"
          >
            Go_to_Login
          </Link>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-display italic mb-4">詳細資料</h1>
            <p className="text-lg font-serif text-muted max-w-xl">
              完善資料有助於出隊保險與入園申請的自動化。您的資料將受到加密保護。
            </p>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-mono text-[10px] uppercase tracking-widest transition-all shadow-xl ${
              isEditing ? "bg-emerald-600 text-white shadow-emerald-200" : "bg-surface border border-border hover:border-accent hover:shadow-accent/10"
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4" />
                SAVE_AND_SYNC
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                EDIT_PROFILE
              </>
            )}
          </button>
        </header>

        <div className="space-y-16">
          {/* Basic Personal Info */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border/50"></div>
              <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.3em]">Personal_Info</div>
              <div className="h-px flex-1 bg-border/50"></div>
            </div>
            <div className="bg-surface/30 rounded-[2.5rem] p-4 md:p-10 border border-border/50">
              <Field label="真實姓名" value={user.real_name || ""} name="real_name" placeholder="請輸入證件姓名" />
              <Field label="學號 / 單位" value={user.student_id || ""} name="student_id" placeholder="110XXXXX" />
              <Field label="系所" value={user.department || ""} name="department" placeholder="例如：資工系" />
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border/50"></div>
              <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.3em]">Contact_Details</div>
              <div className="h-px flex-1 bg-border/50"></div>
            </div>
            <div className="bg-surface/30 rounded-[2.5rem] p-4 md:p-10 border border-border/50">
              <Field label="聯絡電話" value={user.phone || ""} name="phone" placeholder="09XX-XXX-XXX" />
              <Field label="聯絡信箱" value={user.email || ""} name="email" placeholder="example@mail.com" />
            </div>
          </section>

          {/* Emergency Contact */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-border/50"></div>
              <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.3em]">Emergency_Contact</div>
              <div className="h-px flex-1 bg-border/50"></div>
            </div>
            <div className="bg-surface/30 rounded-[2.5rem] p-4 md:p-10 border border-border/50">
              <Field label="聯絡人姓名" value={user.emergency_contact_name || ""} name="emergency_contact_name" />
              <Field label="聯絡人電話" value={user.emergency_contact_phone || ""} name="emergency_contact_phone" />
            </div>
          </section>
        </div>

        <footer className="mt-24 p-10 bg-accent/5 rounded-[2.5rem] border border-accent/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <p className="text-xs font-serif text-muted leading-relaxed">
              您的資料加密存儲於 Supabase。僅用於活動報名保險及社務行政，非經同意絕不外洩。
            </p>
          </div>
          <div className="text-[10px] font-mono text-muted/40 uppercase tracking-widest whitespace-nowrap">
            SECURE_ENCRYPTION_ACTIVE
          </div>
        </footer>
      </div>
    </ProfileLayout>
  );
}
