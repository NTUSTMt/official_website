"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/config/navigation";

interface RulesLayoutProps {
  children: React.ReactNode;
}

export default function RulesLayout({ children }: RulesLayoutProps) {
  const pathname = usePathname();
  const rulesItem = navigationConfig.find(item => item.href === "/rules");
  const subItems = rulesItem?.subItems || [];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 md:pt-32 pb-16 md:pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 max-w-4xl lg:max-w-none mx-auto">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-32">
              <div className="mb-6 md:mb-8">
                <h2 className="text-xs font-mono text-accent uppercase tracking-[0.3em] font-bold mb-4">
                  Regulations
                </h2>
                <div className="h-0.5 w-12 bg-accent/20"></div>
              </div>
              
              <nav className="flex flex-col gap-2">
                {subItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-6 py-4 rounded-2xl text-sm font-serif transition-all duration-300 border ${
                        isActive 
                          ? "bg-accent/5 border-accent text-accent shadow-sm" 
                          : "bg-transparent border-transparent text-muted hover:bg-surface hover:border-border"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-surface border border-border rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-16 shadow-sm min-h-[600px]">
              {children}
            </div>

            {/* Moved Help Text to Bottom with Original Box Style */}
            <div className="mt-8 md:mt-12 p-8 bg-surface border border-border rounded-[2.5rem] md:rounded-3xl text-center">
              <p className="text-[11px] font-mono text-muted leading-relaxed uppercase tracking-widest">
                如有任何疑問，請聯繫社團幹部或透過 LINE 官方帳號詢問。
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
