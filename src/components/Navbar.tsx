"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const navItems = [
  { label: "首頁", href: "/" },
  { label: "關於山社", href: "/about" },
  { label: "活動中心", href: "/events" },
  { label: "社員服務", href: "/services" },
  { label: "聯絡我們", href: "/contact" },
  { label: "我的足跡", href: "/profile" },
];

export default function Navbar() {
  const [active, setActive] = useState("首頁");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block ${
          scrolled ? "glass py-3 shadow-sm" : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="text-xl font-display italic font-bold tracking-tight">
            NTUST Mountaineering
          </Link>
          <div className="flex gap-8 font-mono text-xs uppercase tracking-widest">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setActive(item.label)}
                className={`hover:text-accent transition-colors ${
                  active === item.label ? "text-accent font-bold" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass md:hidden border-t border-border px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.slice(0, 4).concat(navItems.slice(-1)).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setActive(item.label)}
              className="flex flex-col items-center gap-1"
            >
              <div className={`text-[10px] font-mono font-bold transition-colors ${
                active === item.label ? "text-accent" : "text-muted"
              }`}>
                {item.label}
              </div>
              {active === item.label && (
                <div className="w-1 h-1 rounded-full bg-accent" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
