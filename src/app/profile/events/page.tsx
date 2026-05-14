"use client";
import React, { useState, useEffect } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { registrationService } from "@/services/eventService";
import { userService, UserProfile } from "@/services/userService";
import Link from "next/link";

export default function ExpeditionRecordsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await userService.getCurrentUser();
        if (profile) {
          setUser(profile);
          const data = await registrationService.getUserRegistrations(profile.id);
          setRegistrations(data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const currentEvents = registrations.filter(e => e.status !== "COMPLETED");
  const pastEvents = registrations.filter(e => e.status === "COMPLETED");

  const RecordCard = ({ exp }: { exp: any }) => (
    <div className="group p-6 md:p-8 bg-background border border-border rounded-[2rem] md:rounded-[2.5rem] hover:border-accent transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <span className={`text-[9px] font-mono px-3 py-1.5 rounded-full border tracking-widest font-bold uppercase ${
          exp.status === 'pending' ? "border-amber-500/20 text-amber-600 bg-amber-50/50" :
          exp.status === 'approved' ? "border-emerald-500/20 text-emerald-600 bg-emerald-50/50" :
          exp.status === 'rejected' ? "border-red-500/20 text-red-600 bg-red-50/50" :
          "border-muted/20 text-muted bg-surface"
        }`}>
          {exp.status === 'pending' ? '審核中 PENDING' : 
           exp.status === 'approved' ? '已錄取 ADMITTED' :
           exp.status === 'rejected' ? '未錄取 REJECTED' : exp.status}
        </span>
        <span className="text-[10px] font-mono text-muted/40 uppercase tracking-widest">
          {new Date(exp.signup_date).toLocaleDateString()}
        </span>
      </div>
      
      <h3 className="text-2xl font-display italic mb-4 group-hover:text-accent transition-colors">
        {exp.events?.title || "未知活動"}
      </h3>
      
      <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border/50">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-muted/60 uppercase tracking-widest">Payment</span>
          <span className={`text-sm font-serif ${exp.payment_status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
            {exp.payment_status === 'paid' ? '已繳費 PAID' : '未繳費 UNPAID'}
          </span>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="p-20 text-center font-mono animate-pulse text-xs tracking-widest text-muted">
          RETRIEVING_EXPEDITION_DATA...
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
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-display italic mb-4 md:mb-6">出團紀錄</h1>
          <p className="text-base md:text-lg font-serif text-muted">
            記錄您在社團中參加過的每一場冒險與報名進度。
          </p>
        </header>

        <section className="mb-10 md:mb-16">
          <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.2em] mb-6 md:mb-8">Active_Expeditions</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentEvents.length > 0 ? (
              currentEvents.map(exp => <RecordCard key={exp.id} exp={exp} />)
            ) : (
              <p className="text-sm font-serif text-muted italic">目前無進行中的報名或計畫。</p>
            )}
          </div>
        </section>

        <section>
          <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.2em] mb-6 md:mb-8">Past_Footprints</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.length > 0 ? (
              pastEvents.map(exp => <RecordCard key={exp.id} exp={exp} />)
            ) : (
              <p className="text-sm font-serif text-muted italic">尚未有已完成的行程紀錄。</p>
            )}
          </div>
        </section>

        <footer className="mt-20 py-10 border-t border-border text-center">
          <p className="font-mono text-[10px] text-muted/30 uppercase tracking-[0.4em]">
            Keep Exploring the Unknown
          </p>
        </footer>
      </div>
    </ProfileLayout>
  );
}
