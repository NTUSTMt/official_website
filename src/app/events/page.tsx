import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { navigationConfig } from "@/config/navigation";

export default function EventsHubPage() {
  const eventsItem = navigationConfig.find(item => item.href === "/events");
  const subItems = eventsItem?.subItems || [];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-12 pb-24 px-6 max-w-5xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {subItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className="group relative p-12 bg-surface border border-border hover:border-accent transition-all duration-300 flex flex-col justify-between rounded-[3rem] shadow-sm hover:shadow-xl overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest block mb-4">Module</span>
                <h3 className="text-3xl font-display italic group-hover:text-accent transition-colors mb-4">
                  {item.label}
                </h3>
                <div className="h-px w-12 bg-border group-hover:w-24 group-hover:bg-accent transition-all duration-500"></div>
              </div>
              
              <div className="relative z-10 flex items-center gap-2 text-xs font-mono text-muted group-hover:text-accent transition-colors mt-12">
                <span>OPEN SECTION</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute -right-8 -bottom-8 text-9xl font-display italic text-muted/5 group-hover:text-accent/5 transition-colors pointer-events-none">
                {item.label.slice(0, 2)}
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-24 text-center font-mono text-[10px] text-muted/40 uppercase tracking-[0.2em]">
          Explore the Wilderness with Purpose
        </p>
      </div>
    </main>
  );
}
