import React from "react";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display italic mb-8">聯絡我們</h1>
        <div className="p-8 border border-border bg-surface">
          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-xs text-muted uppercase tracking-widest font-bold mb-2">社辦位置 (Basecamp)</h3>
              <p className="font-serif text-fg">台灣科技大學 B1 登山社辦公室</p>
            </div>
            <div>
              <h3 className="font-mono text-xs text-muted uppercase tracking-widest font-bold mb-2">Email</h3>
              <p className="font-serif text-fg">mountaineering@mail.ntust.edu.tw</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
