"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { historyService } from "@/services/cmsService";

export default function DifficultyLevelsPage() {
  const [levels, setLevels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const dbLevels = await historyService.getActivityLevels();
        setLevels(dbLevels);
      } catch (error) {
        console.error("Error fetching levels:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return null;

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">Grading System</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display italic mb-8 tracking-tight">活動分級說明</h1>
          <p className="text-xl font-serif text-muted max-w-3xl leading-relaxed">
            為了確保活動安全與品質，我們將所有活動依難度、體能需求與路況分為五個等級。請參考以下說明選擇適合您的行程。
          </p>
        </section>

        <div className="space-y-12">
          {levels.map((level) => (
            <div 
              key={level.level}
              className="group relative bg-surface border border-border p-10 md:p-16 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-3">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white font-mono text-xl mb-6 shadow-lg ${level.color}`}>
                    L{level.level}
                  </div>
                  <h2 className="text-4xl font-display italic text-foreground mb-2">{level.label}</h2>
                  <div className="h-1 w-12 bg-accent/20 group-hover:w-full group-hover:bg-accent transition-all duration-700"></div>
                </div>

                <div className="md:col-span-9 space-y-6">
                  <div>
                    <h3 className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-3 font-bold">Description</h3>
                    <p className="text-xl font-serif text-muted leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-border/50">
                    <h4 className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-3 font-bold">Example Routes</h4>
                    <p className="text-base font-serif italic text-muted">
                      {level.example}
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Number */}
              <div className="absolute right-10 top-10 text-[12rem] font-display italic text-muted/5 select-none pointer-events-none transition-transform group-hover:scale-110 duration-700">
                0{level.level}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 p-12 bg-accent/5 border border-accent/20 rounded-[3rem] text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-display italic mb-4 text-accent">安全第一 Safety First</h3>
          <p className="text-muted font-serif leading-relaxed italic">
            「山永遠都在。」如果您對自己的體能或經驗有疑慮，請務必與領隊或幹部諮詢。
            建議從入門等級開始累積經驗，循序漸進挑戰更高難度的山域。
          </p>
        </div>
      </div>
    </main>
  );
}
