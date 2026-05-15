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
  const [isOpen, setIsOpen] = React.useState(false);
  const activeItem = subItems.find(item => item.href === pathname) || subItems[0];

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-20 pb-12 md:pt-24 md:pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-32">
              <div className="hidden lg:block mb-8">
                <h2 className="text-xs font-mono text-accent uppercase tracking-[0.3em] font-bold mb-4">
                  我的足跡 My Footprints
                </h2>
                <div className="h-0.5 w-12 bg-accent/20"></div>
              </div>
              
              {/* Mobile Toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-full flex items-center justify-between p-5 bg-surface border border-border rounded-2xl mb-4 group active:scale-[0.98] transition-all"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold mb-1">我的足跡 My Footprints</span>
                  <span className="text-sm font-serif font-bold text-foreground">{activeItem?.label}</span>
                </div>
                <div className={`w-8 h-8 rounded-full bg-accent/5 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <nav className={`${isOpen ? 'flex' : 'hidden'} lg:flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300`}>
                {subItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
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

              <div className="hidden lg:block mt-12 p-6 bg-surface border border-border rounded-3xl">
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
            <div className="bg-surface border border-border rounded-[2rem] md:rounded-[3rem] p-5 md:p-16 shadow-sm min-h-[600px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
