"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/config/navigation";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();
  const profileItem = navigationConfig.find(item => item.href === "/profile");
  const subItems = profileItem?.subItems || [];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-32">
              <div className="mb-8">
                <h2 className="text-xs font-mono text-accent uppercase tracking-[0.3em] font-bold mb-4">
                  My_Footprints
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">Member Active</span>
                </div>
                <p className="text-[10px] font-mono text-muted/60 leading-relaxed uppercase tracking-widest">
                  數位會員證與資料已與系統同步。
                </p>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="bg-surface border border-border rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-sm min-h-[600px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
