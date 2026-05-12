"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Mock Authentication Check
  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth") === "true";
    setIsAuthenticated(isAuth);
    if (!isAuth && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin/login");
  };

  const navItems = [
    { label: "全站內容 CMS", href: "/admin", icon: "🌐" },
    { label: "活動與報名", href: "/admin/events", icon: "🏕️" },
    { label: "裝備與訂單", href: "/admin/equipment", icon: "🎒" },
    { label: "會員管理", href: "/admin/users", icon: "👥" },
  ];

  if (isAuthenticated === null) return <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs text-muted">LOADING...</div>;

  if (!isAuthenticated && pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-background selection:bg-accent/20">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link href="/" className="font-display italic text-2xl group flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent group-hover:scale-150 transition-transform"></span>
            Admin
          </Link>
        </div>
        
        <div className="p-6 flex-1">
          <div className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4">Dashboard_Modules</div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-xl text-sm font-serif flex items-center gap-3 transition-colors ${
                    isActive 
                      ? "bg-accent text-accent-foreground font-bold shadow-md shadow-accent/20" 
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-border">
          <button 
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl text-xs font-mono tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-200"
          >
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif">
              {navItems.find(i => i.href === pathname)?.label || "Dashboard"}
            </h1>
            <span className="px-2 py-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-md text-[9px] font-mono uppercase tracking-widest font-bold">
              Mock Mode
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-serif text-foreground">幹部管理員</div>
              <div className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest">Active Session</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-accent flex items-center justify-center font-mono text-xs font-bold text-accent">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Nav (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-border z-40 flex justify-around p-2 pb-safe">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`p-3 rounded-xl flex flex-col items-center gap-1 ${
              pathname === item.href ? "text-accent" : "text-muted"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[8px] font-mono uppercase tracking-widest">{item.label.split(" ")[0]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
