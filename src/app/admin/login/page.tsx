"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Mountain } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || "登入失敗，請檢查帳密");
      }
    } catch (err) {
      setError("連線錯誤，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none select-none flex items-center justify-center">
        <Mountain className="w-[800px] h-[800px] rotate-12" />
      </div>

      <div className="w-full max-w-[400px] bg-surface border border-border p-10 rounded-[2.5rem] shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display italic text-foreground mb-2">管理員登入</h1>
          <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">後台管理系統 v2.0</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-mono text-muted uppercase tracking-widest ml-1">帳號 Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-border px-12 py-3.5 rounded-xl text-sm outline-none focus:border-accent transition-all font-mono"
                placeholder="ID_CREDENTIAL"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-mono text-muted uppercase tracking-widest ml-1">密碼 Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border px-12 py-3.5 rounded-xl text-sm outline-none focus:border-accent transition-all font-mono"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-[10px] font-mono uppercase text-center animate-pulse">
              [Error]: {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-foreground text-background py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-[0.3em] hover:bg-accent hover:text-white transition-all duration-300 shadow-xl shadow-foreground/10"
          >
            {isLoading ? "身分驗證中..." : "進入系統"}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-[9px] font-mono text-muted uppercase tracking-widest">
            Restricted Access © {new Date().getFullYear()} NTUSTMC
          </p>
        </div>
      </div>
    </div>
  );
}
