import React from "react";
import Navbar from "@/components/Navbar";

export default function ServicesPage() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display italic mb-8">社員服務</h1>
        <div className="prose max-w-none text-muted font-serif leading-relaxed">
          <p>
            本社團提供多元的社員服務，包含裝備租借、技術訓練、以及圖書資源借閱。
            更多詳細功能將在未來陸續開放。
          </p>
        </div>
      </div>
    </main>
  );
}
