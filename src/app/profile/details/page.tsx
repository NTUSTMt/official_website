"use client";

import React, { useState, useEffect } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { userService, UserProfile } from "@/services/userService";
import { Save, Edit2, X, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";

interface FieldProps {
  label: string;
  value: string;
  name: keyof UserProfile;
  placeholder?: string;
  isEditing: boolean;
  type?: string;
  options?: { label: string; value: string }[];
  formData: Partial<UserProfile>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<UserProfile>>>;
}

const Field = ({ label, value, name, placeholder, isEditing, type = "text", options, formData, setFormData }: FieldProps) => (
  <div className="py-4 md:py-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 group">
    <label className="text-[10px] font-mono text-muted uppercase tracking-[0.2em] md:w-48 group-hover:text-accent transition-colors">{label}</label>
    {isEditing ? (
      type === "select" ? (
        <select 
          value={formData[name] as string || ""}
          onChange={(e) => setFormData({...formData, [name]: e.target.value})}
          className="flex-1 max-w-md bg-surface border border-border px-6 py-3 rounded-2xl font-serif text-sm text-foreground outline-none focus:border-accent transition-all shadow-inner"
        >
          <option value="">請選擇</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input 
          type={type}
          placeholder={placeholder}
          value={formData[name] as string || ""}
          onChange={(e) => setFormData({...formData, [name]: e.target.value})}
          className="flex-1 max-w-md bg-surface border border-border px-6 py-3 rounded-2xl font-serif text-sm text-foreground outline-none focus:border-accent transition-all shadow-inner"
        />
      )
    ) : (
      <div className="flex-1 font-serif text-lg text-foreground/80">
        {type === "select" 
          ? options?.find(o => o.value === value)?.label || <span className="text-muted/30 italic">未選擇</span>
          : value || <span className="text-muted/30 italic">未填寫</span>
        }
      </div>
    )}
  </div>
);

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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-display italic mb-4">詳細資料 Details</h1>
            <p className="text-lg font-serif text-muted max-w-xl">
              完善資料有助於出隊保險與入園申請的自動化。您的資料將受到加密保護。
            </p>
          </div>
          <div className="flex gap-4">
            {isEditing && (
              <button 
                onClick={() => {
                  setFormData(user);
                  setIsEditing(false);
                }}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-mono text-[10px] uppercase tracking-widest bg-background border border-border hover:bg-muted/10 transition-all"
              >
                <X className="w-4 h-4" />
                CANCEL
              </button>
            )}
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-mono text-[10px] uppercase tracking-widest transition-all shadow-xl ${
                isEditing ? "bg-emerald-600 text-white shadow-emerald-200" : "bg-accent text-white shadow-accent/20 hover:brightness-110"
              }`}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  SAVE_CHANGES
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  EDIT_PROFILE
                </>
              )}
            </button>
          </div>
        </header>

        <div className="space-y-10 md:space-y-20">
          {/* 01: Basic Info */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-mono text-sm font-bold">01</div>
              <h3 className="font-mono text-[10px] text-muted uppercase tracking-[0.3em] font-bold">基本資料 Basic Info</h3>
              <div className="h-px flex-1 bg-border/50"></div>
            </div>
            <div className="bg-surface/30 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-10 border border-border/50">
              <Field label="真實姓名" value={user.real_name || ""} name="real_name" placeholder="與證件相同" isEditing={isEditing} formData={formData} setFormData={setFormData} />
              <Field 
                label="性別" 
                value={user.gender || ""} 
                name="gender" 
                type="select" 
                options={[
                  { label: "男 Male", value: "male" },
                  { label: "女 Female", value: "female" },
                  { label: "其他 Other", value: "other" }
                ]} 
                isEditing={isEditing} 
                formData={formData} 
                setFormData={setFormData} 
              />
              <Field label="出生年月日" value={user.birth_date || ""} name="birth_date" type="date" isEditing={isEditing} formData={formData} setFormData={setFormData} />
              <Field label="學號 / 單位" value={user.student_id || ""} name="student_id" placeholder="B112... 或 外部單位名稱" isEditing={isEditing} formData={formData} setFormData={setFormData} />
              <Field label="LINE ID" value={user.line_id || ""} name="line_id" placeholder="方便領隊聯繫" isEditing={isEditing} formData={formData} setFormData={setFormData} />
            </div>
          </section>

          {/* 02: Identity */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-mono text-sm font-bold">02</div>
              <h3 className="font-mono text-[10px] text-muted uppercase tracking-[0.3em] font-bold">身分驗證 Identity</h3>
              <div className="h-px flex-1 bg-border/50"></div>
            </div>
            <div className="bg-surface/30 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-10 border border-border/50">
              <Field 
                label="國籍與證件" 
                value={user.nationality_type || ""} 
                name="nationality_type" 
                type="select" 
                options={[
                  { label: "中華民國 (身分證)", value: "taiwanese" },
                  { label: "外籍人士 (護照/居留證)", value: "foreigner" }
                ]} 
                isEditing={isEditing} 
                formData={formData} 
                setFormData={setFormData} 
              />
              <Field label="證件號碼" value={user.id_number || ""} name="id_number" placeholder="身分證字號或護照號碼" isEditing={isEditing} formData={formData} setFormData={setFormData} />
            </div>
          </section>

          {/* 03: Contact */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-mono text-sm font-bold">03</div>
              <h3 className="font-mono text-[10px] text-muted uppercase tracking-[0.3em] font-bold">聯絡資訊 Contact</h3>
              <div className="h-px flex-1 bg-border/50"></div>
            </div>
            <div className="bg-surface/30 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-10 border border-border/50">
              <Field label="聯絡電話" value={user.phone || ""} name="phone" placeholder="09XX-XXX-XXX" isEditing={isEditing} formData={formData} setFormData={setFormData} />
              <Field label="聯絡信箱" value={user.email || ""} name="email" placeholder="example@mail.com" isEditing={isEditing} formData={formData} setFormData={setFormData} />
              <Field label="聯絡地址" value={user.address || ""} name="address" placeholder="詳細通訊地址" isEditing={isEditing} formData={formData} setFormData={setFormData} />
            </div>
          </section>

          {/* 04: Emergency */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-mono text-sm font-bold">04</div>
              <h3 className="font-mono text-[10px] text-muted uppercase tracking-[0.3em] font-bold">緊急聯絡 Emergency</h3>
              <div className="h-px flex-1 bg-border/50"></div>
            </div>
            <div className="bg-surface/30 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-10 border border-border/50">
              <Field label="聯絡人姓名" value={user.emergency_contact_name || ""} name="emergency_contact_name" placeholder="緊急聯絡人姓名" isEditing={isEditing} formData={formData} setFormData={setFormData} />
              <Field label="聯絡人電話" value={user.emergency_contact_phone || ""} name="emergency_contact_phone" placeholder="緊急聯絡人電話" isEditing={isEditing} formData={formData} setFormData={setFormData} />
              <Field label="關係" value={user.emergency_contact_relationship || ""} name="emergency_contact_relationship" placeholder="例如：父子、配偶" isEditing={isEditing} formData={formData} setFormData={setFormData} />
              <Field label="聯絡地址" value={user.emergency_contact_address || ""} name="emergency_contact_address" placeholder="緊急聯絡人地址" isEditing={isEditing} formData={formData} setFormData={setFormData} />
            </div>
          </section>
        </div>


        <footer className="mt-12 md:mt-24 p-6 md:p-10 bg-accent/5 rounded-[2rem] md:rounded-[2.5rem] border border-accent/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-accent" />
            <p className="text-xs font-serif text-muted leading-relaxed">
              您的資料加密存儲於 Supabase。僅用於活動報名保險及社務行政，非經同意絕不外洩。
            </p>
          </div>
        </footer>
      </div>
    </ProfileLayout>
  );
}
