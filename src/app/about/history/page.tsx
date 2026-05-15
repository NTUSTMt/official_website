"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { historyData } from "@/data/history";
import { useTranslation } from "@/context/LanguageContext";

export default function HistoryPage() {
  const { language, t } = useTranslation();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-24 px-6 max-w-5xl mx-auto">

        <section className="mb-32">
          <div className="relative border-l border-border pl-12 space-y-16">
            {historyData.map((milestone, index) => (
              <div key={index} className="relative">
                <div className="absolute -left-[53px] top-0 w-3 h-3 rounded-full bg-accent ring-4 ring-white"></div>
                <div className="font-mono text-sm text-accent mb-2">{milestone.year}</div>
                <h3 className="text-2xl font-display italic mb-4">{milestone.title}</h3>
                <p className="font-serif text-muted leading-relaxed max-w-3xl">
                  {milestone.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        <p className="mt-16 text-center font-mono text-[10px] text-muted/40 uppercase tracking-[0.2em]">
          {t('nav.about.footer_tag')}
        </p>
      </div>
    </main>
  );
}
