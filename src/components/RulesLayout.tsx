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
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-32">
              <div className="mb-8">
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

              <div className="mt-12 p-6 bg-surface border border-border rounded-3xl">
                <p className="text-[10px] font-mono text-muted/60 leading-relaxed uppercase tracking-widest">
                  如有任何疑問，請聯繫社團幹部或透過 LINE 官方帳號詢問。
                </p>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 max-w-4xl">
            <div className="bg-surface border border-border rounded-[3rem] p-8 md:p-16 shadow-sm min-h-[600px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
