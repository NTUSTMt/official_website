"use client";

import React from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { mockRentals } from "@/data/profile";

export default function RentalHistoryPage() {
  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display italic mb-6">裝備租借紀錄</h1>
          <p className="text-lg font-serif text-muted">
            查看您過往租借過的社團公裝、費用明細與歸還狀態。
          </p>
        </header>

        <div className="overflow-hidden border border-border rounded-[2.5rem] bg-background">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface border-b border-border">
                <th className="px-8 py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Item_Name</th>
                <th className="px-8 py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Duration</th>
                <th className="px-8 py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockRentals.map((rent) => (
                <tr key={rent.id} className="group hover:bg-surface/50 transition-colors">
                  <td className="px-8 py-8">
                    <div className="text-sm font-serif font-bold text-foreground group-hover:text-accent transition-colors">{rent.itemName}</div>
                    <div className="text-[10px] font-mono text-muted/50 mt-1 uppercase">ID: {rent.id}</div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="text-sm font-serif">{rent.startDate}</div>
                    <div className="text-xs text-muted">to {rent.endDate}</div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={`text-[9px] font-mono px-3 py-1.5 rounded-full border tracking-widest font-bold uppercase ${
                      rent.status === "RENTING" ? "border-emerald-500/20 text-emerald-600 bg-emerald-50/50" :
                      rent.status === "OVERDUE" ? "border-red-500/20 text-red-600 bg-red-50/50" :
                      "border-muted/20 text-muted bg-surface"
                    }`}>
                      {rent.status}
                    </span>
                  </td>
                  <td className="px-8 py-8 font-mono text-sm text-foreground">
                    {rent.fee}
                  </td>
                </tr>
              ))}
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
