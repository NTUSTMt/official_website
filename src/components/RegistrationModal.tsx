"use client";

import React, { useState } from "react";
import { X, User, Phone, ShieldAlert, MessageSquare, CheckCircle2 } from "lucide-react";
import { EventItem } from "@/data/events";
import { registrationService } from "@/services/eventService";

interface RegistrationModalProps {
  event: EventItem;
  user: any; // User profile data
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegistrationModal({ event, user, onClose, onSuccess }: RegistrationModalProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await registrationService.registerForEvent(event.id, user.id, note);
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
      <div className="bg-surface w-full max-w-xl rounded-[3rem] border border-border shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-muted hover:text-foreground transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-10 md:p-12">
          <header className="mb-10">
            <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em] block mb-2 font-bold">Activity Registration</span>
            <h2 className="text-3xl font-display italic text-foreground leading-tight">
              報名活動：{event.title}
            </h2>
            <div className="h-1 w-12 bg-accent mt-6"></div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* User Info Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-background border border-border rounded-2xl space-y-4">
                <div className="flex items-center gap-3 text-muted">
                  <User className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">報名者</span>
                </div>
                <div className="text-lg font-serif">{user.real_name || "未填寫姓名"}</div>
              </div>

              <div className="p-6 bg-background border border-border rounded-2xl space-y-4">
                <div className="flex items-center gap-3 text-muted">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">緊急聯絡人</span>
                </div>
                <div className="text-lg font-serif">
                  {user.emergency_contact_name ? (
                    <div className="flex flex-col">
                      <span>{user.emergency_contact_name}</span>
                      <span className="text-xs text-muted/60">{user.emergency_contact_phone}</span>
                    </div>
                  ) : (
                    <span className="text-red-500 text-sm">請至個人檔案補填資料</span>
                  )}
                </div>
              </div>
            </div>

            {/* Note Field */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-mono text-muted uppercase tracking-widest ml-2">
                <MessageSquare className="w-3 h-3" />
                備註訊息 (Optional)
              </label>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="例如：飲食禁忌、特殊病史或其他想對領隊說的話..."
                className="w-full bg-background border border-border rounded-2xl p-6 text-sm min-h-[120px] outline-none focus:border-accent transition-all font-serif"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono text-center rounded-xl uppercase tracking-widest">
                [Error]: {error}
              </div>
            )}

            <div className="pt-4 flex flex-col gap-4">
              <button 
                type="submit"
                disabled={isSubmitting || !user.emergency_contact_name}
                className="w-full py-5 bg-foreground text-background rounded-full font-mono text-xs uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-foreground/10"
              >
                {isSubmitting ? "PROCESSING..." : "CONFIRM_REGISTRATION"}
              </button>
              <p className="text-center text-[9px] font-mono text-muted uppercase tracking-widest">
                By confirming, you agree to follow the club safety guidelines.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
