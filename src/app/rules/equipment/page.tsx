"use client";

import React, { useState, useEffect } from "react";
import RulesLayout from "@/components/RulesLayout";
import { rulesData, RuleCategory } from "@/data/rules";
import { ruleService } from "@/services/ruleService";

export default function EquipmentRulesPage() {
  const [data, setData] = useState<RuleCategory>(rulesData.equipment);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await ruleService.getRuleCategory("equipment");
        setData(result);
      } catch (err) {
        console.error("Failed to load equipment rules:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <RulesLayout>
        <div className="flex items-center justify-center h-64 font-mono text-xs animate-pulse">
          LOADING_EQUIPMENT_RULES...
        </div>
      </RulesLayout>
    );
  }

  return (
    <RulesLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-8 md:mb-12">

          <h1 className="text-3xl md:text-5xl font-display italic mb-4 md:mb-6">{data.title}</h1>
          <p className="text-base md:text-lg font-serif text-muted leading-relaxed">
            {data.description}
          </p>
          <div className="h-px w-full bg-border mt-8 md:mt-12"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-12 md:mb-20">
          <div className="lg:col-span-7 space-y-12">
            {data.sections.map((section, idx) => (
              <section key={idx} className="group">
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-xs font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-xl md:text-2xl font-display italic group-hover:text-accent transition-colors">
                    {section.title}
                  </h2>
                </div>
                
                <ul className="space-y-4 ml-12">
                  {section.content.map((item, i) => (
                    <li key={i} className="text-muted leading-relaxed font-serif relative">
                      <span className="absolute -left-6 top-3 w-1.5 h-1.5 rounded-full bg-accent/30"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-6 md:space-y-8">
              <div className="p-8 md:p-10 bg-accent text-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl shadow-accent/20">
                <h3 className="text-xl md:text-2xl font-display italic mb-4 md:mb-6 text-white">費用試算說明</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="font-serif italic">社員用於社團活動</span>
                    <span className="font-mono font-bold text-xl">免費</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="font-serif italic">非社員用於社團活動</span>
                    <span className="font-mono font-bold text-xl">免費</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="font-serif italic">社員個人使用</span>
                    <span className="font-mono font-bold text-xl">5 折租金</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="font-serif italic">非社員個人使用</span>
                    <span className="font-mono font-bold text-xl">全額租金</span>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-white/10 rounded-2xl text-[10px] font-mono uppercase tracking-widest leading-relaxed">
                  * 租金試算以「2天」為基本單位<br />
                  * 超過 2 天之部分按「每日加價」計算
                </div>
              </div>

              <div className="p-8 md:p-10 bg-surface border border-border rounded-[2.5rem] md:rounded-[3rem]">
                <h3 className="text-xl font-display italic mb-3 md:mb-4">損壞賠償 Damage</h3>
                <p className="text-sm font-serif text-muted leading-relaxed italic">
                  裝備如有明顯人為損壞，由器材長評估維修費用，借用人須負擔全額維修費。
                  若無法修復或遺失，則依該裝備當時之市價進行賠償。
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 md:mt-20 pt-8 md:pt-12 border-t border-border">
          <p className="text-xs font-mono text-muted/40 uppercase tracking-[0.2em]">
            Last Updated: {data.updated_at ? new Date(data.updated_at).toLocaleDateString('zh-TW') : "2024.05.12"}
          </p>
        </footer>
      </div>
    </RulesLayout>
  );
}
