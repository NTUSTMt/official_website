"use client";
import React, { useState, useEffect } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { userService, UserProfile } from "@/services/userService";
import Link from "next/link";
import { CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await userService.getCurrentUser();
        if (profile) {
          setUser(profile);
          const data = await userService.getPaymentHistory(profile.id, profile.internal_line_id);
          setPayments(data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="p-20 text-center font-mono animate-pulse text-xs tracking-widest text-muted">
          SYNCHRONIZING_PAYMENT_HISTORY...
        </div>
      </ProfileLayout>
    );
  }

  if (!user) {
    return (
      <ProfileLayout>
        <div className="p-20 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center font-serif text-muted italic mb-8">
            無法載入個人資料，請嘗試登入。
          </div>
          <Link 
            href="/login" 
            className="px-10 py-4 bg-accent text-white rounded-2xl font-mono text-[10px] uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all shadow-xl shadow-accent/20"
          >
            Go_to_Login
          </Link>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-6 md:mb-12">
          <h1 className="text-2xl md:text-5xl font-display italic mb-3 md:mb-6">繳費紀錄</h1>
          <p className="text-sm md:text-lg font-serif text-muted">
            追蹤您的入社費、活動費以及裝備租借費用之繳納狀態。
          </p>
        </header>

        {/* Balance Card */}
        <div className="mb-8 p-6 md:p-10 bg-accent/5 border border-accent/20 rounded-[1.5rem] md:rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <CreditCard className="w-6 h-6 md:w-8 md:h-8 text-accent" />
            </div>
            <div>
              <div className="text-[9px] md:text-[10px] font-mono text-muted uppercase tracking-widest mb-0.5 md:mb-1">Current_Balance</div>
              <div className={`text-3xl md:text-4xl font-display italic ${user.balance < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                ${user.balance}
              </div>
            </div>
          </div>
          <div className="text-xs md:text-sm font-serif text-muted text-center md:text-right max-w-xs border-t border-accent/10 md:border-none pt-4 md:pt-0 w-full md:w-auto">
            {user.balance < 0 
              ? "您目前有尚未繳清的費用，請撥空至社辦向財務長繳納。" 
              : "您的帳戶目前狀態良好。"}
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar border border-border rounded-[2rem] md:rounded-[2.5rem] bg-background">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-3 md:px-8 py-4 md:py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Transaction</th>
                <th className="px-3 md:px-8 py-4 md:py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Date</th>
                <th className="px-3 md:px-8 py-4 md:py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Type</th>
                <th className="px-3 md:px-8 py-4 md:py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {payments.map((p) => (
                <tr key={p.id} className="group hover:bg-surface/50 transition-colors">
                  <td className="px-3 md:px-8 py-4 md:py-8">
                    <div className="text-xs md:text-sm font-serif font-bold text-foreground group-hover:text-accent transition-colors">
                      {p.description}
                    </div>
                  </td>
                  <td className="px-3 md:px-8 py-4 md:py-8">
                    <div className="text-xs md:text-sm font-serif">{new Date(p.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="px-3 md:px-8 py-4 md:py-8">
                    <span className={`text-[8px] md:text-[9px] font-mono px-2 md:px-3 py-1 md:py-1.5 rounded-full border tracking-widest font-bold uppercase ${
                      p.type === 'rental' ? 'border-blue-500/20 text-blue-600 bg-blue-50/50' :
                      p.type === 'activity' ? 'border-purple-500/20 text-purple-600 bg-purple-50/50' :
                      p.type === 'club_fee' ? 'border-emerald-500/20 text-emerald-600 bg-emerald-50/50' :
                      'border-muted/20 text-muted bg-surface'
                    }`}>
                      {p.type}
                    </span>
                  </td>
                  <td className="px-3 md:px-8 py-4 md:py-8">
                    <div className={`flex items-center gap-1 md:gap-2 font-mono text-xs md:text-sm font-bold ${p.amount < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {p.amount < 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                      ${Math.abs(p.amount)}
                    </div>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-sm font-serif text-muted italic">
                    目前無任何繳費紀錄。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProfileLayout>
  );
}
