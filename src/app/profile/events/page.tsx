"use client";

import React from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { mockExpeditions } from "@/data/profile";

export default function ExpeditionRecordsPage() {
  const currentEvents = mockExpeditions.filter(e => e.status !== "COMPLETED");
  const pastEvents = mockExpeditions.filter(e => e.status === "COMPLETED");

  const RecordCard = ({ exp }: { exp: typeof mockExpeditions[0] }) => (
    <div className="group p-8 bg-background border border-border rounded-[2.5rem] hover:border-accent transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <span className={`text-[9px] font-mono px-3 py-1.5 rounded-full border tracking-widest font-bold uppercase ${
          exp.status === "ADMITTED" ? "border-emerald-500/20 text-emerald-600 bg-emerald-50/50" :
          exp.status === "WAITLISTED" ? "border-amber-500/20 text-amber-600 bg-amber-50/50" :
          "border-muted/20 text-muted bg-surface"
        }`}>
          {exp.status}
        </span>
        <span className="text-[10px] font-mono text-muted/40 uppercase tracking-widest">{exp.date}</span>
      </div>
      
      <h3 className="text-2xl font-display italic mb-4 group-hover:text-accent transition-colors">{exp.title}</h3>
      
      <div className="flex items-center gap-6 mt-8 pt-6 border-t border-border/50">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-muted/60 uppercase tracking-widest">Role</span>
          <span className="text-sm font-serif">{exp.role}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-muted/60 uppercase tracking-widest">Activity_ID</span>
          <span className="text-sm font-mono text-muted uppercase">{exp.activityId}</span>
        </div>
      </div>
    </div>
  );

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display italic mb-6">出團紀錄</h1>
          <p className="text-lg font-serif text-muted">
            記錄您在社團中參加過的每一場冒險與報名進度。
          </p>
        </header>

        <section className="mb-16">
          <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.2em] mb-8">Active_Expeditions</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentEvents.length > 0 ? (
              currentEvents.map(exp => <RecordCard key={exp.id} exp={exp} />)
            ) : (
              <p className="text-sm font-serif text-muted italic">目前無進行中的報名或計畫。</p>
            )}
          </div>
        </section>

        <section>
          <div className="text-[10px] font-mono text-accent font-bold uppercase tracking-[0.2em] mb-8">Past_Footprints</div>
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
