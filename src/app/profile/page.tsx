"use client";

import React from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { mockUserProfile, mockExpeditions, mockRentals } from "@/data/profile";
import Link from "next/link";

export default function ProfilePage() {
  const user = mockUserProfile;
  const recentExpeditions = mockExpeditions.slice(0, 2);
  const activeRentals = mockRentals.filter(r => r.status === "RENTING");

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-accent rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
            />
          </div>
          <div className="text-center md:text-left">
            <div className="font-mono text-xs text-accent mb-3 font-bold tracking-[0.3em] uppercase">
              Club_Member {user.memberId}
            </div>
            <h1 className="text-4xl md:text-5xl font-display italic mb-6">{user.name}</h1>
            <p className="text-lg font-serif text-muted leading-relaxed max-w-xl">
              {user.bio}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Stats/Links */}
          <div className="p-10 bg-background border border-border rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-display italic mb-6">近期出團</h3>
              <div className="space-y-4">
                {recentExpeditions.map(exp => (
                  <div key={exp.id} className="flex items-center justify-between group cursor-default">
                    <div>
                      <div className="text-sm font-serif">{exp.title}</div>
                      <div className="text-[10px] font-mono text-muted/60 uppercase">{exp.date}</div>
                    </div>
                    <span className={`text-[9px] font-mono px-2 py-1 rounded-full border ${
                      exp.status === "ADMITTED" ? "border-emerald-500/30 text-emerald-600" : "border-amber-500/30 text-amber-600"
                    }`}>
                      {exp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/profile/events" className="mt-10 font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
              查看全部紀錄 →
            </Link>
          </div>

          <div className="p-10 bg-background border border-border rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-display italic mb-6">當前租借</h3>
              <div className="space-y-4">
                {activeRentals.length > 0 ? (
                  activeRentals.map(rent => (
                    <div key={rent.id}>
                      <div className="text-sm font-serif">{rent.itemName}</div>
                      <div className="text-[10px] font-mono text-muted/60 uppercase">還款日: {rent.endDate}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm font-serif text-muted italic">目前無進行中的租借。</p>
                )}
              </div>
            </div>
            <Link href="/profile/equipment" className="mt-10 font-mono text-[10px] uppercase tracking-widest text-accent hover:underline">
              查看租借歷史 →
            </Link>
          </div>
        </div>

        <section className="mt-16 p-10 bg-accent/5 border border-accent/20 rounded-[2.5rem]">
          <h3 className="text-xl font-display italic mb-6">備賽小秘訣</h3>
          <p className="text-sm font-serif text-muted leading-relaxed">
            您目前的詳細資料填寫率為 85%。完成「詳細資料」中的保險相關資訊，可以讓您在下次報名百岳行程時，系統自動為您填寫入園申請與保險表單。
          </p>
          <Link href="/profile/details" className="inline-block mt-6 px-8 py-3 bg-accent text-white rounded-full font-mono text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
            立即完善資料
          </Link>
        </section>
      </div>
    </ProfileLayout>
  );
}
