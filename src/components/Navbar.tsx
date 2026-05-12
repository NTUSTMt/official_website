"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig, NavItem } from "@/config/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedItems(prev => 
      prev.includes(href) ? prev.filter(i => i !== href) : [...prev, href]
    );
  };

  return (
    <nav className={`sticky top-0 z-50 glass border-b border-border shadow-sm transition-all duration-300 ${pathname === "/" ? "mt-[-59px]" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo or Brand could go here if needed, but keeping original layout */}
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 w-full font-mono">
            {navigationConfig.map((item) => (
              <NavItemDesktop key={item.href} item={item} active={pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/")} />
            ))}
          </div>

          {/* Mobile Navigation Placeholder / Toggle */}
          <div className="md:hidden flex items-center justify-between w-full font-mono overflow-x-auto no-scrollbar">
            {navigationConfig.map((item) => (
              <NavItemMobile 
                key={item.href} 
                item={item} 
                active={pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/")}
                expanded={expandedItems.includes(item.href)}
                onToggle={(e) => toggleExpand(e, item.href)}
              />
            ))}
          </div>
        </div>
      </div>
    </nav>
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
        <div className="absolute top-full left-0 w-full min-w-[200px] pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
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
  return (
    <div className="relative flex-shrink-0">
      <div className="flex items-center">
        <Link 
          href={item.href}
          className={`cursor-pointer transition-all px-3 py-1 border-b-2 whitespace-nowrap text-center ${
            active 
              ? "border-accent text-accent font-bold" 
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <span className="text-[12px] font-bold tracking-[0.05em]">{item.label}</span>
        </Link>
        {item.subItems && (
          <button 
            onClick={onToggle}
            className="p-1 text-muted hover:text-accent transition-colors border-b-2 border-transparent"
          >
            <svg className={`w-3 h-3 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Submenu Dropdown */}
      {item.subItems && expanded && (
        <div className="absolute top-full left-0 min-w-[160px] bg-surface border border-border shadow-xl py-2 z-[60] rounded-xl overflow-hidden mt-1">
          {item.subItems.map((sub) => (
            <Link
              key={sub.href}
              href={sub.href}
              className="block px-4 py-2 text-[11px] text-muted hover:text-accent hover:bg-background border-l-4 border-transparent hover:border-accent"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
