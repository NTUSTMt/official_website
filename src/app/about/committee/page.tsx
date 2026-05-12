import React from "react";
import Navbar from "@/components/Navbar";

export default function CommitteePage() {
  const roles = [
    { title: "社長 (President)", responsibility: "綜理全社事務，對外代表本社，主持各項會議。" },
    { title: "副社長 (Vice President)", responsibility: "襄助社長處理社務，於社長因故不能執行職務時代理之。" },
    { title: "行政長 (Secretary)", responsibility: "負責社團公文、會議紀錄、通訊錄管理及資料歸檔。" },
    { title: "財務長 (Treasurer)", responsibility: "負責經費收支、預決算編制及財務報告。" },
    { title: "裝備長 (Quartermaster)", responsibility: "負責社產裝備之採購、租借管理、維護及盤點。" },
    { title: "技術長 (Technical Director)", responsibility: "負責登山技術之培訓、嚮導訓練、活動安全之審核。" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <section className="mb-20">
          <h1 className="text-5xl md:text-7xl font-display italic mb-6 tracking-tight">
            幹部與職責 <span className="text-muted/20">Roles</span>
          </h1>
          <div className="h-1 w-24 bg-accent mb-12"></div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {roles.map((role, i) => (
            <div key={i} className="p-10 border border-border bg-surface hover:bg-white transition-colors rounded-3xl shadow-sm border-l-8 border-l-accent">
              <h3 className="text-xl font-mono font-bold text-accent mb-4 uppercase tracking-wider">{role.title}</h3>
              <p className="font-serif text-muted text-lg leading-relaxed">
                {role.responsibility}
              </p>
            </div>
          ))}
        </section>

        <p className="mt-24 text-center font-mono text-[10px] text-muted/40 uppercase tracking-[0.2em]">
          NTUST Mountaineering Club · Organization
        </p>
      </div>
    </main>
  );
}
