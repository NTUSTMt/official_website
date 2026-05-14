import React from "react";
import { signIn } from "@/auth";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#06C755]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-10 relative z-10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display italic mb-2">會員登入</h1>
          <p className="text-xs font-mono text-muted uppercase tracking-[0.2em]">NTUST Mountaineering Club</p>
        </div>

        <form
          action={async () => {
            "use server"
            await signIn("line", { redirectTo: "/profile" })
          }}
        >
          <button
            type="submit"
            className="w-full bg-[#06C755] text-white py-4 rounded-xl font-mono text-sm font-bold hover:bg-[#05b34c] transition-colors flex items-center justify-center gap-3 shadow-lg shadow-[#06C755]/20"
          >
            <MessageCircle className="w-5 h-5" />
            <span>使用 LINE 帳號登入</span>
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <p className="text-[11px] font-mono text-muted/80 leading-relaxed mb-6">
            登入即表示您同意將您的 LINE User ID 提供給社團，以便未來接收出隊推播與租借提醒。
          </p>
          <Link href="/" className="text-[10px] font-mono text-muted hover:text-accent transition-colors uppercase tracking-widest underline underline-offset-4">
            Back_to_Home
          </Link>
        </div>
      </div>
    </div>
  );
}
