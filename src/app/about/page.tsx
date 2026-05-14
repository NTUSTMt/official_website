import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { navigationConfig } from "@/config/navigation";

export default function AboutDirectoryPage() {
  const aboutItem = navigationConfig.find(item => item.href === "/about");
  const subItems = aboutItem?.subItems || [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-24 px-6 max-w-5xl mx-auto">
        <section className="mb-20 text-center">
          <h1 className="text-5xl md:text-7xl font-display italic mb-6 tracking-tight">
            關於山社 <span className="text-muted/20">About Us</span>
          </h1>
          <div className="h-1 w-24 bg-accent mx-auto mb-12"></div>
          <p className="text-xl font-serif text-muted max-w-2xl mx-auto leading-relaxed">
            探索台科大登山社的歷史、傳統與核心價值，深入了解我們的組織架構。
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className="group relative p-10 bg-surface border border-border hover:border-accent transition-all duration-300 flex flex-col justify-between aspect-square rounded-[2.5rem] shadow-sm hover:shadow-xl"
            >
              <div>
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-4">Section</span>
                <h3 className="text-2xl font-display italic group-hover:text-accent transition-colors mb-4 leading-tight">
                  {item.label}
                </h3>
                <div className="h-px w-12 bg-border group-hover:w-24 group-hover:bg-accent transition-all duration-500"></div>
              </div>
              
              <div className="flex items-center gap-2 text-[12px] font-mono text-muted group-hover:text-accent transition-colors">
                <span>VIEW PAGE</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-24 text-center font-mono text-[10px] text-muted/40 uppercase tracking-[0.2em]">
          NTUST Mountaineering Club · Founded 1979
        </p>
      </div>
    </main>
  );
}
