"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Save, FileText, AlertCircle, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { ruleService } from "@/services/ruleService";
import { RuleCategory, RuleSection } from "@/data/rules";

type RuleTab = "membership" | "joining" | "equipment" | "room" | "constitution";

export default function AdminRulesPage() {
  const [activeTab, setActiveTab] = useState<RuleTab>("membership");
  const [data, setData] = useState<RuleCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data when tab changes
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const result = await ruleService.getRuleCategory(activeTab);
        setData(result);
      } catch (err) {
        console.error("Failed to load rules:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [activeTab]);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      await ruleService.saveRuleCategory(data);
      alert("儲存成功！資料已同步至資料庫。");
    } catch (err) {
      alert("儲存失敗，請檢查網路連線。");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateSection = (idx: number, field: keyof RuleSection, value: any) => {
    if (!data) return;
    const newSections = [...data.sections];
    if (field === "content" && typeof value === "string") {
      // Split by newline and filter empty
      newSections[idx].content = value.split("\n").filter(l => l.trim() !== "");
    } else {
      (newSections[idx] as any)[field] = value;
    }
    setData({ ...data, sections: newSections });
  };

  const addSection = () => {
    if (!data) return;
    setData({
      ...data,
      sections: [...data.sections, { title: "新章節", content: ["請輸入內容..."] }]
    });
  };

  const removeSection = (idx: number) => {
    if (!data) return;
    if (!confirm("確定要刪除此章節嗎？")) return;
    const newSections = data.sections.filter((_, i) => i !== idx);
    setData({ ...data, sections: newSections });
  };

  const moveSection = (idx: number, direction: "up" | "down") => {
    if (!data) return;
    const newSections = [...data.sections];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newSections.length) return;
    
    [newSections[idx], newSections[targetIdx]] = [newSections[targetIdx], newSections[idx]];
    setData({ ...data, sections: newSections });
  };

  const TabButton = ({ id, label }: { id: RuleTab, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all whitespace-nowrap ${
        activeTab === id ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">規章制度管理</h1>
            <p className="text-sm font-serif text-muted">編輯社團入社規範、活動指南與各項管理規則。</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving || isLoading || !data}
            className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 min-w-[120px] flex items-center justify-center gap-2"
          >
            {isSaving ? "SAVING..." : (
              <>
                <Save className="w-3.5 h-3.5" />
                SAVE_TO_DB
              </>
            )}
          </button>
        </div>

        <div className="flex border-b border-border mb-10 overflow-x-auto no-scrollbar">
          <TabButton id="membership" label="我想成為社員！" />
          <TabButton id="joining" label="我想參與社團活動！" />
          <TabButton id="equipment" label="租借規則與費用" />
          <TabButton id="room" label="社辦使用規範" />
          <TabButton id="constitution" label="組織章程" />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 font-mono text-xs animate-pulse">
            FETCHING_RULE_DATA...
          </div>
        ) : !data ? (
          <div className="text-center py-20 text-muted font-serif">資料載入失敗或不存在。</div>
        ) : (
          <div className="space-y-12">
            {/* Header Info */}
            <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3 mb-2">Page_Identity</h3>
                  <p className="text-xs text-muted font-serif italic">設定該頁面的標題與引導文字。</p>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Display Title</label>
                    <input 
                      type="text" 
                      value={data.title} 
                      onChange={(e) => setData({ ...data, title: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-display italic text-lg outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Description / Intro</label>
                    <textarea 
                      value={data.description} 
                      onChange={(e) => setData({ ...data, description: e.target.value })}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Sections Editor */}
            <div className="space-y-6">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-emerald-500 pl-3">Content_Sections</h3>
                  <p className="text-[10px] text-muted font-mono mt-1">MANAGE_PARAGRAPHS_AND_LISTS</p>
                </div>
                <button 
                  onClick={addSection}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-[10px] font-mono uppercase tracking-widest hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                >
                  <Plus className="w-3 h-3" />
                  Add Section
                </button>
              </div>

              <div className="space-y-6">
                {data.sections.map((section, idx) => (
                  <div key={idx} className="bg-surface border border-border rounded-3xl p-8 shadow-sm group hover:border-accent/30 transition-all relative">
                    {/* Controls */}
                    <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveSection(idx, "up")} className="p-1.5 text-muted hover:text-foreground transition-colors"><ChevronUp className="w-4 h-4" /></button>
                      <button onClick={() => moveSection(idx, "down")} className="p-1.5 text-muted hover:text-foreground transition-colors"><ChevronDown className="w-4 h-4" /></button>
                      <div className="w-px h-4 bg-border mx-1"></div>
                      <button 
                        onClick={() => removeSection(idx)} 
                        className="p-1.5 text-red-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-1">
                        <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-3">Section Title</label>
                        <input 
                          type="text" 
                          value={section.title} 
                          onChange={(e) => handleUpdateSection(idx, "title", e.target.value)}
                          className="w-full bg-background border border-border px-4 py-2.5 rounded-xl font-serif font-bold text-sm outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-3">
                          List Items (One per line)
                        </label>
                        <textarea 
                          value={section.content.join("\n")} 
                          onChange={(e) => handleUpdateSection(idx, "content", e.target.value)}
                          className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-emerald-500 leading-relaxed"
                          rows={4}
                          placeholder="每一行輸入一項說明..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {data.sections.length === 0 && (
                  <div className="py-20 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-muted/30">
                    <FileText className="w-12 h-12 mb-4 opacity-10" />
                    <p className="font-mono text-xs uppercase tracking-widest">No_Sections_Found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
