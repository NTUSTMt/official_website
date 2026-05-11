import React from "react";

const rules = [
  { index: "01", title: "社團組織規程", desc: "核心機制、幹部選舉與會員權利義務。", type: "REGULATION" },
  { index: "02", title: "野外風險管理標準", desc: "標準作業流程 (SOP) 與緊急撤退方案。", type: "SAFETY_SOP" },
  { index: "03", title: "社費與預算即時表", desc: "記錄每一筆經費來源與去向，公開監督。", type: "FINANCIAL" },
  { index: "04", title: "公裝借用與賠償條例", desc: "高品質裝備使用權與賠償機制。", type: "EQUIPMENT" },
];

export default function Rules() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-24 gap-12 border-l-2 border-accent pl-8">
          <div className="max-w-2xl">
            <div className="font-mono text-[10px] text-accent tracking-[0.3em] mb-4 uppercase font-bold">Governance_Index</div>
            <h2 className="text-5xl md:text-7xl font-display italic mb-8 text-foreground">組織章程與運作透明</h2>
            <p className="text-lg text-muted font-serif leading-relaxed">
              “我們重視每一位成員的參與權。從社費流向到裝備維護紀錄，所有資訊均公開透明。”
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border border border-border font-mono">
            <div className="p-6 bg-surface text-center">
              <div className="text-xs text-muted mb-2 uppercase">Expeditions</div>
              <div className="text-3xl font-bold tabular text-accent">450+</div>
            </div>
            <div className="p-6 bg-surface text-center">
              <div className="text-xs text-muted mb-2 uppercase">Transparency</div>
              <div className="text-3xl font-bold tabular text-accent">100%</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border">
          {rules.map((rule) => (
            <div 
              key={rule.index}
              className="group flex flex-col md:flex-row md:items-center justify-between py-8 border-b border-border hover:bg-surface transition-all cursor-pointer px-4"
            >
              <div className="flex items-baseline gap-6 mb-4 md:mb-0">
                <span className="font-mono text-xs text-accent tabular font-bold">{rule.index}</span>
                <div>
                  <h3 className="text-xl font-display italic group-hover:pl-2 transition-all text-foreground">{rule.title}</h3>
                  <p className="text-sm text-muted font-serif">{rule.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className="font-mono text-[10px] text-muted border border-border px-2 py-1 uppercase tracking-widest font-medium">{rule.type}</span>
                <button className="font-mono text-[10px] uppercase tracking-widest hover:text-accent transition-colors text-foreground font-bold">
                  View_PDF ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
