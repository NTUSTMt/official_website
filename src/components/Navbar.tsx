"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "首頁", href: "/" },
  { label: "關於山社", href: "/about" },
  { label: "活動中心", href: "/events" },
  { label: "社員服務", href: "/equipment" },
  { label: "聯絡我們", href: "/contact" },
  { label: "我的足跡", href: "/profile" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={`sticky top-0 z-50 glass px-4 md:px-8 py-3 border-b border-border shadow-sm ${pathname === "/" ? "mt-[-59px]" : ""}`}>
      <div className="max-w-7xl mx-auto font-mono">
        <div className="flex items-center w-full overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`cursor-pointer transition-all px-2 py-1 border-b-2 whitespace-nowrap flex-1 text-center ${
                  active 
                    ? "border-accent text-accent font-bold" 
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                <span className="text-[12px] md:text-[13px] font-bold tracking-[0.05em]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
