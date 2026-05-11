import React from "react";
import Navbar from "@/components/Navbar";

export default function EventsPage() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h1 className="text-4xl md:text-6xl font-display italic">活動中心</h1>
          <span className="font-mono text-sm text-accent uppercase tracking-widest font-bold">Expeditions</span>
        </div>
        
        <div className="space-y-6">
          <div className="p-8 border border-border bg-surface hover:bg-background transition-colors cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="font-mono text-xs text-accent mb-2 font-bold tracking-widest">STATUS: OPEN</div>
              <h3 className="text-2xl font-display italic mb-2">玉山主峰單攻</h3>
              <p className="text-muted font-serif text-sm">日期：2026/06/15 | 難度：中等 | 報名截止：2026/05/30</p>
            </div>
            <button className="px-6 py-2 border border-accent text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-colors">
              立即報名
            </button>
          </div>

          <div className="p-8 border border-border bg-surface flex flex-col md:flex-row justify-between items-start md:items-center gap-6 opacity-70">
            <div>
              <div className="font-mono text-xs text-muted mb-2 font-bold tracking-widest">STATUS: CLOSED</div>
              <h3 className="text-2xl font-display italic mb-2">雪山東峰迎新</h3>
              <p className="text-muted font-serif text-sm">日期：2026/04/20 | 難度：入門 | 狀態：已結束</p>
            </div>
            <button className="px-6 py-2 border border-border text-muted font-mono text-xs uppercase tracking-widest cursor-not-allowed">
              活動回顧
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
