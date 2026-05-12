import React from "react";
import Navbar from "@/components/Navbar";

export default function AssociationPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <section className="mb-20">
          <h1 className="text-5xl md:text-7xl font-display italic mb-6 tracking-tight">
            組織章程 <span className="text-muted/20">Bylaws</span>
          </h1>
          <div className="h-1 w-24 bg-accent mb-12"></div>
        </section>

        <section className="bg-surface border border-border p-12 font-serif text-muted space-y-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-display italic text-foreground mb-8 text-center">國立臺灣科技大學登山社組織章程</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 font-mono uppercase tracking-widest border-b border-border pb-2">第一章 總則</h3>
                <p>第一條：本社定名為「國立臺灣科技大學登山社」（以下簡稱本社）。</p>
                <p>第二條：本社以推廣登山運動、提倡野外活動、培養團體合作精神及建立正確自然生態保育觀念為宗旨。</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-4 font-mono uppercase tracking-widest border-b border-border pb-2">第二章 社員</h3>
                <p>第三條：凡本校學生及教職員，認同本社宗旨並完成入社手續者，均得為本社社員。</p>
              </div>

              <div className="p-8 bg-background/50 border border-dashed border-border text-center italic">
                更多詳細條文正在數位化整理中...
              </div>
            </div>
          </div>
        </section>

        <p className="mt-16 text-center font-mono text-[10px] text-muted/40 uppercase tracking-[0.2em]">
          NTUST Mountaineering Club · Constitution
        </p>
      </div>
    </main>
  );
}
