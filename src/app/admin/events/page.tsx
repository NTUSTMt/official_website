"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { eventsData, EventItem } from "@/data/events";
import { eventService, registrationService } from "@/services/eventService";

type ViewState = "LIST" | "EDIT_EVENT" | "VIEW_PARTICIPANTS";

export default function AdminEventsPage() {
  const [view, setView] = useState<ViewState>("LIST");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load events from DB
  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data.length > 0 ? data : eventsData); // Fallback to mock if DB empty
      } finally {
        setIsLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Load participants when viewing an event
  useEffect(() => {
    if (view === "VIEW_PARTICIPANTS" && selectedEvent) {
      registrationService.getRegistrations(selectedEvent.id).then(setParticipants);
    }
  }, [view, selectedEvent]);

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
      description: (formData.get("description") as string).split("\n"),
      difficulty: selectedEvent?.difficulty || "初級", // Simplified for now
      calendarDates: [formData.get("date") as string], // Simplified
    };

    try {
      await eventService.upsertEvent(eventToSave);
      alert("儲存成功！");
      // Refresh list
      const updated = await eventService.getAllEvents();
      setEvents(updated);
      setView("LIST");
    } catch (err) {
      alert("儲存失敗");
    }
  };

  if (isLoading) {
    return <AdminLayout><div className="p-20 text-center font-mono animate-pulse">LOADING_EVENTS...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">
              {view === "LIST" ? "活動與報名管理" : 
               view === "EDIT_EVENT" ? "編輯/新增活動" : "隊員名單審核"}
            </h1>
            <p className="text-sm font-serif text-muted">
              {view === "LIST" ? "管理社團出團活動、上架新行程並監控報名進度。" :
               view === "EDIT_EVENT" ? `正在設定活動：${selectedEvent?.title || "新活動"}` :
               `正在審核活動：${selectedEvent?.title}`}
            </p>
          </div>
          <div className="flex gap-3">
            {view !== "LIST" && (
              <button 
                onClick={() => setView("LIST")}
                className="px-6 py-2.5 bg-surface border border-border text-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-background transition-all"
              >
                ← Back to List
              </button>
            )}
            {view === "LIST" && (
              <button 
                onClick={() => { setSelectedEvent(null); setView("EDIT_EVENT"); }}
                className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                + New Event
              </button>
            )}
          </div>
        </div>

        {/* View: Event List */}
        {view === "LIST" && (
          <div className="grid grid-cols-1 gap-6">
            {events.map((event) => {
              return (
                <div key={event.id} className="bg-surface border border-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 group hover:border-accent/50 transition-all">
                  <div className="w-full md:w-32 h-24 rounded-2xl bg-background overflow-hidden relative flex-shrink-0">
                    <img src={event.coverImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border tracking-widest font-bold uppercase ${
                        event.status === "open" ? "border-emerald-500/20 text-emerald-600 bg-emerald-50" : "border-muted/20 text-muted bg-background"
                      }`}>
                        {event.status}
                      </span>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{event.date}</span>
                    </div>
                    <h3 className="text-xl font-display italic truncate mb-1">{event.title}</h3>
                    <div className="flex items-center gap-4 text-xs font-serif text-muted">
                      <span>難度: {event.difficulty}</span>
                      <span>費用: {event.cost}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => { setSelectedEvent(event); setView("VIEW_PARTICIPANTS"); }}
                      className="flex-1 md:flex-none px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold hover:bg-accent/20 transition-all"
                    >
                      Participants
                    </button>
                    <button 
                      onClick={() => { setSelectedEvent(event); setView("EDIT_EVENT"); }}
                      className="flex-1 md:flex-none px-4 py-2 bg-surface border border-border rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold hover:bg-background transition-all"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-muted hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View: Edit Event Form */}
        {view === "EDIT_EVENT" && (
          <form onSubmit={handleSaveEvent} className="bg-surface border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-mono text-accent font-bold uppercase tracking-widest border-l-2 border-accent pl-3">Basic_Details</h3>
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">活動名稱</label>
                  <input name="title" type="text" defaultValue={selectedEvent?.title} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors" placeholder="e.g. 玉山主峰三日行" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">活動日期</label>
                    <input name="date" type="text" defaultValue={selectedEvent?.date} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors" placeholder="YYYY/MM/DD" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">狀態</label>
                    <select name="status" defaultValue={selectedEvent?.status || "open"} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors">
                      <option value="open">Open (報名中)</option>
                      <option value="closed">Closed (已截止)</option>
                      <option value="upcoming">Upcoming (籌備中)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">費用內容</label>
                  <input name="cost" type="text" defaultValue={selectedEvent?.cost} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors" placeholder="e.g. NT$ 2,500" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-mono text-accent font-bold uppercase tracking-widest border-l-2 border-accent pl-3">Content_&_Media</h3>
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">簡短摘要</label>
                  <input name="summary" type="text" defaultValue={selectedEvent?.summary} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">詳細說明 (每行一段)</label>
                  <textarea name="description" rows={6} defaultValue={selectedEvent?.description?.join("\n")} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors resize-none" />
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-border flex justify-end gap-4">
              <button type="button" onClick={() => setView("LIST")} className="px-8 py-3 text-[10px] font-mono text-muted uppercase tracking-widest">Cancel</button>
              <button type="submit" className="px-10 py-3 bg-accent text-accent-foreground rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold shadow-lg shadow-accent/20">Save_to_Supabase</button>
            </div>
          </form>
        )}

        {/* View: Participants Review */}
        {view === "VIEW_PARTICIPANTS" && selectedEvent && (
          <div className="space-y-8">
            <div className="bg-accent/5 border border-accent/20 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-serif mb-1">報名統計數據</h3>
                <p className="text-xs font-mono text-muted uppercase">Total: {participants.length} | Pending: {participants.filter(p => p.status === "PENDING").length}</p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background border-b border-border">
                    <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Team_Member</th>
                    <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Status</th>
                    <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Payment</th>
                    <th className="px-6 py-5 text-[10px] font-mono text-muted uppercase tracking-widest">Signup_Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {participants.map(p => (
                    <tr key={p.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-6">
                        <div className="text-sm font-serif font-bold">{p.real_name}</div>
                        <div className="text-[10px] font-mono text-muted/60">{p.student_id} • {p.phone}</div>
                      </td>
                      <td className="px-6 py-6">
                        <select 
                          value={p.status} 
                          onChange={(e) => handleUpdateParticipantStatus(p.id, e.target.value)}
                          className={`text-[9px] font-mono px-2 py-1 rounded border uppercase font-bold outline-none ${
                            p.status === "ADMITTED" ? "border-emerald-500/30 text-emerald-600" :
                            p.status === "WAITLISTED" ? "border-amber-500/30 text-amber-600" :
                            "border-muted/30 text-muted"
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="ADMITTED">ADMITTED</option>
                          <option value="WAITLISTED">WAITLISTED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`text-[9px] font-mono px-2 py-1 rounded bg-surface border border-border tracking-widest ${
                          p.payment_status === "PAID" ? "text-emerald-500" : p.payment_status === "VERIFYING" ? "text-amber-500" : "text-red-400"
                        }`}>
                          {p.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-6 font-mono text-[10px] text-muted">
                        {new Date(p.signup_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {participants.length === 0 && (
                <div className="p-20 text-center text-muted font-serif italic">目前尚無隊員報名</div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
