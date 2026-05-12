import React from "react";
import Navbar from "@/components/Navbar";
import { rentalRules } from "@/data/equipment";

export default function RentalRulesPage() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-5xl mx-auto">
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">Policy & Pricing</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display italic mb-8 tracking-tight">租借規則與費用</h1>
          <p className="text-xl font-serif text-muted max-w-3xl leading-relaxed">
            為了確保社產的永續使用，請在租借前詳閱以下規則。
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Rules Section */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl font-display italic mb-8 border-b border-border pb-4">租借守則 Rules</h2>
            <div className="space-y-4">
              {rentalRules.map((rule, idx) => (
                <div key={idx} className="p-8 bg-surface border border-border rounded-3xl hover:border-accent/30 transition-colors">
                  <p className="font-serif text-muted leading-relaxed">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Matrix Section */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div className="p-10 bg-accent text-white rounded-[3rem] shadow-2xl shadow-accent/20">
                <h3 className="text-2xl font-display italic mb-6">費用試算說明</h3>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="font-serif italic">社員用於社團活動</span>
                    <span className="font-mono font-bold text-xl">免費</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="font-serif italic">非社員用於社團活動</span>
                    <span className="font-mono font-bold text-xl">免費</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="font-serif italic">社員個人使用</span>
                    <span className="font-mono font-bold text-xl">5 折租金</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-4">
                    <span className="font-serif italic">非社員個人使用</span>
                    <span className="font-mono font-bold text-xl">全額租金</span>
                  </div>
                </div>

                <div className="mt-10 p-6 bg-white/10 rounded-2xl text-[10px] font-mono uppercase tracking-widest leading-relaxed">
                  * 租金試算以「2天」為基本單位<br />
                  * 超過 2 天之部分按「每日加價」計算
                </div>
              </div>

              <div className="p-10 bg-surface border border-border rounded-[3rem]">
                <h3 className="text-xl font-display italic mb-4">損壞賠償 Damage</h3>
                <p className="text-sm font-serif text-muted leading-relaxed italic">
                  裝備如有明顯人為損壞，由器材長評估維修費用，借用人須負擔全額維修費。
                  若無法修復或遺失，則依該裝備當時之市價進行賠償。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
