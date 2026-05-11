import React from "react";
import Navbar from "@/components/Navbar";

export default function EquipmentPage() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display italic mb-4">裝備租借中心</h1>
        <p className="text-muted font-serif mb-12">高品質裝備，為每一次安全攀登保駕護航。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-border bg-surface">
            <div className="h-40 bg-background mb-4 flex items-center justify-center font-mono text-xs text-muted">Image Placeholder</div>
            <h3 className="text-xl font-display italic mb-2">神秘農場 Terraframe 65L</h3>
            <div className="flex justify-between items-center mt-4">
              <span className="font-mono text-accent text-sm">NT$ 150 / 天</span>
              <span className="font-mono text-[10px] bg-accent/10 text-accent px-2 py-1 rounded">庫存: 3</span>
            </div>
          </div>
          <div className="p-6 border border-border bg-surface">
            <div className="h-40 bg-background mb-4 flex items-center justify-center font-mono text-xs text-muted">Image Placeholder</div>
            <h3 className="text-xl font-display italic mb-2">MSR Hubba NX 雙人帳</h3>
            <div className="flex justify-between items-center mt-4">
              <span className="font-mono text-accent text-sm">NT$ 200 / 天</span>
              <span className="font-mono text-[10px] bg-accent/10 text-accent px-2 py-1 rounded">庫存: 1</span>
            </div>
          </div>
          <div className="p-6 border border-border bg-surface opacity-60">
            <div className="h-40 bg-background mb-4 flex items-center justify-center font-mono text-xs text-muted">Image Placeholder</div>
            <h3 className="text-xl font-display italic mb-2">Black Diamond 登山杖</h3>
            <div className="flex justify-between items-center mt-4">
              <span className="font-mono text-muted text-sm">NT$ 50 / 天</span>
              <span className="font-mono text-[10px] border border-border text-muted px-2 py-1 rounded">租借中</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
