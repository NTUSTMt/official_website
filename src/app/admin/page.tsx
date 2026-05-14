"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { mockCMSConfig, type GlobalConfig } from "@/data/cms";
import { historyData, introductionContent } from "@/data/history";
import { committeeData } from "@/data/committee";
import { historyService, cmsService } from "@/services/cmsService";
import { updateGlobalConfigAction, saveHistoryMilestonesAction, saveCommitteesAction, saveCmsConfigAction, uploadFileAction } from "./cms-actions";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { AlertTriangle, Save, Bell, Settings, History, Upload, Image as ImageIcon, X, Mail, Link as LinkIcon, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

type Tab = "HOMEPAGE" | "GENERAL" | "ABOUT_CMS" | "LEADERSHIP" | "LEVELS" | "CONTACT" | "FOOTER";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("HOMEPAGE");
  const [config, setConfig] = useState<GlobalConfig>(mockCMSConfig);
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
  const [contactInfo, setContactInfo] = useState<{
    line: { link: string, qrcode: string, description: string },
    instagram: { link: string, qrcode: string, description: string },
    facebook: { link: string, qrcode: string, description: string },
    email: { link: string, qrcode: string, description: string },
    basecamp: { location: string, hours: string, mapsLink: string, detail: string, mapEmbed?: string },
    footer: { slogan: string, copyright: string, credits: string }
  }>({
    line: { link: "", qrcode: "", description: "" },
    instagram: { link: "", qrcode: "", description: "" },
    facebook: { link: "", qrcode: "", description: "" },
    email: { link: "", qrcode: "", description: "" },
    basecamp: { location: "", hours: "", mapsLink: "", detail: "", mapEmbed: "" },
    footer: { slogan: "", copyright: "", credits: "" }
  });
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

        // Fetch Contact Info
        const dbContact = await cmsService.getContactInfo();
        if (dbContact) setContactInfo(dbContact);

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
      if (activeTab === "GENERAL" || activeTab === "HOMEPAGE") {
        await updateGlobalConfigAction(config);
      } else if (activeTab === "ABOUT_CMS") {
        // 儲存關於山社的所有內容
        await saveHistoryMilestonesAction(history);
        if (isSupabaseConfigured) {
          await saveCmsConfigAction("about_intro", intro);
          await saveCmsConfigAction("committee_roles", rolesData);
        }
      } else if (activeTab === "LEADERSHIP") {
        // 儲存歷任幹部
        if (isSupabaseConfigured) {
          await saveCommitteesAction(committees);
        }
      } else if (activeTab === "LEVELS") {
        // Save Activity Levels
        if (isSupabaseConfigured) {
          await saveCmsConfigAction("activity_levels", levels);
        }
      } else if (activeTab === "CONTACT") {
        // Save Contact Info
        if (isSupabaseConfigured) {
          await saveCmsConfigAction("contact_info", contactInfo);
        }
      } else if (activeTab === "FOOTER") {
        // Save Footer Config (Source data is in Global and Contact)
        if (isSupabaseConfigured) {
          await updateGlobalConfigAction(config);
          await saveCmsConfigAction("contact_info", contactInfo);
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
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "avatars");
      formData.append("path", fileName);

      const result = await uploadFileAction(formData);

      if (!result.success) throw new Error(result.error);

      const newCommittees = [...committees];
      newCommittees[yIdx].members[mIdx].avatar = result.publicUrl;
      setCommittees(newCommittees);
      
      alert("照片上傳成功！");
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`照片上傳失敗：${error.message || "請檢查 Supabase Storage 設定"}`);
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
            <TabButton id="HOMEPAGE" label="首頁內容 CMS" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="ABOUT_CMS" label="關於山社 CMS" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="LEADERSHIP" label="歷任幹部管理" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="LEVELS" label="活動分級 CMS" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="CONTACT" label="聯絡我們管理" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="FOOTER" label="頁腳設定 CMS" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton id="GENERAL" label="公告管理" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Contact Management Tab Content */}
          {activeTab === "CONTACT" && (
            <div className="space-y-12">
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="社群與聯絡管道管理" subtitle="管理 LINE、Instagram、Facebook 與 Email 資訊" />
                
                <div className="flex flex-col gap-6">
                  {(['line', 'instagram', 'facebook', 'email'] as const).map((platform) => (
                    <div key={platform} className="p-8 bg-background border border-border rounded-[2rem] group hover:border-accent transition-all relative">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Title and Info */}
                        <div className="w-full md:w-48 flex-shrink-0">
                          <div className="flex items-center gap-3 mb-4">
                            <h3 className="text-lg font-display italic text-foreground capitalize">{platform}</h3>
                          </div>
                          
                          {/* QR Code Upload (Smaller in admin horizontal) */}
                          <div className="w-32 h-32 bg-surface border border-dashed border-border rounded-2xl overflow-hidden relative group/qr">
                            {contactInfo[platform].qrcode ? (
                              <img src={contactInfo[platform].qrcode} alt="QR Code" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-mono text-muted/40 uppercase tracking-widest text-center p-2">
                                <ImageIcon className="w-5 h-5 mb-1 opacity-20" />
                                上傳 QR
                              </div>
                            )}
                            <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/qr:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10">
                              <Upload className="w-4 h-4 text-white" />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file && isSupabaseConfigured) {
                                    try {
                                      const fileExt = file.name.split('.').pop();
                                      const fileName = `contact_${platform}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                                      
                                      const formData = new FormData();
                                      formData.append("file", file);
                                      formData.append("bucket", "avatars");
                                      formData.append("path", fileName);

                                      const result = await uploadFileAction(formData);
                                      if (!result.success) throw new Error(result.error);

                                      const newContact = { ...contactInfo };
                                      newContact[platform].qrcode = result.publicUrl;
                                      setContactInfo(newContact);
                                      alert("QR Code 上傳成功！");
                                    } catch (err: any) {
                                      console.error("Upload failed:", err);
                                      alert(`上傳失敗: ${err.message}`);
                                    }
                                  }
                                }}
                              />
                            </label>
                            {contactInfo[platform].qrcode && (
                              <button 
                                onClick={() => {
                                  const newContact = { ...contactInfo };
                                  newContact[platform].qrcode = "";
                                  setContactInfo(newContact);
                                }}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/qr:opacity-100 transition-opacity z-20"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Inputs Section */}
                        <div className="flex-1 w-full space-y-6">
                          <div>
                            <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">連結網址 (Link URL)</label>
                            <input 
                              type="text" 
                              value={contactInfo[platform].link} 
                              onChange={(e) => {
                                const newContact = { ...contactInfo };
                                newContact[platform].link = e.target.value;
                                setContactInfo(newContact);
                              }}
                              className="w-full bg-surface border border-border px-4 py-3 rounded-xl text-sm font-mono outline-none focus:border-accent transition-colors"
                              placeholder={platform === 'email' ? 'mailto:example@mail.com' : 'https://...'}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">功能說明 (Description)</label>
                            <textarea 
                              value={contactInfo[platform].description} 
                              onChange={(e) => {
                                const newContact = { ...contactInfo };
                                newContact[platform].description = e.target.value;
                                setContactInfo(newContact);
                              }}
                              className="w-full bg-surface border border-border px-4 py-3 rounded-xl text-sm font-serif leading-relaxed outline-none focus:border-accent transition-colors"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Basecamp Management */}
                <div className="mt-12 pt-12 border-t border-border">
                  <SectionHeader title="社辦位置管理 (Basecamp)" subtitle="管理社辦地址、開放時間與 Google Maps 連結" />
                  <div className="p-8 bg-background border border-border rounded-[2rem] space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">社辦完整地址 (Location)</label>
                        <input 
                          type="text" 
                          value={contactInfo.basecamp?.location || ""} 
                          onChange={(e) => {
                            const newContact = { ...contactInfo };
                            newContact.basecamp.location = e.target.value;
                            setContactInfo(newContact);
                          }}
                          className="w-full bg-surface border border-border px-4 py-3 rounded-xl text-sm font-serif outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">位置詳解 (Detail - e.g. B1 基地)</label>
                        <input 
                          type="text" 
                          value={contactInfo.basecamp?.detail || ""} 
                          onChange={(e) => {
                            const newContact = { ...contactInfo };
                            newContact.basecamp.detail = e.target.value;
                            setContactInfo(newContact);
                          }}
                          className="w-full bg-surface border border-border px-4 py-3 rounded-xl text-sm font-serif outline-none focus:border-accent transition-colors"
                          placeholder="學生活動中心 B1 基地"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">開放時間 (Office Hours)</label>
                        <input 
                          type="text" 
                          value={contactInfo.basecamp?.hours || ""} 
                          onChange={(e) => {
                            const newContact = { ...contactInfo };
                            newContact.basecamp.hours = e.target.value;
                            setContactInfo(newContact);
                          }}
                          className="w-full bg-surface border border-border px-4 py-3 rounded-xl text-sm font-serif outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Google Maps 外部連結</label>
                        <input 
                          type="text" 
                          value={contactInfo.basecamp?.mapsLink || ""} 
                          onChange={(e) => {
                            const newContact = { ...contactInfo };
                            newContact.basecamp.mapsLink = e.target.value;
                            setContactInfo(newContact);
                          }}
                          className="w-full bg-surface border border-border px-4 py-3 rounded-xl text-sm font-mono outline-none focus:border-accent transition-colors"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Google Maps 嵌入代碼 (Iframe HTML)</label>
                        <textarea 
                          value={contactInfo.basecamp?.mapEmbed || ""} 
                          onChange={(e) => {
                            const newContact = { ...contactInfo };
                            newContact.basecamp.mapEmbed = e.target.value;
                            setContactInfo(newContact);
                          }}
                          rows={3}
                          className="w-full bg-surface border border-border px-4 py-3 rounded-xl text-[10px] font-mono outline-none focus:border-accent transition-colors"
                          placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
                        />
                        <p className="mt-2 text-[10px] text-muted leading-relaxed">
                          提示：在 Google 地圖點選「分享」&gt;「嵌入地圖」，複製產生的 HTML 代碼貼上即可。此功能完全免費。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "HOMEPAGE" && (
            <div className="space-y-12">
              {/* Hero Section Management */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="首頁標題 (Hero Section)" subtitle="網站第一眼見到的內容" />
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">大標題 (Site Name / Hero Title)</label>
                    <input 
                      type="text" 
                      value={config.siteName} 
                      onChange={(e) => handleChange("", "siteName", e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-display italic text-lg outline-none focus:border-accent transition-colors"
                      placeholder="輸入大標題..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">副標題 (Hero Subtitle)</label>
                    <textarea 
                      value={config.heroSubtext} 
                      onChange={(e) => handleChange("", "heroSubtext", e.target.value)}
                      rows={2}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                      placeholder="輸入副標題..."
                    />
                  </div>
                </div>
              </section>

              {/* Introduction Management */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="首頁簡介 (Introduction)" subtitle="首頁核心介紹區塊" />
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">簡介內文 (Support newline)</label>
                    <textarea 
                      value={config.introduction} 
                      onChange={(e) => handleChange("", "introduction", e.target.value)}
                      rows={10}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors leading-relaxed"
                      placeholder="輸入首頁簡介內容..."
                    />
                  </div>
                </div>
              </section>

              {/* Slogan Management */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="首頁標語 (Slogan)" subtitle="首頁哲學/引用句" />
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">標語內容</label>
                    <input 
                      type="text" 
                      value={config.slogan} 
                      onChange={(e) => handleChange("", "slogan", e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                      placeholder="輸入標語..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">標語標籤 (Slogan Label)</label>
                    <input 
                      type="text" 
                      value={config.sloganLabel} 
                      onChange={(e) => handleChange("", "sloganLabel", e.target.value)}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-xs outline-none focus:border-accent transition-colors"
                      placeholder="例如: Wilderness_Philosophy"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "GENERAL" && (
            <div className="space-y-12">

              {/* Announcement Section */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-start mb-6 border-b border-border/50 pb-4">
                  <div>
                    <h2 className="text-xl font-display italic text-foreground mb-1">置頂公告管理 (Announcement Bar)</h2>
                    <p className="text-xs font-mono text-muted uppercase tracking-widest">全站跑馬燈公告（可顯示多條）</p>
                  </div>
                  <button 
                    onClick={() => {
                      const newAnnouncements = [...(config.announcements || [])];
                      newAnnouncements.push({ id: Math.random().toString(36).substring(7), enabled: true, text: "", link: "" });
                      setConfig(prev => ({ ...prev, announcements: newAnnouncements }));
                    }}
                    className="px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg text-[10px] font-mono uppercase tracking-widest hover:bg-accent/20 transition-all flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3" /> 新增公告
                  </button>
                </div>
                
                <div className="space-y-6">
                  {config.announcements?.map((ann, idx) => (
                    <div key={ann.id || idx} className="p-6 bg-background border border-border rounded-2xl relative group">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-muted uppercase tracking-widest">公告 #{idx + 1}</span>
                          <div className="flex items-center gap-1 bg-background/50 rounded-lg border border-border/50 p-0.5">
                            <button 
                              disabled={idx === 0}
                              onClick={() => {
                                const newAnnouncements = [...config.announcements];
                                [newAnnouncements[idx], newAnnouncements[idx-1]] = [newAnnouncements[idx-1], newAnnouncements[idx]];
                                setConfig(prev => ({ ...prev, announcements: newAnnouncements }));
                              }}
                              className="p-1 text-muted hover:text-accent hover:bg-white rounded-md transition-all disabled:opacity-20"
                              title="上移"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              disabled={idx === config.announcements.length - 1}
                              onClick={() => {
                                const newAnnouncements = [...config.announcements];
                                [newAnnouncements[idx], newAnnouncements[idx+1]] = [newAnnouncements[idx+1], newAnnouncements[idx]];
                                setConfig(prev => ({ ...prev, announcements: newAnnouncements }));
                              }}
                              className="p-1 text-muted hover:text-accent hover:bg-white rounded-md transition-all disabled:opacity-20"
                              title="下移"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={ann.enabled} 
                              onChange={(e) => {
                                const newAnnouncements = [...config.announcements];
                                newAnnouncements[idx].enabled = e.target.checked;
                                setConfig(prev => ({ ...prev, announcements: newAnnouncements }));
                              }}
                            />
                            <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                          <button 
                            onClick={() => {
                              const newAnnouncements = config.announcements.filter((_, i) => i !== idx);
                              setConfig(prev => ({ ...prev, announcements: newAnnouncements }));
                            }}
                            className="p-1.5 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">公告內容</label>
                          <input 
                            type="text" 
                            value={ann.text} 
                            onChange={(e) => {
                              const newAnnouncements = [...config.announcements];
                              newAnnouncements[idx].text = e.target.value;
                              setConfig(prev => ({ ...prev, announcements: newAnnouncements }));
                            }}
                            className="w-full bg-surface border border-border px-4 py-2.5 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                            placeholder="輸入公告文字..."
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">連結網址</label>
                          <input 
                            type="text" 
                            value={ann.link} 
                            onChange={(e) => {
                              const newAnnouncements = [...config.announcements];
                              newAnnouncements[idx].link = e.target.value;
                              setConfig(prev => ({ ...prev, announcements: newAnnouncements }));
                            }}
                            className="w-full bg-surface border border-border px-4 py-2.5 rounded-xl font-mono text-xs outline-none focus:border-accent transition-colors"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!config.announcements || config.announcements.length === 0) && (
                    <div className="text-center py-12 bg-background border border-dashed border-border rounded-2xl">
                      <p className="text-xs font-mono text-muted uppercase tracking-widest">目前沒有公告</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === "ABOUT_CMS" && (
            <div className="space-y-12">
              {/* 1. 社團簡史與傳承 (History Management) */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b border-border/50 pb-4">
                  <div>
                    <h2 className="text-xl font-display italic text-foreground mb-1">社團簡史與傳承</h2>
                    <p className="text-xs font-mono text-muted uppercase tracking-widest">歷史大事記與里程碑管理</p>
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
                              placeholder="年份" 
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
                              placeholder="標題" 
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
                            placeholder="內容描述" 
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

              {/* 2. 社團特色與簡介 (Introduction Management) */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="社團特色與簡介" subtitle="關於山社的詳細介紹內容" />
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">金句引用 (Quote)</label>
                    <input 
                      type="text" 
                      value={intro.quote} 
                      onChange={(e) => setIntro(prev => ({ ...prev, quote: e.target.value }))}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                      placeholder="輸入引言..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">介紹內文 (多段落請空一行)</label>
                    <textarea 
                      value={intro.paragraphs.join("\n\n")} 
                      onChange={(e) => setIntro(prev => ({ ...prev, paragraphs: e.target.value.split("\n\n").filter(p => p.trim() !== "") }))}
                      rows={8}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors leading-relaxed"
                      placeholder="輸入社團介紹內文..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">核心價值 (每行一個)</label>
                    <textarea 
                      value={intro.coreValues.join("\n")} 
                      onChange={(e) => setIntro(prev => ({ ...prev, coreValues: e.target.value.split("\n").filter(v => v.trim() !== "") }))}
                      rows={4}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors"
                      placeholder="輸入核心價值..."
                    />
                  </div>
                </div>
              </section>

              {/* 3. 關於幹部與職責 (Roles & Committee Management) */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="關於幹部與職責" subtitle="幹部分工說明與歷任名單管理" />
                
                <div className="space-y-12">
                  {/* Individual Roles */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3">各職位說明</h3>
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
                              placeholder="職位名稱"
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
                            placeholder="職責描述"
                            rows={2}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common Responsibilities */}
                  <div>
                    <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3 mb-6">幹部共同職責</h3>
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
                      <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3">上山後的工作</h3>
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
                              placeholder="任務名稱"
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
                            placeholder="任務描述"
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

          {activeTab === "LEADERSHIP" && (
            <div className="space-y-20">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-display italic text-foreground">歷任幹部名單管理</h2>
                  <p className="text-[10px] font-mono text-muted uppercase tracking-widest mt-1">Historical Leadership Management</p>
                </div>
                <button 
                  onClick={() => setCommittees(prev => [{ year: "114", members: [] }, ...prev])}
                  className="px-6 py-3 bg-accent text-white rounded-full text-xs font-mono uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/20"
                >
                  + 新增學年度
                </button>
              </div>

              <div className="space-y-16">
                {[...committees].sort((a, b) => b.year.localeCompare(a.year, undefined, { numeric: true })).map((yearGroup, yIdx) => {
                  // Find the original index in the source state to update correctly
                  const originalYIdx = committees.findIndex(c => c.year === yearGroup.year);
                  
                  return (
                    <div key={yearGroup.year} className="relative group/year">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Year Display & Input - Scaled Down */}
                        <div className="md:sticky md:top-32 flex-shrink-0 flex flex-col items-center group/year-input">
                          <div className="flex items-baseline gap-2">
                            <input 
                              type="text" 
                              value={yearGroup.year} 
                              onChange={(e) => {
                                const newCommittees = [...committees];
                                newCommittees[originalYIdx].year = e.target.value;
                                setCommittees(newCommittees);
                              }}
                              className="bg-transparent border border-transparent hover:border-border/50 rounded-xl px-2 py-1 text-3xl md:text-5xl font-display italic text-foreground w-20 outline-none focus:ring-0 leading-none text-right transition-all"
                              placeholder="114"
                            />
                            <span className="text-[9px] font-mono text-muted uppercase tracking-[0.2em] [writing-mode:vertical-rl] h-fit border-l border-border pl-1.5 py-1">學年度</span>
                          </div>
                          
                          {/* Delete Year Button - Moved below */}
                          <button 
                            onClick={() => setCommittees(prev => prev.filter((_, i) => i !== originalYIdx))}
                            className="mt-4 p-2 text-red-400 hover:text-red-600 opacity-0 group-hover/year:opacity-100 transition-all flex items-center gap-1.5 text-[8px] font-mono uppercase tracking-tighter border border-transparent hover:border-red-100 rounded-lg"
                          >
                            <AlertTriangle className="w-3 h-3" /> 刪除年度
                          </button>
                        </div>

                        {/* Members Grid - Horizontal Scroll */}
                        <div className="flex-1 w-full overflow-x-auto no-scrollbar">
                          <div className="flex gap-6 pb-6">
                            {yearGroup.members.map((member, mIdx) => (
                              <div key={mIdx} className="w-[240px] md:w-[280px] flex-shrink-0 bg-surface/50 border border-border p-6 group/member hover:border-accent hover:bg-white transition-all duration-500 rounded-[2rem] shadow-sm hover:shadow-lg relative flex flex-col items-center">
                                {/* Member Management Bar */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-0 group-hover/member:opacity-100 transition-all z-20">
                                  <div className="flex gap-1">
                                    <button 
                                      onClick={() => {
                                        if (mIdx === 0) return;
                                        const newCommittees = [...committees];
                                        const members = [...newCommittees[originalYIdx].members];
                                        [members[mIdx-1], members[mIdx]] = [members[mIdx], members[mIdx-1]];
                                        newCommittees[originalYIdx].members = members;
                                        setCommittees(newCommittees);
                                      }}
                                      disabled={mIdx === 0}
                                      className="w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center text-muted hover:text-accent hover:border-accent disabled:opacity-30 text-[10px] font-mono"
                                    >
                                      &lt;
                                    </button>
                                    <button 
                                      onClick={() => {
                                        if (mIdx === yearGroup.members.length - 1) return;
                                        const newCommittees = [...committees];
                                        const members = [...newCommittees[originalYIdx].members];
                                        [members[mIdx], members[mIdx+1]] = [members[mIdx+1], members[mIdx]];
                                        newCommittees[originalYIdx].members = members;
                                        setCommittees(newCommittees);
                                      }}
                                      disabled={mIdx === yearGroup.members.length - 1}
                                      className="w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center text-muted hover:text-accent hover:border-accent disabled:opacity-30 text-[10px] font-mono"
                                    >
                                      &gt;
                                    </button>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      const newCommittees = [...committees];
                                      newCommittees[originalYIdx].members = newCommittees[originalYIdx].members.filter((_, i) => i !== mIdx);
                                      setCommittees(newCommittees);
                                    }}
                                    className="w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-xs border border-red-100"
                                  >
                                    ×
                                  </button>
                                </div>

                                {/* Avatar Section - Scaled Down */}
                                <div className="w-20 h-20 md:w-24 md:h-24 bg-background border border-border rounded-full overflow-hidden flex-shrink-0 relative group/avatar mb-6 shadow-inner mt-4">
                                  {member.avatar ? (
                                    <img src={member.avatar} alt="Preview" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted/20">
                                      <ImageIcon className="w-8 h-8" />
                                    </div>
                                  )}
                                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10">
                                    <Upload className="w-4 h-4 text-white" />
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleFileUpload(originalYIdx, mIdx, file);
                                      }}
                                    />
                                  </label>
                                </div>

                                {/* Info Section */}
                                <div className="w-full space-y-3 text-center px-2">
                                  <div className="space-y-1">
                                    {/* Role Input */}
                                    <input 
                                      type="text" 
                                      value={member.role} 
                                      onChange={(e) => {
                                        const newCommittees = [...committees];
                                        newCommittees[originalYIdx].members[mIdx].role = e.target.value;
                                        setCommittees(newCommittees);
                                      }}
                                      className="w-full bg-transparent border border-transparent hover:border-border/50 rounded-lg p-1 text-[9px] font-mono text-accent uppercase tracking-[0.2em] font-bold text-center focus:ring-0 transition-all"
                                      placeholder="職稱"
                                    />
                                    {/* Name Input */}
                                    <input 
                                      type="text" 
                                      value={member.name} 
                                      onChange={(e) => {
                                        const newCommittees = [...committees];
                                        newCommittees[originalYIdx].members[mIdx].name = e.target.value;
                                        setCommittees(newCommittees);
                                      }}
                                      className="w-full bg-transparent border border-transparent hover:border-border/50 rounded-lg p-1 text-xl md:text-2xl font-display italic tracking-tight text-center focus:ring-0 transition-all"
                                      placeholder="姓名"
                                    />
                                    {/* Dept Input */}
                                    <input 
                                      type="text" 
                                      value={member.dept} 
                                      onChange={(e) => {
                                        const newCommittees = [...committees];
                                        newCommittees[originalYIdx].members[mIdx].dept = e.target.value;
                                        setCommittees(newCommittees);
                                      }}
                                      className="w-full bg-transparent border border-transparent hover:border-border/50 rounded-lg p-1 text-[9px] font-mono text-muted uppercase tracking-wider text-center focus:ring-0 transition-all"
                                      placeholder="科系"
                                    />
                                  </div>

                                  {/* Intro / Quote Input */}
                                  <div className="pt-4 border-t border-border/50">
                                    <textarea 
                                      value={member.intro} 
                                      onChange={(e) => {
                                        const newCommittees = [...committees];
                                        newCommittees[originalYIdx].members[mIdx].intro = e.target.value;
                                        setCommittees(newCommittees);
                                      }}
                                      className="w-full bg-transparent border border-transparent hover:border-border/50 rounded-lg p-2 text-xs font-serif text-muted italic leading-relaxed text-center focus:ring-0 resize-none transition-all"
                                      placeholder="個人金句..."
                                      rows={2}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            {/* Add Member Button Card - Scaled Down */}
                            <button 
                              onClick={() => {
                                const newCommittees = [...committees];
                                newCommittees[originalYIdx].members.push({ name: "", role: "社長", dept: "", intro: "", avatar: "" });
                                setCommittees(newCommittees);
                              }}
                              className="w-[200px] flex-shrink-0 border-2 border-dashed border-border rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 text-muted hover:border-accent hover:text-accent transition-all hover:bg-accent/5 group/add-member"
                            >
                              <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center group-hover/add-member:scale-110 transition-transform">
                                <span className="text-xl">+</span>
                              </div>
                              <span className="text-[10px] font-mono uppercase tracking-widest">新增成員</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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

          {activeTab === "FOOTER" && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Footer Basic Branding */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="頁腳品牌與標語" subtitle="網站最底部的品牌精神呈現" />
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">網站標題文字 (Site Title)</label>
                    <input 
                      type="text" 
                      value={config.siteName} 
                      onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-display font-bold outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">社團標語 (Slogan)</label>
                    <textarea 
                      value={contactInfo.footer.slogan} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        footer: { ...contactInfo.footer, slogan: e.target.value } 
                      })}
                      rows={2}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm italic outline-none focus:border-accent transition-colors leading-relaxed"
                      placeholder="自 1985 年起，致力於高山探險..."
                    />
                  </div>
                </div>
              </section>

              {/* Footer Contact Details */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="頁腳聯繫與地址 (同步聯絡我們資料)" subtitle="頁腳顯示的實體基地資訊" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">社辦地址</label>
                    <input 
                      type="text" 
                      value={contactInfo.basecamp.location} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        basecamp: { ...contactInfo.basecamp, location: e.target.value } 
                      })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-serif outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">位置詳解 (如：B1 基地)</label>
                    <input 
                      type="text" 
                      value={contactInfo.basecamp.detail} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        basecamp: { ...contactInfo.basecamp, detail: e.target.value } 
                      })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-serif outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">開放時間</label>
                    <input 
                      type="text" 
                      value={contactInfo.basecamp.hours} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        basecamp: { ...contactInfo.basecamp, hours: e.target.value } 
                      })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-serif outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Footer Social Links */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="頁腳社群連結 (同步官方帳號資料)" subtitle="社群媒體跳轉網址" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Instagram 網址</label>
                    <input 
                      type="text" 
                      value={contactInfo.instagram.link} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        instagram: { ...contactInfo.instagram, link: e.target.value } 
                      })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-mono outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">Facebook 網址</label>
                    <input 
                      type="text" 
                      value={contactInfo.facebook.link} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        facebook: { ...contactInfo.facebook, link: e.target.value } 
                      })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-mono outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">LINE 網址/連結</label>
                    <input 
                      type="text" 
                      value={contactInfo.line.link} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        line: { ...contactInfo.line, link: e.target.value } 
                      })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-mono outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">官方 Email</label>
                    <input 
                      type="email" 
                      value={contactInfo.email.link} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        email: { ...contactInfo.email, link: e.target.value } 
                      })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-mono outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Footer Bottom Bar */}
              <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
                <SectionHeader title="底欄版權與致謝" subtitle="頁腳最後一行的文字資訊" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">版權宣告文字 (Copyright)</label>
                    <input 
                      type="text" 
                      value={contactInfo.footer.copyright} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        footer: { ...contactInfo.footer, copyright: e.target.value } 
                      })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-serif outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">製作團隊致謝 (Credits)</label>
                    <input 
                      type="text" 
                      value={contactInfo.footer.credits} 
                      onChange={(e) => setContactInfo({ 
                        ...contactInfo, 
                        footer: { ...contactInfo.footer, credits: e.target.value } 
                      })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl text-sm font-serif outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>
    </AdminLayout>

  );
}
