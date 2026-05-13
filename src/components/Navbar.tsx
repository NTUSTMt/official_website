"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig, NavItem } from "@/config/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface NavbarProps {
  announcement?: {
    enabled: boolean;
    text: string;
    link: string;
  };
}

export default function Navbar({ announcement: initialAnnouncement }: NavbarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState(initialAnnouncement);

  useEffect(() => {
    async function fetchAnnouncement() {
      if (!isSupabaseConfigured) return;
      
      const { data } = await supabase
        .from("cms_config")
        .select("announcement")
        .eq("id", "global_config")
        .single();
      
      if (data?.announcement) {
        setAnnouncement(data.announcement);
      }
    }
    
    if (!initialAnnouncement) {
      fetchAnnouncement();
    }
  }, [initialAnnouncement]);

  const toggleExpand = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev => 
      prev.includes(href) ? prev.filter(i => i !== href) : [...prev, href]
    );
  };

  const navRef = useRef<HTMLElement>(null);
  const [navHeight, setNavHeight] = useState(0);

  useLayoutEffect(() => {
    if (navRef.current) {
      const updateHeight = () => {
        if (navRef.current) {
          setNavHeight(navRef.current.offsetHeight);
        }
      };
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [announcement]);

  return (
    <>
      <nav 
        ref={navRef}
        style={{ marginTop: pathname === "/" ? `-${navHeight}px` : undefined }}
        className={`sticky top-0 z-50 glass border-b border-border shadow-sm transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between md:py-3">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 w-full font-mono">
            {navigationConfig.map((item) => (
              <NavItemDesktop key={item.href} item={item} active={pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/")} />
            ))}
          </div>

          {/* Mobile Navigation Placeholder / Toggle */}
          <div className="md:hidden flex flex-col w-full">
            <div className="flex items-center w-screen -mx-4 overflow-x-auto no-scrollbar border-b border-border/50 py-2">
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
                          pathname === sub.href ? "text-accent font-bold" : "text-muted hover:text-accent"
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
          </div>
        </div>
        
        {announcement?.enabled && announcement.text && (
          <div className="bg-accent text-accent-foreground py-2 px-4 text-center relative z-20 shadow-sm border-t border-white/10">
            <Link href={announcement.link} className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest hover:underline transition-all">
              {announcement.text} →
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}

function NavItemDesktop({ item, active }: { item: NavItem, active: boolean }) {
  return (
    <div className="relative group flex-1">
      <Link 
        href={item.href}
        className={`flex items-center justify-center gap-1 cursor-pointer transition-all px-2 py-1 border-b-2 whitespace-nowrap text-center ${
          active 
            ? "border-accent text-accent font-bold" 
            : "border-transparent text-muted hover:text-foreground"
        }`}
      >
        <span className="text-[12px] lg:text-[13px] font-bold tracking-[0.05em]">{item.label}</span>
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
                className="px-5 py-2.5 text-[12px] text-muted hover:text-accent hover:bg-background transition-colors border-l-4 border-transparent hover:border-accent"
              >
                {sub.label}
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
  const hasSubItems = item.subItems && item.subItems.length > 0;

  const content = (
    <div className={`flex items-center gap-1 cursor-pointer transition-all px-3 py-2 border-b-2 whitespace-nowrap text-center ${
      active 
        ? "border-accent text-accent font-bold" 
        : "border-transparent text-muted hover:text-foreground"
    }`}>
      <span className="text-[12px] font-bold tracking-[0.05em]">{item.label}</span>
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
