import React from "react";

const features = [
  {
    title: "近期出隊報名",
    id: "EXP_042",
    desc: "下一站：玉山主峰。名額有限，火速報名並完成行前訓練。",
    tag: "STATUS: OPEN",
  },
  {
    title: "成員專區",
    id: "USR_MEMB",
    desc: "查看您的登山履歷、社團紀錄與數位會員證。",
  },
  {
    title: "裝備租借中心",
    id: "EQP_RENT",
    desc: "專業背架、輕量化帳篷、睡袋租借服務，維護精良。",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-0 relative z-30">
      {features.map((feature) => (
        <div 
          key={feature.id}
          className="p-8 border border-border bg-surface hover:bg-background transition-all cursor-pointer group relative"
        >
          <div className="flex justify-between items-start mb-12">
            <span className="font-mono text-[10px] text-muted tracking-widest font-bold">{feature.id}</span>
            {feature.tag && (
              <span className="text-[10px] font-mono text-accent border border-accent/20 px-2 py-0.5 font-bold bg-accent/5">
                {feature.tag}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-display italic mb-4 group-hover:text-accent transition-colors text-foreground">
            {feature.title}
          </h3>
          <p className="text-muted text-sm leading-relaxed font-serif mb-8">
            {feature.desc}
          </p>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all text-foreground font-bold">
            Access_Module <span>→</span>
          </div>
        </div>
      ))}
    </section>
  );
}
