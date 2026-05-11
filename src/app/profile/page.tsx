import React from "react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display italic mb-8">我的足跡</h1>
        
        <div className="p-8 border border-border bg-surface mb-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-full bg-background border-2 border-accent/30 overflow-hidden flex items-center justify-center text-muted font-mono text-xs">
            Avatar
          </div>
          <div>
            <div className="font-mono text-xs text-accent mb-2 font-bold tracking-widest">MEMBER_ID: #8512</div>
            <h2 className="text-2xl font-display italic mb-2">未登入</h2>
            <p className="text-muted font-serif text-sm">請登入以查看您的數位會員證與完整登山紀錄。</p>
          </div>
          <div className="md:ml-auto">
            <button className="px-6 py-2 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest font-bold hover:opacity-90 transition-opacity">
              登入 / 註冊
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 border border-border bg-surface opacity-50">
            <h3 className="text-xl font-display italic mb-4">近期活動紀錄</h3>
            <p className="text-muted font-serif text-sm">尚未有活動紀錄。</p>
          </div>
          <div className="p-8 border border-border bg-surface opacity-50">
            <h3 className="text-xl font-display italic mb-4">裝備租借狀態</h3>
            <p className="text-muted font-serif text-sm">目前無租借中裝備。</p>
          </div>
        </div>
      </div>
    </main>
  );
}
