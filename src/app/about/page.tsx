import React from "react";
import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display italic mb-8">關於我們</h1>
        <div className="prose max-w-none text-muted font-serif leading-relaxed">
          <p className="text-xl mb-6">
            台科大登山社成立於 1985 年，是一個致力於推廣高海拔探索與荒野保護的大學社團。
          </p>
          <p className="mb-6">
            我們相信，登山不僅是一項運動，更是一種與自然對話的方式。透過嚴格的行前訓練、完善的裝備管理以及紮實的實務經驗，我們帶領社員安全地親近台灣百岳，並培養出獨立自主、團隊合作的山野精神。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="p-8 border border-border bg-surface">
              <h3 className="text-xl font-display italic mb-4 text-accent">核心理念</h3>
              <ul className="list-disc pl-5 space-y-2 font-mono text-sm">
                <li>安全第一，落實 LNT 無痕山林</li>
                <li>傳承經驗，培養獨立嚮導能力</li>
                <li>社團透明，建立完善管理制度</li>
              </ul>
            </div>
            <div className="p-8 border border-border bg-surface">
              <h3 className="text-xl font-display italic mb-4 text-accent">組織架構</h3>
              <ul className="list-disc pl-5 space-y-2 font-mono text-sm">
                <li>社長與行政團隊</li>
                <li>技術與裝備管理組</li>
                <li>活動與課程策劃組</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
