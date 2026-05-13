"use client";

import React, { useState } from "react";
import { X, User, Phone, ShieldAlert, MessageSquare, CheckCircle2 } from "lucide-react";
import { EventItem } from "@/data/events";
import { registrationService } from "@/services/eventService";
import { userService } from "@/services/userService";

interface RegistrationModalProps {
  event: EventItem;
  user: any; // User profile data
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegistrationModal({ event, user, onClose, onSuccess }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    real_name: user.real_name || "",
    gender: user.gender || "",
    birth_date: user.birth_date || "",
    nationality_type: user.nationality_type || "taiwanese",
    id_number: user.id_number || "",
    line_id: user.line_id || "",
    phone: user.phone || "",
    email: user.email || "",
    address: user.address || "",
    emergency_contact_name: user.emergency_contact_name || "",
    emergency_contact_phone: user.emergency_contact_phone || "",
    emergency_contact_relationship: user.emergency_contact_relationship || "",
    emergency_contact_address: user.emergency_contact_address || "",
    student_id: user.student_id || "",
  });
  const [note, setNote] = useState("");
  const [shouldUpdateProfile, setShouldUpdateProfile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // 1. Optional: Update user profile if checkbox is checked
      if (shouldUpdateProfile) {
        await userService.updateProfile(user.id, {
          ...formData
        } as any);
      }

      // 2. Submit registration
      // We pass the full formData to the registration service to ensure insurance data is captured
      await registrationService.registerForEvent(event.id, user.id, note, formData);
      
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || "報名失敗，請稍後再試。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-surface w-full max-w-md p-12 rounded-[3rem] border border-emerald-500/20 shadow-2xl text-center">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-3xl font-display italic mb-4">報名成功！</h3>
          <p className="text-muted font-serif">您的報名資料已送出，請靜候幹部審核。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface w-full max-w-3xl rounded-[3rem] border border-border shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-muted hover:text-foreground transition-colors z-20 bg-surface/80 backdrop-blur-md rounded-full border border-border"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 md:p-12">
          <header className="mb-10">
            <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em] block mb-2 font-bold">Insurance & Registration</span>
            <h2 className="text-3xl font-display italic text-foreground leading-tight">
              確認報名資料
            </h2>
            <p className="text-xs font-serif text-muted mt-2">依據保險及出隊規範，請確實填寫以下完整資訊。</p>
            <div className="h-1 w-12 bg-accent mt-6"></div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Section 1: Basic Info */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-mono text-xs">01</div>
                <h3 className="font-mono text-[10px] text-muted uppercase tracking-widest font-bold">基本資料 Basic Info</h3>
                <div className="h-px bg-border flex-1"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">姓名 Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.real_name}
                    onChange={(e) => setFormData({...formData, real_name: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">性別 Gender</label>
                  <select 
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  >
                    <option value="">請選擇</option>
                    <option value="male">男 Male</option>
                    <option value="female">女 Female</option>
                    <option value="other">其他 Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">出生年月日 DOB</label>
                  <input 
                    required
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">學號 / 單位 Student ID / Org</label>
                  <input 
                    required
                    type="text"
                    value={formData.student_id}
                    onChange={(e) => setFormData({...formData, student_id: e.target.value})}
                    placeholder="B112... 或 所屬公司"
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">LINE ID</label>
                  <input 
                    required
                    type="text"
                    value={formData.line_id}
                    onChange={(e) => setFormData({...formData, line_id: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Identity */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-mono text-xs">02</div>
                <h3 className="font-mono text-[10px] text-muted uppercase tracking-widest font-bold">身分驗證 Identity</h3>
                <div className="h-px bg-border flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">國籍與證件 Nationality</label>
                  <select 
                    required
                    value={formData.nationality_type}
                    onChange={(e) => setFormData({...formData, nationality_type: e.target.value as any})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  >
                    <option value="taiwanese">中華民國 (身分證)</option>
                    <option value="foreigner">外籍人士 (護照/居留證)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">證件號碼 ID Number</label>
                  <input 
                    required
                    type="text"
                    value={formData.id_number}
                    onChange={(e) => setFormData({...formData, id_number: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Contact */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-mono text-xs">03</div>
                <h3 className="font-mono text-[10px] text-muted uppercase tracking-widest font-bold">聯絡資訊 Contact</h3>
                <div className="h-px bg-border flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">聯絡電話 Phone</label>
                  <input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">聯絡信箱 Email</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">聯絡地址 Address</label>
                <input 
                  required
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="詳細居住地址"
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                />
              </div>
            </section>

            {/* Section 4: Emergency Contact */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-mono text-xs">04</div>
                <h3 className="font-mono text-[10px] text-muted uppercase tracking-widest font-bold">緊急聯絡人 Emergency Contact</h3>
                <div className="h-px bg-border flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">姓名 Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">電話 Phone</label>
                  <input 
                    required
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">關係 Relationship</label>
                  <input 
                    required
                    type="text"
                    value={formData.emergency_contact_relationship}
                    onChange={(e) => setFormData({...formData, emergency_contact_relationship: e.target.value})}
                    placeholder="父母、配偶..."
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-mono text-muted uppercase tracking-widest ml-2">聯絡地址 Address</label>
                <input 
                  required
                  type="text"
                  value={formData.emergency_contact_address}
                  onChange={(e) => setFormData({...formData, emergency_contact_address: e.target.value})}
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-accent transition-all font-serif"
                />
              </div>
            </section>

            {/* Note */}
            <section className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-mono text-xs">05</div>
                <h3 className="font-mono text-[10px] text-muted uppercase tracking-widest font-bold">其他備註 Notes</h3>
                <div className="h-px bg-border flex-1"></div>
              </div>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例如：飲食禁忌、特殊病史..."
                className="w-full bg-background border border-border rounded-xl p-4 text-sm min-h-[100px] outline-none focus:border-accent transition-all font-serif"
              />
            </section>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center rounded-xl uppercase tracking-widest">
                [Error]: {error}
              </div>
            )}

            <div className="pt-8 flex flex-col gap-6">
              <label className="flex items-center gap-3 cursor-pointer group px-4">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={shouldUpdateProfile}
                    onChange={(e) => setShouldUpdateProfile(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-border rounded-lg peer-checked:bg-accent peer-checked:border-accent transition-all"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                    <CheckCircle2 className="w-3 h-3" strokeWidth={4} />
                  </div>
                </div>
                <span className="text-[10px] font-mono text-muted uppercase tracking-[0.1em] group-hover:text-accent transition-colors font-bold">
                  同時將修改後的資料同步更新至「個人資料」
                </span>
              </label>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 bg-foreground text-background rounded-full font-mono text-xs uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-foreground/10"
              >
                {isSubmitting ? "PROCESSING..." : "CONFIRM_AND_SUBMIT"}
              </button>
              
              <p className="text-center text-[9px] font-mono text-muted uppercase tracking-widest">
                送出即代表同意社團安全規範與個人資料收集協議
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
