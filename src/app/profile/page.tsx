"use client";

import React, { useState, useEffect } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { userService, UserProfile } from "@/services/userService";
import { useTranslation } from "@/context/LanguageContext";
import { peakService } from "@/services/peakService";
import Link from "next/link";
import { Shield, Award, Calendar, Package, ChevronRight, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recentPeaks, setRecentPeaks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await userService.getCurrentUser();
        if (profile) {
          setUser(profile);
          const peaks = await peakService.getUserPeaks(profile.id);
          setRecentPeaks(peaks.slice(0, 3));
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="p-20 text-center font-mono animate-pulse text-xs tracking-widest text-muted">
          SYNCHRONIZING_PERSONAL_DATA...
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
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 mb-8 md:mb-16">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-accent rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-accent/5 border-4 border-white shadow-xl relative z-10 flex items-center justify-center overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.real_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-20 h-20 md:w-28 md:h-28 text-accent" />
                )}
              </div>
              <div className="absolute -bottom-2 right-4 z-20 px-3 py-1 bg-white border border-border rounded-full text-[9px] font-mono font-bold uppercase tracking-widest shadow-sm">
                {user.membership_status}
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="font-mono text-[10px] text-accent mb-3 font-bold tracking-[0.3em] uppercase">
                ID: {user.student_id || "ID_PENDING"}
              </div>
               <h1 className="text-3xl md:text-5xl font-display italic mb-4 md:mb-6">{user.real_name || user.nickname || "神秘社員"}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4 md:mb-6">
                {user.skills?.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-accent/5 text-accent border border-accent/10 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-3 px-6 py-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-2xl font-mono text-[10px] uppercase tracking-widest font-bold transition-all"
          >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            登出 Sign Out
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Peaks */}
          <div className="p-6 md:p-10 bg-background border border-border rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-display italic">近期足跡</h3>
              </div>
              <div className="space-y-6">
                {recentPeaks.length > 0 ? (
                  recentPeaks.map((peak, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div>
                        <div className="text-sm font-serif font-bold">{peak.peak_name}</div>
                        <div className="text-[10px] font-mono text-muted/60 uppercase">{peak.climb_date}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted/20 group-hover:text-accent transition-colors" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-serif text-muted italic">目前無山岳紀錄。</p>
                )}
              </div>
            </div>
            <Link href="/profile/footprints" className="mt-10 font-mono text-[10px] uppercase tracking-widest text-accent hover:underline flex items-center gap-2">
              查看全部紀錄 <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Account Status */}
          <div className="p-6 md:p-10 bg-background border border-border rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-display italic">{t('profile.status')}</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center group cursor-pointer hover:bg-accent/5 p-2 -m-2 rounded-xl transition-colors" onClick={() => window.location.href='/profile/payments'}>
                  <span className="text-sm font-serif text-muted">{t('profile.balance')}</span>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-sm font-bold ${user.balance < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                      ${user.balance}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted/20 group-hover:text-accent transition-colors" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-serif text-muted">{t('profile.membership')}</span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-1 bg-accent/5 rounded border border-accent/10">
                    {user.membership_status}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/profile/payments" className="mt-10 font-mono text-[10px] uppercase tracking-widest text-accent hover:underline flex items-center gap-2">
              查看繳費紀錄 <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </ProfileLayout>
  );
}
