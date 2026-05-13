"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { mockCMSConfig } from "@/data/cms";
import { historyData, introductionContent } from "@/data/history";
import { committeeData } from "@/data/committee";
import { historyService, cmsService } from "@/services/cmsService";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { AlertTriangle, Save, Bell, Settings, History, Upload, Image as ImageIcon, X } from "lucide-react";

type Tab = "GENERAL" | "ABOUT" | "LEADERSHIP" | "ROLES" | "LEVELS";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("GENERAL");
  const [config, setConfig] = useState(mockCMSConfig);
  const [history, setHistory] = useState(historyData);
  const [intro, setIntro] = useState(introductionContent);
  const [committees, setCommittees] = useState(committeeData);
  const [rolesData, setRolesData] = useState<{
    roles: { title: string, description: string }[],
    commonResponsibilities: string[],
    mountainDuties: { title: string, description: string }[]
  }>({
    roles: [],
    commonResponsibilities: [],
    mountainDuties: []
  });
  const [levels, setLevels] = useState<{
    level: number;
    label: string;
    description: string;
    example: string;
    color: string;
  }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      if (!isSupabaseConfigured) {
        console.warn("Supabase is not configured. Running in Mock Mode.");
        setIsLoading(false);
        return;
      }
      
      try {
        const dbConfig = await cmsService.getConfig();
        const dbHistory = await historyService.getMilestones();
        
        if (dbConfig) setConfig(dbConfig);
        
        // Fetch About Intro
        const { data: introData } = await supabase
          .from("cms_config")
          .select("content")
          .eq("id", "about_intro")
          .single();
        if (introData?.content) setIntro(introData.content as any);

        // Fetch Committee Data
        const dbCommittees = await historyService.getCommittees();
        if (dbCommittees && dbCommittees.length > 0) setCommittees(dbCommittees);

        // Fetch Committee Roles
        const dbRoles = await historyService.getCommitteeRoles();
        if (dbRoles) setRolesData(dbRoles);

        // Fetch Activity Levels
        const dbLevels = await historyService.getActivityLevels();
        if (dbLevels) setLevels(dbLevels);

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
        
        // Save About Intro
        if (isSupabaseConfigured) {
          const { error: introError } = await supabase
            .from("cms_config")
            .upsert({
              id: "about_intro",
              content: intro,
              updated_at: new Date().toISOString()
            });
          if (introError) throw introError;
        }
      } else if (activeTab === "LEADERSHIP") {
        // Save Committee Data
        if (isSupabaseConfigured) {
          await historyService.saveCommittees(committees);
        }
      } else if (activeTab === "ROLES") {
        // Save Committee Roles
        if (isSupabaseConfigured) {
          await historyService.saveCommitteeRoles(rolesData);
        }
      } else if (activeTab === "LEVELS") {
        // Save Activity Levels
        if (isSupabaseConfigured) {
          await historyService.saveActivityLevels(levels);
        }
      }
      alert("儲存成功！資料已同步至 Supabase。");
    } catch (err: any) {
      alert(`儲存失敗：${err.message || "未知錯誤"}，請檢查網路或控制台。`);
      console.error("Save failed details:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (yIdx: number, mIdx: number, file: File) => {
    if (!isSupabaseConfigured) {
      alert("Supabase Not Configured");
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${committees[yIdx].year}_${committees[yIdx].members[mIdx].name}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const newCommittees = [...committees];
      newCommittees[yIdx].members[mIdx].avatar = publicUrl;
      setCommittees(newCommittees);
      
      alert("照片上傳成功！");
    } catch (error) {
      console.error('Error uploading image:', error);
      alert("照片上傳失敗，請確保 Supabase Storage 已建立名為 'official' 的公開 Bucket。");
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

  const TabButton = ({ id, label, activeTab, setActiveTab }: { id: Tab, label: string, activeTab: Tab, setActiveTab: (id: Tab) => void }) => (
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
          <div className="font-mono text-xs animate-pulse">正在連線至資料庫...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
          {!isSupabaseConfigured && (
            <div className="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
              <div className="text-amber-500 bg-white p-2 rounded-xl shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-amber-800 font-bold text-sm mb-1">尚未設定資料庫連線 (Supabase Not Configured)</h3>
                <p className="text-amber-700 text-xs leading-relaxed">
                  目前正在使用本地模擬資料 (Mock Mode)。若要同步真實資料庫，請在 <code>.env.local</code> 中設定 
                  <code>NEXT_PUBLIC_SUPABASE_URL</code> 與 <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>。
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display italic mb-2">全站內容管理</h1>
              <p className="text-sm font-serif text-muted">修改網頁靜態內容、公告與社團歷史資料。</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 min-w-[120px] flex items-center justify-center gap-2"
            >
              {isSaving ? "正在儲存..." : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  儲存至資料庫
                </>
              )}
            </button>
          </div>

          <div className="flex border-b border-border mb-10 overflow-x-auto">
            <TabButton id="GENERAL" label="一般參數設定" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="ABOUT" label="關於我們 CMS" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="LEADERSHIP" label="歷任幹部管理" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="ROLES" label="職責說明 CMS" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="LEVELS" label="活動分級 CMS" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {activeTab === "GENERAL" && (
            <div className="space-y-12">

              {/* Announcement Section */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6 border-b border-border/50 pb-4">
                  <div>
                    <h2 className="text-xl font-display italic text-foreground mb-1">置頂公告 (Announcement Bar)</h2>
                    <p className="text-xs font-mono text-muted uppercase tracking-widest">全站跑馬燈公告</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={config.announcement.enabled} onChange={(e) => handleChange("announcement", "enabled", e.target.checked)} />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
                
                <div className={`space-y-6 transition-opacity duration-300 ${!config.announcement.enabled && "opacity-50 pointer-events-none"}`}>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">公告內容 (Announcement Text)</label>
                    <input 
                      type="text" 
                      value={config.announcement.text} 
                      onChange={(e) => handleChange("announcement", "text", e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">超連結網址 (Action Link URL)</label>
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
                <SectionHeader title="全站參數設定 (Global Parameters)" subtitle="費用與運作配置" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3">財務參數配置</h3>
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
                    <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3">社辦營運配置</h3>
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
                <SectionHeader title="關於我們簡介" subtitle="網站簡介內容" />
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
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Introduction Paragraphs (介紹內文，每行一個段落)</label>
                    <textarea 
                      value={intro.paragraphs.join("\n\n")} 
                      onChange={(e) => setIntro(prev => ({ ...prev, paragraphs: e.target.value.split("\n\n").filter(p => p.trim() !== "") }))}
                      rows={8}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors leading-relaxed"
                      placeholder="輸入社團介紹內文..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Core Values (核心價值，每行一個)</label>
                    <textarea 
                      value={intro.coreValues.join("\n")} 
                      onChange={(e) => setIntro(prev => ({ ...prev, coreValues: e.target.value.split("\n").filter(v => v.trim() !== "") }))}
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
                    <p className="text-xs font-mono text-muted uppercase tracking-widest">歷史大事記管理</p>
                  </div>
                  <button 
                    onClick={() => setHistory(prev => [...prev, { year: "New", title: "New Milestone", content: "" }])}
                    className="px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg text-[10px] font-mono uppercase tracking-widest hover:bg-accent/20 transition-all"
                  >
                    + 新增里程碑
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
            </div>
          )}

          {activeTab === "LEADERSHIP" && (
            <div className="space-y-12">
              {/* Committee Management */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
                  <div>
                    <h2 className="text-xl font-display italic text-foreground mb-1">歷任幹部管理</h2>
                    <p className="text-xs font-mono text-muted uppercase tracking-widest">歷任幹部資料庫管理</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (confirm("這將會從程式碼中載入原始的歷屆幹部資料（46 年份），這會覆蓋您目前在畫面上的編輯內容，確定嗎？")) {
                          setCommittees(committeeData);
                        }
                      }}
                      className="px-4 py-2 bg-muted/10 text-muted border border-border rounded-lg text-[10px] font-mono uppercase tracking-widest hover:bg-muted/20 transition-all"
                    >
                      匯入靜態資料
                    </button>
                    <button 
                      onClick={() => setCommittees(prev => [{ year: "114", members: [] }, ...prev])}
                      className="px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg text-[10px] font-mono uppercase tracking-widest hover:bg-accent/20 transition-all"
                    >
                      + 新增學年度
                    </button>
                  </div>
                </div>
                
                <div className="space-y-12">
                  {committees.map((yearGroup, yIdx) => (
                    <div key={yIdx} className="p-8 bg-background border border-border rounded-2xl relative group/year">
                      <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-4">
                          <input 
                            type="text" 
                            value={yearGroup.year} 
                            onChange={(e) => {
                              const newCommittees = [...committees];
                              newCommittees[yIdx].year = e.target.value;
                              setCommittees(newCommittees);
                            }}
                            className="bg-surface border border-border px-4 py-2 rounded-xl text-xl font-display italic w-32"
                            placeholder="Year"
                          />
                          <span className="text-sm font-serif text-muted">學年度</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              const newCommittees = [...committees];
                              newCommittees[yIdx].members.push({ name: "", role: "社長", dept: "", intro: "", avatar: "" });
                              setCommittees(newCommittees);
                            }}
                            className="px-3 py-1.5 bg-accent/5 text-accent border border-accent/10 rounded-lg text-[9px] font-mono uppercase tracking-tighter hover:bg-accent/10"
                          >
                            + 新增成員
                          </button>
                          <button 
                            onClick={() => setCommittees(prev => prev.filter((_, i) => i !== yIdx))}
                            className="p-1.5 text-red-400 hover:text-red-600 border border-transparent hover:border-red-100 rounded-lg transition-all"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {yearGroup.members.map((member, mIdx) => (
                          <div key={mIdx} className="p-5 bg-surface border border-border rounded-xl relative group/member hover:border-accent/30 transition-all">
                            <button 
                              onClick={() => {
                                const newCommittees = [...committees];
                                newCommittees[yIdx].members = newCommittees[yIdx].members.filter((_, i) => i !== mIdx);
                                setCommittees(newCommittees);
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-member/member:opacity-100 hover:bg-red-500 hover:text-white transition-all text-[10px] border border-red-100"
                            >
                              ×
                            </button>
                            
                            <div className="flex gap-4 items-start">
                              {/* Avatar Upload/Preview */}
                              <div className="w-16 h-16 bg-background border border-border rounded-full overflow-hidden flex-shrink-0 relative group/avatar">
                                {member.avatar ? (
                                  <img src={member.avatar} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted/20">
                                    <ImageIcon className="w-6 h-6" />
                                  </div>
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                  <Upload className="w-4 h-4 text-white" />
                                  <input 
                                    type="file" 
                                    className="sr-only" 
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleFileUpload(yIdx, mIdx, file);
                                    }}
                                  />
                                </label>
                                {member.avatar && (
                                  <button 
                                    onClick={() => {
                                      const newCommittees = [...committees];
                                      newCommittees[yIdx].members[mIdx].avatar = "";
                                      setCommittees(newCommittees);
                                    }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>

                              <div className="flex-1 space-y-4">
                                <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    value={member.role} 
                                    onChange={(e) => {
                                      const newCommittees = [...committees];
                                      newCommittees[yIdx].members[mIdx].role = e.target.value;
                                      setCommittees(newCommittees);
                                    }}
                                    className="w-1/3 bg-background border border-border px-2 py-1.5 rounded-lg text-[10px] font-mono text-accent uppercase font-bold"
                                    placeholder="Role"
                                  />
                                  <input 
                                    type="text" 
                                    value={member.name} 
                                    onChange={(e) => {
                                      const newCommittees = [...committees];
                                      newCommittees[yIdx].members[mIdx].name = e.target.value;
                                      setCommittees(newCommittees);
                                    }}
                                    className="flex-1 bg-background border border-border px-2 py-1.5 rounded-lg text-sm font-display italic"
                                    placeholder="Name"
                                  />
                                </div>
                                <input 
                                  type="text" 
                                  value={member.dept} 
                                  onChange={(e) => {
                                    const newCommittees = [...committees];
                                    newCommittees[yIdx].members[mIdx].dept = e.target.value;
                                    setCommittees(newCommittees);
                                  }}
                                  className="w-full bg-background border border-border px-2 py-1.5 rounded-lg text-[10px] font-mono text-muted uppercase"
                                  placeholder="Department (e.g. 四營建三)"
                                />
                              </div>
                            </div>
                            
                            <textarea 
                              value={member.intro} 
                              onChange={(e) => {
                                const newCommittees = [...committees];
                                newCommittees[yIdx].members[mIdx].intro = e.target.value;
                                setCommittees(newCommittees);
                              }}
                              className="w-full bg-background border border-border px-2 py-1.5 rounded-lg text-xs font-serif text-muted italic mt-4"
                              placeholder="Introduction Quote"
                              rows={2}
                            />
                          </div>
                        ))}
                        {yearGroup.members.length === 0 && (
                          <div className="col-span-full py-8 border-2 border-dashed border-border rounded-xl flex items-center justify-center text-muted/30 text-xs font-mono uppercase">
                            尚無成員資料
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === "ROLES" && (
            <div className="space-y-12">
              {/* Roles & Responsibilities Management */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="幹部職責說明管理" subtitle="職責與任務說明管理" />
                
                <div className="space-y-12">
                  {/* Individual Roles */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3">幹部分工 (Individual Roles)</h3>
                      <button 
                        onClick={() => setRolesData(prev => ({ ...prev, roles: [...prev.roles, { title: "", description: "" }] }))}
                        className="text-[10px] font-mono text-accent hover:underline"
                      >
                        + 新增職位
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rolesData.roles.map((role: any, idx: number) => (
                        <div key={idx} className="p-4 bg-background border border-border rounded-xl space-y-3 group">
                          <div className="flex justify-between items-center">
                            <input 
                              type="text" 
                              value={role.title} 
                              onChange={(e) => {
                                const newRoles = [...rolesData.roles];
                                newRoles[idx].title = e.target.value;
                                setRolesData(prev => ({ ...prev, roles: newRoles }));
                              }}
                              className="bg-surface border border-border px-3 py-1 rounded text-xs font-bold text-accent"
                              placeholder="Role Title"
                            />
                            <button onClick={() => setRolesData(prev => ({ ...prev, roles: prev.roles.filter((_, i) => i !== idx) }))} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <textarea 
                            value={role.description} 
                            onChange={(e) => {
                              const newRoles = [...rolesData.roles];
                              newRoles[idx].description = e.target.value;
                              setRolesData(prev => ({ ...prev, roles: newRoles }));
                            }}
                            className="w-full bg-surface border border-border px-3 py-2 rounded text-xs font-serif text-muted"
                            placeholder="Role Description"
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Responsibilities */}
                  <div>
                    <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3 mb-6">幹部共同職責 (Shared Duties)</h3>
                    <textarea 
                      value={rolesData.commonResponsibilities.join("\n")} 
                      onChange={(e) => setRolesData(prev => ({ ...prev, commonResponsibilities: e.target.value.split("\n").filter(l => l.trim() !== "") }))}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                      rows={4}
                      placeholder="每行一項共同職責..."
                    />
                  </div>

                  {/* Mountain Duties */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3">上山後的工作 (Mountain Duties)</h3>
                      <button 
                        onClick={() => setRolesData(prev => ({ ...prev, mountainDuties: [...prev.mountainDuties, { title: "", description: "" }] }))}
                        className="text-[10px] font-mono text-accent hover:underline"
                      >
                        + 新增任務
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rolesData.mountainDuties.map((duty: any, idx: number) => (
                        <div key={idx} className="p-4 bg-background border border-border rounded-xl space-y-3 group">
                          <div className="flex justify-between items-center">
                            <input 
                              type="text" 
                              value={duty.title} 
                              onChange={(e) => {
                                const newDuties = [...rolesData.mountainDuties];
                                newDuties[idx].title = e.target.value;
                                setRolesData(prev => ({ ...prev, mountainDuties: newDuties }));
                              }}
                              className="bg-surface border border-border px-3 py-1 rounded text-xs font-bold text-emerald-600"
                              placeholder="Duty Title"
                            />
                            <button onClick={() => setRolesData(prev => ({ ...prev, mountainDuties: prev.mountainDuties.filter((_, i) => i !== idx) }))} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <textarea 
                            value={duty.description} 
                            onChange={(e) => {
                              const newDuties = [...rolesData.mountainDuties];
                              newDuties[idx].description = e.target.value;
                              setRolesData(prev => ({ ...prev, mountainDuties: newDuties }));
                            }}
                            className="w-full bg-surface border border-border px-3 py-2 rounded text-xs font-serif text-muted"
                            placeholder="Duty Description"
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "LEVELS" && (
            <div className="space-y-12">
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="活動分級說明管理" subtitle="活動難度與分級標準" />
                <div className="space-y-8">
                  {levels.map((level, idx) => (
                    <div key={idx} className="p-8 bg-background border border-border rounded-2xl group hover:border-accent transition-all relative">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-32 flex-shrink-0">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-mono text-xl mb-4 ${level.color}`}>
                            L{level.level}
                          </div>
                          <input 
                            type="text" 
                            value={level.label} 
                            onChange={(e) => {
                              const newLevels = [...levels];
                              newLevels[idx].label = e.target.value;
                              setLevels(newLevels);
                            }}
                            className="w-full bg-surface border border-border px-3 py-1 rounded text-lg font-display italic"
                            placeholder="Label"
                          />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="block text-[9px] font-mono text-muted uppercase tracking-widest mb-1">Description</label>
                            <textarea 
                              value={level.description} 
                              onChange={(e) => {
                                const newLevels = [...levels];
                                newLevels[idx].description = e.target.value;
                                setLevels(newLevels);
                              }}
                              className="w-full bg-surface border border-border px-4 py-2 rounded-xl text-sm font-serif leading-relaxed"
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-muted uppercase tracking-widest mb-1">Example Routes</label>
                            <input 
                              type="text" 
                              value={level.example} 
                              onChange={(e) => {
                                const newLevels = [...levels];
                                newLevels[idx].example = e.target.value;
                                setLevels(newLevels);
                              }}
                              className="w-full bg-surface border border-border px-4 py-2 rounded-xl text-xs font-serif italic"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

        </div>
    </AdminLayout>

  );
}
