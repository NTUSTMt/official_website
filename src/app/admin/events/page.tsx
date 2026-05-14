"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { eventsData, EventItem, difficultyLevels } from "@/data/events";
import { eventService, registrationService } from "@/services/eventService";
import { historyService, cmsService } from "@/services/cmsService";
import { userService } from "@/services/userService";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { uploadFileAction } from "../uploadAction";
import { Trash2, Plus, ChevronLeft, Users as UsersIcon, Edit, Calendar, DollarSign, Save, X, Upload, Image as ImageIcon, Download, FileText } from "lucide-react";

type ViewState = "LIST" | "EDIT_EVENT" | "VIEW_PARTICIPANTS";
type Tab = "EVENTS" | "CALENDAR";

export default function AdminEventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("EVENTS");
  const [view, setView] = useState<ViewState>("LIST");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<Record<string, any>>({});
  const [calendars, setCalendars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRegs, setIsLoadingRegs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  // Load events and calendars from DB
  useEffect(() => {
    async function fetchData() {
      try {
        const [eventList, calendarList] = await Promise.all([
          eventService.getAllEvents(),
          cmsService.getSemesterCalendars()
        ]);
        setEvents(eventList.length > 0 ? eventList : eventsData);
        setCalendars(calendarList);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Load participants when viewing an event
  useEffect(() => {
    async function loadParticipants() {
      if (view === "VIEW_PARTICIPANTS" && selectedEvent) {
        setIsLoadingRegs(true);
        try {
          const regs = await registrationService.getRegistrations(selectedEvent.id);
          setParticipants(regs);
          
          // Fetch user profiles for these registrations
          const userIds = [...new Set(regs.map((r: any) => r.user_id))];
          const profiles: Record<string, any> = {};
          
          await Promise.all(userIds.map(async (uid: any) => {
            const profile = await userService.getProfile(uid);
            if (profile) profiles[uid] = profile;
          }));
          
          setRegisteredUsers(profiles);
        } catch (err) {
          console.error("Failed to load participants:", err);
        } finally {
          setIsLoadingRegs(false);
        }
      }
    }
    loadParticipants();
    
    if (view === "EDIT_EVENT") {
      setPreviewImage(selectedEvent?.coverImage || "");
    }
  }, [view, selectedEvent]);

  const handleFileUpload = async (file: File, bucketName: string = "events") => {
    if (!isSupabaseConfigured) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bucketName}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      // Create FormData for server action
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("bucket", bucketName);

      const result = await uploadFileAction(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.publicUrl!;
    } catch (error) {
      console.error('Error uploading:', error);
      alert(`上傳失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
      return null;
    }
  };

  const handleSaveCalendar = async () => {
    setIsSaving(true);
    try {
      await cmsService.saveSemesterCalendars(calendars);
      alert("儲存成功！");
    } catch (err) {
      alert("儲存失敗");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateParticipantStatus = async (pId: string, newStatus: string) => {
    try {
      await registrationService.updateStatus(pId, newStatus);
      setParticipants(prev => prev.map(p => p.id === pId ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert("更新失敗");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("確定要刪除此活動嗎？")) {
      try {
        await eventService.deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
      } catch (err) {
        alert("刪除失敗");
      }
    }
  };

  const handleSaveEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const eventToSave: Partial<EventItem> = {
      id: selectedEvent?.id || `event-${Date.now()}`,
      title: formData.get("title") as string,
      date: formData.get("date") as string,
      status: formData.get("status") as any,
      cost: formData.get("cost") as string,
      summary: formData.get("summary") as string,
      registrationDeadline: formData.get("registrationDeadline") as string,
      description: (formData.get("description") as string).split("\n"),
      difficulty: formData.get("difficulty") as any,
      calendarDates: [formData.get("date") as string],
      coverImage: previewImage,
    };

    try {
      await eventService.upsertEvent(eventToSave);
      alert("儲存成功！");
      const updated = await eventService.getAllEvents();
      setEvents(updated);
      setView("LIST");
    } catch (err) {
      alert("儲存失敗");
    }
  };

  if (isLoading) {
    return <AdminLayout><div className="p-20 text-center font-mono animate-pulse">資料載入中...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">
              {view === "LIST" ? (activeTab === "EVENTS" ? "活動與報名管理" : "學期行事曆管理") : 
               view === "EDIT_EVENT" ? "編輯/新增活動" : "隊員名單審核"}
            </h1>
            <p className="text-sm font-serif text-muted">
              {view === "LIST" ? (activeTab === "EVENTS" ? "管理社團出團活動、上架新行程並監控報名進度。" : "上傳並管理學期行事曆圖片。") :
               view === "EDIT_EVENT" ? `正在設定活動：${selectedEvent?.title || "新活動"}` :
               `正在審核活動：${selectedEvent?.title}`}
            </p>
          </div>
          <div className="flex gap-3">
            {view === "LIST" && activeTab === "CALENDAR" && (
              <button 
                onClick={handleSaveCalendar}
                disabled={isSaving}
                className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "正在儲存..." : "儲存至資料庫"}
              </button>
            )}
            {view !== "LIST" && (
              <button 
                onClick={() => setView("LIST")}
                className="px-6 py-2.5 bg-surface border border-border text-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-background transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-3 h-3" />
                返回列表
              </button>
            )}
            {view === "LIST" && activeTab === "EVENTS" && (
              <button 
                onClick={() => { setSelectedEvent(null); setView("EDIT_EVENT"); }}
                className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                新增活動
              </button>
            )}
          </div>
        </div>

        {view === "LIST" && (
          <div className="flex border-b border-border mb-10 overflow-x-auto">
            <button
              onClick={() => setActiveTab("EVENTS")}
              className={`px-8 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all ${
                activeTab === "EVENTS" ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              活動列表 (Events)
            </button>
            <button
              onClick={() => setActiveTab("CALENDAR")}
              className={`px-8 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all ${
                activeTab === "CALENDAR" ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              學期行事曆 (Calendar)
            </button>
          </div>
        )}

        {/* View: Event List */}
        {view === "LIST" && activeTab === "EVENTS" && (
          <div className="space-y-16">
            {Object.keys(events.reduce((acc, event) => {
              const date = new Date(event.date.split("-")[0].replace(/\//g, "-"));
              const month = date.getMonth() + 1;
              const year = date.getFullYear();
              const sem = month >= 8 ? `${year-1911}-1` : `${year-1912}-2`;
              if (!acc[sem]) acc[sem] = [];
              acc[sem].push(event);
              return acc;
            }, {} as Record<string, EventItem[]>))
            .sort((a, b) => b.localeCompare(a))
            .map(semester => {
              const semesterEvents = events.filter(e => {
                const d = new Date(e.date.split("-")[0].replace(/\//g, "-"));
                const m = d.getMonth() + 1;
                const y = d.getFullYear();
                return (m >= 8 ? `${y-1911}-1` : `${y-1912}-2`) === semester;
              });

              return (
                <div key={semester} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-display italic text-accent">{semester} 學年度</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
                  </div>
                  
                  <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar snap-x">
                    {semesterEvents.map((event) => {
                      const isOpen = event.status === "open";
                      return (
                        <div key={event.id} className="flex-shrink-0 w-80 snap-start">
                          <div className="bg-surface border border-border rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col">
                            {/* Card Image Section */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-background">
                              <img 
                                src={event.coverImage} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                alt="" 
                              />
                              <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-mono text-white uppercase tracking-[0.2em] shadow-lg ${
                                  difficultyLevels.find(l => l.label === event.difficulty)?.color || "bg-accent"
                                }`}>
                                  {event.difficulty}
                                </span>
                              </div>
                              {isOpen && (
                                <div className="absolute top-4 right-4">
                                  <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-500/20">
                                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
                                    <span className="text-[8px] font-mono text-emerald-600 uppercase tracking-widest font-bold">Open</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Card Info Section */}
                            <div className="p-6 flex-1 flex flex-col">
                              <div className="flex justify-between items-center mb-3">
                                <div className="font-mono text-[9px] text-accent font-bold tracking-widest">{event.date}</div>
                                <div className="font-mono text-[9px] text-muted/60">{event.cost}</div>
                              </div>
                              
                              <h4 className="text-xl font-display italic mb-3 group-hover:text-accent transition-colors line-clamp-1">
                                {event.title}
                              </h4>
                              
                              <p className="text-[11px] font-serif text-muted leading-relaxed mb-6 line-clamp-2">
                                {event.summary}
                              </p>

                              {/* Admin Actions */}
                              <div className="mt-auto pt-5 border-t border-border/50 flex gap-2">
                                <button 
                                  onClick={() => { setSelectedEvent(event); setView("VIEW_PARTICIPANTS"); }}
                                  className="flex-1 py-2 bg-accent/5 text-accent border border-accent/10 rounded-xl text-[9px] font-mono uppercase tracking-widest font-bold hover:bg-accent/10 transition-all flex items-center justify-center gap-1.5"
                                >
                                  <UsersIcon className="w-3 h-3" />
                                  隊員審核
                                </button>
                                <button 
                                  onClick={() => { setSelectedEvent(event); setView("EDIT_EVENT"); }}
                                  className="flex-1 py-2 bg-background border border-border rounded-xl text-[9px] font-mono uppercase tracking-widest font-bold hover:bg-surface transition-all flex items-center justify-center gap-1.5"
                                >
                                  <Edit className="w-3 h-3" />
                                  編輯活動
                                </button>
                                <button 
                                  onClick={() => handleDeleteEvent(event.id)}
                                  className="p-2 text-muted hover:text-red-500 transition-colors"
                                  title="刪除活動"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View: Calendar CMS */}
        {view === "LIST" && activeTab === "CALENDAR" && (
          <div className="space-y-12">
            <section className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div className="border-l-4 border-accent pl-4">
                  <h2 className="text-xl font-display italic text-foreground mb-1">學期行事曆管理</h2>
                  <p className="text-xs font-mono text-muted uppercase tracking-widest">學期行事曆 CMS</p>
                </div>
                <button 
                  onClick={() => setCalendars(prev => [...prev, { semester: "", url: "" }])}
                  className="px-6 py-2 bg-accent text-white rounded-full text-[10px] font-mono uppercase tracking-widest font-bold shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all"
                >
                  + 新增學期
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {calendars.map((cal, idx) => (
                  <div key={idx} className="p-8 bg-background border border-border rounded-2xl group hover:border-accent transition-all space-y-6 relative">
                    <button 
                      onClick={() => setCalendars(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[9px] font-mono text-muted uppercase tracking-widest mb-1">Semester Name (e.g. 112-2)</label>
                        <input 
                          type="text" 
                          value={cal.semester} 
                          onChange={(e) => {
                            const newCals = [...calendars];
                            newCals[idx].semester = e.target.value;
                            setCalendars(newCals);
                          }}
                          className="w-full bg-surface border border-border px-4 py-2 rounded-xl text-lg font-display italic"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[9px] font-mono text-muted uppercase tracking-widest mb-1">Calendar Image</label>
                        {cal.url ? (
                          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-border group-hover:border-accent/50 transition-colors">
                            <img src={cal.url} alt="Semester Calendar" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
                                更換圖片
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const url = await handleFileUpload(file, "calendars");
                                      if (url) {
                                        const newCals = [...calendars];
                                        newCals[idx].url = url;
                                        setCalendars(newCals);
                                      }
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center aspect-[3/4] w-full border-2 border-dashed border-border rounded-2xl hover:border-accent hover:bg-accent/5 transition-all cursor-pointer">
                            <Upload className="w-8 h-8 text-muted mb-4" />
                            <span className="text-[10px] font-mono text-muted uppercase tracking-widest">上傳行事曆圖片</span>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleFileUpload(file, "calendars");
                                  if (url) {
                                    const newCals = [...calendars];
                                    newCals[idx].url = url;
                                    setCalendars(newCals);
                                  }
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {calendars.length === 0 && (
                  <div className="col-span-full py-20 border-2 border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-muted/30">
                    <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                    <span className="text-xs font-mono uppercase tracking-[0.2em]">目前尚未上傳學期行事曆</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* View: Edit Event Form */}
        {view === "EDIT_EVENT" && (
          <form onSubmit={handleSaveEvent} className="bg-surface border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Metadata Card Preview */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="border-l-4 border-accent pl-4 mb-6">
                  <h3 className="text-sm font-mono text-accent font-bold uppercase tracking-widest">中繼資料預覽 (Metadata)</h3>
                </div>
                
                <div className="flex-1 bg-background border border-border rounded-[2.5rem] overflow-hidden shadow-lg p-6 space-y-6">
                  {/* Row 1: Difficulty & Status */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-mono text-muted uppercase tracking-widest mb-1">活動難度 (Difficulty)</label>
                      <select 
                        name="difficulty" 
                        defaultValue={selectedEvent?.difficulty || "初級"}
                        className="w-full bg-surface border border-border px-3 py-2 rounded-xl text-xs font-serif outline-none focus:border-accent transition-colors"
                      >
                        <option value="入門">入門 (Easy)</option>
                        <option value="初級">初級 (Normal)</option>
                        <option value="中級">中級 (Moderate)</option>
                        <option value="進階">進階 (Advanced)</option>
                        <option value="挑戰">挑戰 (Extreme)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono text-muted uppercase tracking-widest mb-1">活動狀態 (Status)</label>
                      <select 
                        name="status" 
                        defaultValue={selectedEvent?.status || "open"} 
                        className="w-full bg-surface border border-border px-3 py-2 rounded-xl text-xs font-mono outline-none focus:border-accent transition-colors"
                      >
                        <option value="open">Open (報名中)</option>
                        <option value="closed">Closed (已截止)</option>
                        <option value="upcoming">Upcoming (籌備中)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Image */}
                  <div className="space-y-2">
                    <label className="block text-[8px] font-mono text-muted uppercase tracking-widest mb-1">封面圖片 (Cover Image)</label>
                    {previewImage ? (
                      <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border group/img">
                        <img src={previewImage} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                          <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                            更換
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleFileUpload(file, "events");
                                  if (url) setPreviewImage(url);
                                }
                              }}
                            />
                          </label>
                          <button 
                            type="button"
                            onClick={() => setPreviewImage("")}
                            className="ml-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-video w-full border-2 border-dashed border-border rounded-2xl hover:border-accent hover:bg-accent/5 transition-all cursor-pointer group/upload">
                        <Upload className="w-6 h-6 text-muted mb-2 group-hover/upload:text-accent transition-colors" />
                        <span className="text-[8px] font-mono text-muted uppercase tracking-widest group-hover/upload:text-accent">上傳圖片</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file, "events");
                              if (url) setPreviewImage(url);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Row 3: Date & Cost */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[8px] font-mono text-muted uppercase tracking-widest mb-1">活動日期 (Event Date)</label>
                      <input 
                        name="date" 
                        type="text" 
                        defaultValue={selectedEvent?.date} 
                        className="w-full bg-surface border border-border px-3 py-2 rounded-xl text-xs font-mono outline-none focus:border-accent transition-colors" 
                        placeholder="YYYY/MM/DD" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono text-muted uppercase tracking-widest mb-1">預估費用 (Cost)</label>
                      <input 
                        name="cost" 
                        type="text" 
                        defaultValue={selectedEvent?.cost} 
                        className="w-full bg-surface border border-border px-3 py-2 rounded-xl text-xs font-serif outline-none focus:border-accent transition-colors" 
                        placeholder="NT$ 2,500" 
                      />
                    </div>
                  </div>

                  {/* Row 4: Title */}
                  <div>
                    <label className="block text-[8px] font-mono text-muted uppercase tracking-widest mb-1">活動名稱 (Activity Title)</label>
                    <input 
                      name="title" 
                      type="text" 
                      defaultValue={selectedEvent?.title} 
                      className="w-full bg-surface border border-border px-4 py-3 rounded-xl text-lg font-display italic outline-none focus:border-accent transition-colors" 
                      placeholder="玉山主峰三日行" 
                      required 
                    />
                  </div>

                  {/* Row 5: Summary */}
                  <div>
                    <label className="block text-[8px] font-mono text-muted uppercase tracking-widest mb-1">簡短摘要 (Summary)</label>
                    <textarea 
                      name="summary" 
                      rows={2}
                      defaultValue={selectedEvent?.summary} 
                      className="w-full bg-surface border border-border px-4 py-3 rounded-xl text-xs font-serif outline-none focus:border-accent transition-colors resize-none" 
                      placeholder="簡短摘要活動亮點..."
                    />
                  </div>

                  {/* Row 6: Registration Deadline */}
                  <div>
                    <label className="block text-[8px] font-mono text-muted uppercase tracking-widest mb-1">報名截止日期 (Registration Deadline)</label>
                    <input 
                      name="registrationDeadline" 
                      type="text" 
                      defaultValue={selectedEvent?.registrationDeadline} 
                      className="w-full bg-surface border border-border px-3 py-2 rounded-xl text-xs font-mono outline-none focus:border-accent transition-colors" 
                      placeholder="YYYY/MM/DD" 
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Description */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="border-l-4 border-accent pl-4 mb-6">
                  <h3 className="text-sm font-mono text-accent font-bold uppercase tracking-widest">詳細內容介紹 (Detailed Content)</h3>
                </div>
                <div className="flex-1 flex flex-col">
                  <textarea 
                    name="description" 
                    className="flex-1 w-full bg-background border border-border p-8 rounded-[2.5rem] font-serif text-lg leading-relaxed outline-none focus:border-accent transition-colors resize-none shadow-lg"
                    defaultValue={selectedEvent?.description?.join("\n")}
                    placeholder="在此輸入活動的詳細介紹、裝備需求、注意事項等..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border flex justify-end items-center gap-6">
              <button 
                type="button" 
                onClick={() => setView("LIST")} 
                className="text-[10px] font-mono text-muted uppercase tracking-widest hover:text-foreground transition-colors"
              >
                捨棄所有變更
              </button>
              <button 
                type="submit" 
                className="px-12 py-4 bg-accent text-accent-foreground rounded-2xl text-[10px] font-mono uppercase tracking-widest font-bold shadow-2xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                發佈至網站
              </button>
            </div>
          </form>
        )}

        {/* View: Participants Review */}
        {view === "VIEW_PARTICIPANTS" && selectedEvent && (
          <div className="space-y-8">
            <div className="bg-accent/5 border border-accent/20 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-serif mb-1">報名統計數據</h3>
                <p className="text-xs font-mono text-muted uppercase">
                  Total: {participants.length} | Admitted: {participants.filter(p => p.status === "ADMITTED" || p.status === "confirmed").length}
                </p>
              </div>
              <button 
                onClick={() => {
                  const headers = ["姓名", "系級", "學號", "電話", "緊急聯絡人", "緊急聯絡電話", "狀態", "繳費", "備註"];
                  const rows = participants.map(p => {
                    const profile = registeredUsers[p.user_id];
                    return [
                      profile?.real_name || "Unknown",
                      profile?.department || "-",
                      profile?.student_id || "-",
                      profile?.phone || "-",
                      profile?.emergency_contact_name || "-",
                      profile?.emergency_contact_phone || "-",
                      p.status,
                      p.payment_status,
                      p.note || ""
                    ];
                  });
                  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
                  const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(blob);
                  link.download = `registrations_${selectedEvent.title}_${new Date().toLocaleDateString()}.csv`;
                  link.click();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-full font-mono text-[10px] uppercase tracking-widest hover:bg-accent hover:text-white transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                匯出全體隊員 CSV
              </button>
            </div>

            <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background border-b border-border">
                      <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">隊員資訊 (Team Member)</th>
                      <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">聯絡資訊 (Contact Info)</th>
                      <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">審核狀態 (Status)</th>
                      <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">繳費狀況 (Payment)</th>
                      <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest text-right">操作 (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {isLoadingRegs ? (
                      <tr>
                        <td colSpan={5} className="p-20 text-center font-mono text-[10px] text-muted animate-pulse uppercase tracking-[0.2em]">
                          報名資料載入中...
                        </td>
                      </tr>
                    ) : participants.map(p => {
                      const profile = registeredUsers[p.user_id];
                      return (
                        <tr key={p.id} className="hover:bg-background/50 transition-colors group">
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-[10px] font-mono uppercase">
                                {profile?.real_name?.charAt(0) || "?"}
                              </div>
                              <div>
                                <div className="text-sm font-serif font-bold">{profile?.real_name || "未填寫姓名"}</div>
                                <div className="text-[10px] font-mono text-muted/60 uppercase">{profile?.department || "DEPT_UNKNOWN"} • {profile?.student_id || "ID_UNKNOWN"}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="text-[10px] font-mono text-muted leading-relaxed">
                              Phone: {profile?.phone || "NO_PHONE"}<br />
                              Emergency: {profile?.emergency_contact_name || "-"}: {profile?.emergency_contact_phone || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <select 
                              value={p.status} 
                              onChange={(e) => handleUpdateParticipantStatus(p.id, e.target.value)}
                              className={`text-[9px] font-mono px-2 py-1 rounded border uppercase font-bold outline-none cursor-pointer hover:border-accent transition-colors ${
                                p.status === "ADMITTED" || p.status === "confirmed" ? "border-emerald-500/30 text-emerald-600" :
                                p.status === "WAITLISTED" || p.status === "waitlist" ? "border-amber-500/30 text-amber-600" :
                                "border-muted/30 text-muted"
                              }`}
                            >
                               <option value="pending">待審核 (PENDING)</option>
                               <option value="confirmed">已錄取 (CONFIRMED)</option>
                               <option value="waitlist">候補中 (WAITLIST)</option>
                               <option value="cancelled">已取消 (CANCELLED)</option>
                            </select>
                          </td>
                          <td className="px-6 py-6">
                            <button
                              onClick={async () => {
                                const newStatus = p.payment_status === 'paid' ? 'unpaid' : 'paid';
                                try {
                                  await registrationService.updatePaymentStatus(p.id, newStatus);
                                  setParticipants(prev => prev.map(item => item.id === p.id ? { ...item, payment_status: newStatus } : item));
                                } catch (err) {
                                  alert("更新失敗");
                                }
                              }}
                              className={`px-3 py-1 rounded-full text-[8px] font-mono uppercase tracking-widest border transition-all ${
                                p.payment_status === 'paid' 
                                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                                  : 'bg-muted/10 border-border text-muted hover:border-accent/40'
                              }`}
                            >
                              {p.payment_status === 'paid' ? '已繳費 (PAID)' : '未繳費 (UNPAID)'}
                            </button>
                          </td>
                          <td className="px-6 py-6 text-right">
                            <button 
                              onClick={() => {
                                if (p.note) alert(`報名備註：\n${p.note}`);
                                else alert("該隊員無報名備註");
                              }}
                              className="p-2 text-muted hover:text-accent transition-colors"
                              title="查看報名備註"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {!isLoadingRegs && participants.length === 0 && (
                <div className="p-20 text-center text-muted font-serif italic">目前尚無隊員報名</div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
