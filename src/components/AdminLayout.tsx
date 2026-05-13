"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Tent, Package, Users, LogOut, LayoutDashboard, FileText } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

export default function AdminLayout({ children, fullWidth = false }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for auth cookie (simple check)
    const checkAuth = async () => {
      const isAuth = document.cookie.includes("admin_session=authenticated");
      setIsAuthenticated(isAuth);
      
      if (!isAuth && !pathname.startsWith("/admin/login")) {
        router.push("/admin/login");
      }
    };
    
    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    // Clear cookie and redirect
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  const navItems = [
    { label: "全站內容 CMS", href: "/admin", icon: Globe },
    { label: "活動與報名", href: "/admin/events", icon: Tent },
    { label: "裝備與訂單", href: "/admin/equipment", icon: Package },
    { label: "會員管理中心", href: "/admin/users", icon: Users },
    { label: "規章制度", href: "/admin/rules", icon: FileText },
  ];

  if (isAuthenticated === null && !pathname.startsWith("/admin/login")) {
    return <div className="min-h-screen bg-background flex items-center justify-center font-mono text-xs text-muted">身分驗證中...</div>;
  }

  if (pathname.startsWith("/admin/login")) {
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
            管理後台
          </Link>
        </div>
        
        <div className="p-6 flex-1">
          <div className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4">管理模組控制台</div>
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
                  <item.icon className={`w-4 h-4 ${isActive ? "text-accent-foreground" : "text-muted"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-border">
          <button 
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl text-xs font-mono tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-200 flex items-center justify-center gap-2"
          >
            <LogOut className="w-3 h-3" />
            登出系統
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif">
              {navItems.find(i => i.href === pathname)?.label || "管理控制台"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-serif text-foreground">管理員</div>
              <div className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest">管理員已登入</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-accent flex items-center justify-center font-mono text-xs font-bold text-accent">
              AD
            </div>
          </div>
        </header>

        <div className={`flex-1 overflow-y-auto bg-background ${fullWidth ? "" : "p-6 md:p-12"}`}>
          <div className={fullWidth ? "" : "max-w-7xl mx-auto"}>
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
            <item.icon className={`w-5 h-5 ${pathname === item.href ? "text-accent" : "text-muted"}`} />
            <span className="text-[8px] font-mono uppercase tracking-widest">{item.label.substring(0, 4)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
