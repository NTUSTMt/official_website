"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { mockCMSConfig } from "@/data/cms";
import { historyData, introductionContent } from "@/data/history";
import { committeeData } from "@/data/committee";
import { cmsService, historyService } from "@/services/cmsService";

type Tab = "GENERAL" | "ABOUT";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("GENERAL");
  const [config, setConfig] = useState(mockCMSConfig);
  const [history, setHistory] = useState(historyData);
  const [intro, setIntro] = useState(introductionContent);
  const [committees, setCommittees] = useState(committeeData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const dbConfig = await cmsService.getConfig();
        const dbHistory = await historyService.getMilestones();
        
        if (dbConfig) setConfig(dbConfig);
        if (dbHistory && dbHistory.length > 0) {
          setHistory(dbHistory.map(h => ({
            year: h.year,
            title: h.title,
            content: h.content
          })));
        }
      } catch (err) {
        console.error("Failed to load DB data, using mocks:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "GENERAL") {
        await cmsService.updateConfig(config);
      } else if (activeTab === "ABOUT") {
        await historyService.saveMilestones(history);
        // Note: Committee migration can be added later
      }
      alert("儲存成功！資料已同步至 Supabase。");
    } catch (err) {
      alert("儲存失敗，請檢查網路或控制台報錯。");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    setConfig(prev => {
      if (section) {
        return {
          ...prev,
          [section as keyof typeof config]: {
            ...(prev[section as keyof typeof config] as any),
            [field]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="mb-6 border-b border-border/50 pb-4">
      <h2 className="text-xl font-display italic text-foreground mb-1">{title}</h2>
      <p className="text-xs font-mono text-muted uppercase tracking-widest">{subtitle}</p>
    </div>
  );

  const TabButton = ({ id, label }: { id: Tab, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-8 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all ${
        activeTab === id ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="font-mono text-xs animate-pulse">CONNECTING_TO_SUPABASE...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">全站內容管理</h1>
            <p className="text-sm font-serif text-muted">修改網頁靜態內容、公告與社團歷史資料。</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 min-w-[120px]"
          >
            {isSaving ? "SAVING..." : "SAVE_TO_DB"}
          </button>
        </div>

        <div className="flex border-b border-border mb-10 overflow-x-auto">
          <TabButton id="GENERAL" label="General_Settings" />
          <TabButton id="ABOUT" label="About_Us_CMS" />
        </div>

        {activeTab === "GENERAL" && (
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
              <SectionHeader title="首頁視覺 (Hero Section)" subtitle="Homepage_Hero_Config" />
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Hero Tagline</label>
                  <input 
                    type="text" 
                    value={config.heroTagline} 
                    onChange={(e) => handleChange("", "heroTagline", e.target.value)}
                    className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Hero Subtext</label>
                  <textarea 
                    value={config.heroSubtext} 
                    onChange={(e) => handleChange("", "heroSubtext", e.target.value)}
                    rows={3}
                    className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Stats: Expeditions</label>
                    <input type="text" value={config.stats.expeditions} onChange={(e) => handleChange("stats", "expeditions", e.target.value)} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Stats: Members</label>
                    <input type="text" value={config.stats.members} onChange={(e) => handleChange("stats", "members", e.target.value)} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Stats: Years</label>
                    <input type="text" value={config.stats.years} onChange={(e) => handleChange("stats", "years", e.target.value)} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors" />
                  </div>
                </div>
              </div>
            </section>

            {/* Announcement Section */}
            <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-start mb-6 border-b border-border/50 pb-4">
                <div>
                  <h2 className="text-xl font-display italic text-foreground mb-1">置頂公告 (Announcement Bar)</h2>
                  <p className="text-xs font-mono text-muted uppercase tracking-widest">Global_Announcement</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={config.announcement.enabled} onChange={(e) => handleChange("announcement", "enabled", e.target.checked)} />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              
              <div className={`space-y-6 transition-opacity duration-300 ${!config.announcement.enabled && "opacity-50 pointer-events-none"}`}>
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Announcement Text</label>
                  <input 
                    type="text" 
                    value={config.announcement.text} 
                    onChange={(e) => handleChange("announcement", "text", e.target.value)}
                    className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Action Link (URL)</label>
                  <input 
                    type="text" 
                    value={config.announcement.link} 
                    onChange={(e) => handleChange("announcement", "link", e.target.value)}
                    className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* Global Parameters */}
            <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
              <SectionHeader title="全站參數設定 (Global Parameters)" subtitle="Fees_&_Operations" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3">Financial_Config</h3>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">入社費 (NTD)</label>
                    <input type="number" value={config.fees.membershipFee} onChange={(e) => handleChange("fees", "membershipFee", Number(e.target.value))} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">銀行代碼</label>
                      <input type="text" value={config.fees.bankCode} onChange={(e) => handleChange("fees", "bankCode", e.target.value)} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">銀行名稱</label>
                      <input type="text" value={config.fees.bankName} onChange={(e) => handleChange("fees", "bankName", e.target.value)} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">匯款帳號</label>
                    <input type="text" value={config.fees.accountNumber} onChange={(e) => handleChange("fees", "accountNumber", e.target.value)} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors" />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3">Operational_Config</h3>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">社辦開放時間</label>
                    <input type="text" value={config.officeHours} onChange={(e) => handleChange("", "officeHours", e.target.value)} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "ABOUT" && (
          <div className="space-y-12">
            {/* Introduction Management */}
            <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
              <SectionHeader title="關於我們簡介" subtitle="Introduction_Content" />
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Quote (引用金句)</label>
                  <input 
                    type="text" 
                    value={intro.quote} 
                    onChange={(e) => setIntro(prev => ({ ...prev, quote: e.target.value }))}
                    className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Core Values (核心價值，每行一個)</label>
                  <textarea 
                    value={intro.coreValues.join("\n")} 
                    onChange={(e) => setIntro(prev => ({ ...prev, coreValues: e.target.value.split("\n") }))}
                    rows={4}
                    className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
            </section>

            {/* History Management */}
            <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
                <div>
                  <h2 className="text-xl font-display italic text-foreground mb-1">歷史時光軸</h2>
                  <p className="text-xs font-mono text-muted uppercase tracking-widest">History_Timeline_CRUD</p>
                </div>
                <button 
                  onClick={() => setHistory(prev => [...prev, { year: "New", title: "New Milestone", content: "" }])}
                  className="px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg text-[10px] font-mono uppercase tracking-widest hover:bg-accent/20 transition-all"
                >
                  + Add Event
                </button>
              </div>
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="p-6 bg-background border border-border rounded-2xl group hover:border-accent transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <input 
                            type="text" 
                            value={item.year} 
                            onChange={(e) => {
                              const newHistory = [...history];
                              newHistory[idx].year = e.target.value;
                              setHistory(newHistory);
                            }}
                            className="sm:col-span-1 bg-surface border border-border px-3 py-2 rounded-lg text-xs font-mono" 
                            placeholder="Year" 
                          />
                          <input 
                            type="text" 
                            value={item.title} 
                            onChange={(e) => {
                              const newHistory = [...history];
                              newHistory[idx].title = e.target.value;
                              setHistory(newHistory);
                            }}
                            className="sm:col-span-3 bg-surface border border-border px-3 py-2 rounded-lg text-sm font-serif font-bold" 
                            placeholder="Title" 
                          />
                        </div>
                        <textarea 
                          value={item.content} 
                          onChange={(e) => {
                            const newHistory = [...history];
                            newHistory[idx].content = e.target.value;
                            setHistory(newHistory);
                          }}
                          rows={2} 
                          className="w-full bg-surface border border-border px-3 py-2 rounded-lg text-xs font-serif text-muted" 
                          placeholder="Content Description" 
                        />
                      </div>
                      <button 
                        onClick={() => setHistory(prev => prev.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Note: Committee section hidden for now to focus on CMS migration */}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
