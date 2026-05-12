import React from "react";
import Link from "next/link";

const rules = [
  { index: "01", title: "入社規範", desc: "了解如何成為台科大登山社的一員。", type: "MEMBERSHIP", href: "/rules/membership" },
  { index: "02", title: "裝備租借規則", desc: "公裝借用優先權與賠償辦法。", type: "EQUIPMENT", href: "/rules/equipment" },
  { index: "03", title: "社辦使用規範", desc: "社辦空間維護與器材存放準則。", type: "ACTIVITY_ROOM", href: "/rules/room" },
  { index: "04", title: "組織章程", desc: "本社團之組織、運作及職權劃分細則。", type: "CONSTITUTION", href: "/rules/constitution" },
];

export default function Rules() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-24 gap-12 border-l-2 border-accent pl-8">
          <div className="max-w-2xl">
            <div className="font-mono text-[10px] text-accent tracking-[0.3em] mb-4 uppercase font-bold">Governance_Index</div>
            <h2 className="text-5xl md:text-7xl font-display italic mb-8 text-foreground">規章制度與透明管理</h2>
            <p className="text-lg text-muted font-serif leading-relaxed">
              “我們重視每一位成員的參與權與社團資產的維護。從入社辦法到組織章程，所有規範均公開透明，確保社團永續運作。”
            </p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border border border-border font-mono">
            <div className="p-6 bg-surface text-center">
              <div className="text-xs text-muted mb-2 uppercase">Compliance</div>
              <div className="text-3xl font-bold tabular text-accent">100%</div>
            </div>
            <div className="p-6 bg-surface text-center">
              <div className="text-xs text-muted mb-2 uppercase">Open Access</div>
              <div className="text-3xl font-bold tabular text-accent">PUBLIC</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border">
          {rules.map((rule) => (
            <Link 
              key={rule.index}
              href={rule.href}
              className="group flex flex-col md:flex-row md:items-center justify-between py-10 border-b border-border hover:bg-surface transition-all px-4"
            >
              <div className="flex items-baseline gap-6 mb-4 md:mb-0">
                <span className="font-mono text-xs text-accent tabular font-bold">{rule.index}</span>
                <div>
                  <h3 className="text-2xl font-display italic group-hover:pl-2 transition-all text-foreground">{rule.title}</h3>
                  <p className="text-sm text-muted font-serif mt-1">{rule.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className="font-mono text-[10px] text-muted border border-border px-3 py-1.5 uppercase tracking-widest font-medium group-hover:border-accent group-hover:text-accent transition-colors">{rule.type}</span>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-accent transition-colors font-bold flex items-center gap-2">
                  READ_MORE 
                  <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/rules"
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.3em] text-accent hover:gap-5 transition-all"
          >
            Explore All Regulations
            <div className="w-12 h-px bg-accent"></div>
          </Link>
        </div>
      </div>
    </section>
  );
}
