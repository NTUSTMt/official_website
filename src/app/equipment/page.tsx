"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { navigationConfig } from "@/config/navigation";
import { useTranslation } from "@/context/LanguageContext";

export default function EquipmentHubPage() {
  const { t } = useTranslation();
  const equipItem = navigationConfig.find(item => item.href === "/equipment");
  const subItems = equipItem?.subItems || [];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-24 px-6 max-w-5xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className="group relative p-10 bg-surface border border-border hover:border-accent transition-all duration-300 flex flex-col justify-between rounded-[2.5rem] shadow-sm hover:shadow-xl overflow-hidden min-h-[300px]"
            >
              <div className="relative z-10">
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-4">Module</span>
                <h3 className="text-3xl font-display italic group-hover:text-accent transition-colors mb-4">
                  {t(item.labelKey || `nav.equipment.${item.label.toLowerCase()}`)}
                </h3>
                <div className="h-px w-12 bg-border group-hover:w-full group-hover:bg-accent transition-all duration-500"></div>
              </div>
              
              <div className="relative z-10 flex items-center gap-2 text-xs font-mono text-muted group-hover:text-accent transition-colors mt-12">
                <span>ENTER</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Decorative Icon Placeholder */}
              <div className="absolute -right-4 -bottom-4 text-8xl font-display italic text-muted/5 group-hover:text-accent/5 transition-colors pointer-events-none">
                {t(item.labelKey || `nav.equipment.${item.label.toLowerCase()}`).slice(0, 1)}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-32 p-12 bg-accent/5 border border-accent/20 rounded-[3rem] text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-display italic mb-4 text-accent">{t('nav.equipment.reminder_title')}</h3>
          <p className="text-muted font-serif leading-relaxed italic text-sm">
            {t('nav.equipment.reminder_desc')}
          </p>
        </div>
      </div>
    </main>
  );
}
