"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig, NavItem } from "@/config/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useTranslation } from "@/context/LanguageContext";

interface NavbarProps {
  announcements?: {
    id: string;
    enabled: boolean;
    text: string;
    link: string;
  }[];
  className?: string;
}

export default function Navbar({ announcements: initialAnnouncements, className }: NavbarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [announcements, setAnnouncements] = useState(initialAnnouncements || []);

  useEffect(() => {
    async function fetchAnnouncements() {
      if (!isSupabaseConfigured) return;
      
      const { data } = await supabase
        .from("cms_config")
        .select("announcements, announcement")
        .eq("id", "global_config")
        .single();
      
      if (data) {
        const list = data.announcements || (data.announcement ? [{ id: "legacy", ...data.announcement }] : []);
        setAnnouncements(list);
      }
    }
    
    if (!initialAnnouncements) {
      fetchAnnouncements();
    }
  }, [initialAnnouncements]);

  const toggleExpand = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev => 
      prev.includes(href) ? prev.filter(i => i !== href) : [...prev, href]
    );
  };

  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useLayoutEffect(() => {
    const updateHeights = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
      if (linksRef.current) {
        document.documentElement.style.setProperty('--nav-links-height', `${linksRef.current.offsetHeight}px`);
      }
    };
    
    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [announcements, expandedItems]);

  const { language, setLanguage, t } = useTranslation();

  return (
    <>
      <nav 
        ref={navRef}
        className={`sticky top-0 z-50 glass border-b border-border shadow-sm transition-all duration-300 ${className || ""}`}
      >
        <div ref={linksRef} className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between md:py-3">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 w-full font-mono">
            {navigationConfig.map((item) => (
              <NavItemDesktop key={item.href} item={item} active={pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/")} />
            ))}
          </div>

          {/* Language Switcher (Desktop) */}
          <div className="hidden md:flex items-center ml-4 pl-4 border-l border-border/50">
            <button 
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="text-[10px] font-mono font-bold hover:text-accent transition-colors uppercase tracking-widest px-3 py-1 bg-accent/5 rounded-full border border-accent/10 whitespace-nowrap"
            >
              {language === 'zh' ? 'English' : '中文'}
            </button>
          </div>

          {/* Mobile Navigation Placeholder / Toggle */}
          <div className="md:hidden flex flex-col w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center w-full overflow-x-auto no-scrollbar border-b border-border/50 py-2">
                <div className="flex items-center px-4 font-mono">
                  {navigationConfig.map((item) => (
                    <NavItemMobile 
                      key={item.href} 
                      item={item} 
                      active={pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/")}
                      expanded={expandedItems.includes(item.href)}
                      onToggle={(e) => {
                        setExpandedItems(prev => prev.includes(item.href) ? [] : [item.href]);
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Language Switcher (Mobile) */}
              <div className="px-4 py-2 border-b border-border/50">
                <button 
                  onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                  className="text-[9px] font-mono font-bold text-accent uppercase tracking-widest px-2 py-1 bg-accent/5 rounded border border-accent/10"
                >
                  {language === 'zh' ? 'EN' : '中'}
                </button>
              </div>
            </div>

            {/* Mobile Secondary Row for Sub-items */}
            {navigationConfig.map((item) => (
              item.subItems && expandedItems.includes(item.href) && (
                <div key={`sub-${item.href}`} className="w-screen -mx-4 bg-background/50 border-b border-border/30 overflow-x-auto no-scrollbar animate-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center px-6 py-2 gap-6 min-w-max">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={`text-[11px] font-mono whitespace-nowrap transition-colors ${
                          pathname === sub.href ? "text-accent font-bold" : "text-foreground hover:text-accent"
                        }`}
                      >
                        {sub.tKey ? t(sub.tKey) : sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          {announcements.filter(a => a.enabled && a.text).map((a, idx) => (
            <div key={a.id || idx} className="bg-accent text-accent-foreground py-2 px-4 text-center relative z-20 shadow-sm border-t border-white/10 last:border-b-0">
              <Link href={a.link || "#"} className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest hover:underline transition-all block">
                {a.text} {a.link && "→"}
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}

function NavItemDesktop({ item, active }: { item: NavItem, active: boolean }) {
  const { t } = useTranslation();
  const label = item.tKey ? t(item.tKey) : item.label;

  return (
    <div className="relative group flex-1">
      <Link 
        href={item.href}
        className={`flex items-center justify-center gap-1 cursor-pointer transition-all px-2 py-1 border-b-2 whitespace-nowrap text-center ${
          active 
            ? "border-accent text-accent font-bold" 
            : "border-transparent text-foreground hover:text-accent"
        }`}
      >
        <span className="text-[12px] lg:text-[13px] font-bold tracking-[0.05em]">{label}</span>
        {item.subItems && (
          <svg className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </Link>

      {/* Dropdown Menu */}
      {item.subItems && (
        <div className="absolute top-full left-0 w-full min-w-[200px] pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[70]">
          <div className="bg-surface border border-border shadow-2xl py-3 flex flex-col rounded-2xl overflow-hidden">
            {item.subItems.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="px-5 py-2.5 text-[12px] text-foreground hover:text-accent hover:bg-background transition-colors border-l-4 border-transparent hover:border-accent"
              >
                {sub.tKey ? t(sub.tKey) : sub.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavItemMobile({ 
  item, 
  active, 
  expanded, 
  onToggle 
}: { 
  item: NavItem, 
  active: boolean, 
  expanded: boolean,
  onToggle: (e: React.MouseEvent) => void
}) {
  const { t } = useTranslation();
  const label = item.tKey ? t(item.tKey) : item.label;
  const hasSubItems = item.subItems && item.subItems.length > 0;

  const content = (
    <div className={`flex items-center gap-1 cursor-pointer transition-all px-3 py-2 border-b-2 whitespace-nowrap text-center ${
      active 
        ? "border-accent text-accent font-bold" 
        : "border-transparent text-foreground hover:text-accent"
    }`}>
      <span className="text-[12px] font-bold tracking-[0.05em]">{label}</span>
      {hasSubItems && (
        <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </div>
  );

  return (
    <div className="relative flex-shrink-0">
      {hasSubItems ? (
        <div onClick={onToggle}>
          {content}
        </div>
      ) : (
        <Link href={item.href}>
          {content}
        </Link>
      )}
    </div>
  );
}
