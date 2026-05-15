"use client";
import React, { useState, useEffect } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { rentalService } from "@/services/equipmentService";
import { userService, UserProfile } from "@/services/userService";
import Link from "next/link";

export default function RentalHistoryPage() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await userService.getCurrentUser();
        if (profile) {
          setUser(profile);
          const data = await rentalService.getUserRentals(profile.id, profile.internal_line_id);
          setRentals(data);
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
          RETRIEVING_RENTAL_HISTORY...
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
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-display italic mb-4 md:mb-6">裝備租借紀錄</h1>
          <p className="text-base md:text-lg font-serif text-muted">
            查看您過往租借過的社團公裝、費用明細與歸還狀態。
          </p>
        </header>

        <div className="overflow-x-auto no-scrollbar border border-border rounded-[2rem] md:rounded-[2.5rem] bg-background">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-4 md:px-8 py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Item_Details</th>
                <th className="px-4 md:px-8 py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Duration</th>
                <th className="px-4 md:px-8 py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Status</th>
                <th className="px-4 md:px-8 py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rentals.map((rent) => (
                <tr key={rent.id} className="group hover:bg-surface/50 transition-colors">
                  <td className="px-4 md:px-8 py-6 md:py-8">
                    <div className="space-y-1">
                      {rent.items?.map((item: any, i: number) => (
                        <div key={i} className="text-sm font-serif font-bold text-foreground group-hover:text-accent transition-colors">
                          {item.name} x {item.qty}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-6 md:py-8">
                    <div className="text-sm font-serif">{rent.start_date}</div>
                    <div className="text-xs text-muted">to {rent.end_date}</div>
                  </td>
                  <td className="px-4 md:px-8 py-6 md:py-8">
                    <span className={`text-[9px] font-mono px-3 py-1.5 rounded-full border tracking-widest font-bold uppercase ${
                      rent.status === "PENDING" ? "border-amber-500/20 text-amber-600 bg-amber-50/50" :
                      rent.status === "APPROVED" ? "border-emerald-500/20 text-emerald-600 bg-emerald-50/50" :
                      rent.status === "RETURNED" ? "border-muted/20 text-muted bg-surface" :
                      rent.status === "OVERDUE" ? "border-red-500/20 text-red-600 bg-red-50/50" :
                      "border-muted/20 text-muted bg-surface"
                    }`}>
                      {rent.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-8 py-6 md:py-8 font-mono text-sm text-foreground">
                    NT$ {rent.total_fee}
                  </td>
                </tr>
              ))}
              {rentals.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-sm font-serif text-muted italic">
                    目前無任何租借紀錄。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-12 p-8 bg-surface border border-dashed border-border rounded-3xl text-center">
          <p className="text-sm font-serif text-muted italic">
            溫馨提醒：請務必在歸還期限內將器材清理乾淨並送回社辦，以免影響您的後續租借權益。
          </p>
        </div>
      </div>
    </ProfileLayout>
  );
}
