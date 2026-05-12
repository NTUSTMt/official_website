"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { ShieldCheck, Lock, ChevronRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic: password is "admin123"
    if (password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin");
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 relative z-10 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-display italic mb-2">Admin Panel</h1>
            <p className="text-xs font-mono text-muted uppercase tracking-[0.2em]">NTUST Mountaineering Club</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">
                Access Code
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className={`w-full bg-background border ${error ? "border-red-500 focus:border-red-500" : "border-border focus:border-accent"} px-4 py-3 rounded-xl font-mono text-sm outline-none transition-colors`}
              />
              {error && (
                <p className="text-red-500 text-[10px] font-mono mt-2 ml-1 animate-in fade-in">
                  INCORRECT_ACCESS_CODE
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-mono text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Authenticate</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-8 text-center border-t border-border pt-6">
            <p className="text-[10px] font-mono text-muted/60">
              Mock Environment. Password: admin123
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
