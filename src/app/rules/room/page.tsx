"use client";

import React, { useState, useEffect } from "react";
import RulesLayout from "@/components/RulesLayout";
import { rulesData, RuleCategory } from "@/data/rules";
import { ruleService } from "@/services/ruleService";

export default function RoomRulesPage() {
  const [data, setData] = useState<RuleCategory>(rulesData.room);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await ruleService.getRuleCategory("room");
        setData(result);
      } catch (err) {
        console.error("Failed to load room rules:", err);
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
          LOADING_ROOM_RULES...
        </div>
      </RulesLayout>
    );
  }

  return (
    <RulesLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display italic mb-6">{data.title}</h1>
          <p className="text-lg font-serif text-muted leading-relaxed">
            {data.description}
          </p>
          <div className="h-px w-full bg-border mt-12"></div>
        </header>

        <div className="space-y-16">
          {data.sections.map((section, idx) => (
            <section key={idx} className="group">
              <div className="flex items-center gap-4 mb-8">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-mono text-xs font-bold">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h2 className="text-2xl font-display italic group-hover:text-accent transition-colors">
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

        <footer className="mt-20 pt-12 border-t border-border">
          <p className="text-xs font-mono text-muted/40 uppercase tracking-[0.2em]">
            Last Updated: {new Date().toLocaleDateString('zh-TW')}
          </p>
        </footer>
      </div>
    </RulesLayout>
  );
}
