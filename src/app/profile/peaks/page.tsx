"use client";

import React, { useState, useEffect } from "react";
import ProfileLayout from "@/components/ProfileLayout";
import { userService, UserProfile } from "@/services/userService";
import { peakService } from "@/services/peakService";
import { Plus, Mountain, Calendar, Hash, Trash2, MapPin, Search, X } from "lucide-react";
import Link from "next/link";

export default function PeaksPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [peaks, setPeaks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    peak_name: "",
    climb_date: new Date().toISOString().split('T')[0],
    note: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const profile = await userService.getCurrentUser();
        if (profile) {
          setUser(profile);
          const data = await peakService.getUserPeaks(profile.id);
          setPeaks(data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddPeak = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const newPeak = await peakService.addPeak({
        user_id: user.id,
        ...formData,
        is_official: false // Manually added peaks are not official club trips
      });
      setPeaks([newPeak, ...peaks]);
      setIsModalOpen(false);
      setFormData({ peak_name: "", climb_date: new Date().toISOString().split('T')[0], note: "" });
    } catch (err: any) {
      console.error("Save peak error:", err);
      alert("新增失敗: " + (err.message || "未知錯誤"));
    }
  };

  const handleDeletePeak = async (id: string) => {
    if (!confirm("確定要刪除這筆紀錄嗎？")) return;
    try {
      await peakService.deletePeak(id);
      setPeaks(peaks.filter(p => p.id !== id));
    } catch (err) {
      alert("刪除失敗");
    }
  };

  const filteredPeaks = peaks.filter(p => 
    p.peak_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="p-20 text-center font-mono animate-pulse text-xs tracking-widest text-muted">
          RETRIEVING_SUMMIT_LOGS...
        </div>
      </ProfileLayout>
    );
  }

  if (!user) {
    return (
      <ProfileLayout>
        <div className="p-20 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center font-serif text-muted italic mb-8">
            無法載入個人資料，請嘗試登入。
          </div>
          <Link 
            href="/login" 
            className="px-10 py-4 bg-accent text-white rounded-2xl font-mono text-[10px] uppercase tracking-[0.2em] font-bold hover:brightness-110 transition-all shadow-xl shadow-accent/20"
          >
            Go_to_Login
          </Link>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">山岳足跡</h1>
            <p className="text-sm font-serif text-muted">記錄您的每一次登頂，見證在高山上的成長與感動。</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center gap-3 px-8 py-3.5 bg-accent text-white rounded-2xl font-mono text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-accent/20"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            登錄新紀錄
          </button>
        </header>

        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40" />
          <input 
            type="text" 
            placeholder="搜尋山名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface border border-border pl-12 md:pl-14 pr-6 py-3 md:py-4 rounded-[1.5rem] md:rounded-3xl text-sm outline-none focus:border-accent transition-all shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPeaks.map((peak) => (
            <div key={peak.id} className="group relative bg-surface border border-border p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] hover:border-accent/30 transition-all hover:shadow-xl hover:shadow-accent/5">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${peak.is_official ? 'bg-accent text-white' : 'bg-background text-muted'}`}>
                  <Mountain className="w-6 h-6" />
                </div>
                <button 
                  onClick={() => handleDeletePeak(peak.id)}
                  className="p-2 text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-xl font-display italic mb-1">{peak.peak_name}</h3>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted uppercase tracking-widest mb-6">
                <Calendar className="w-3 h-3" />
                {peak.climb_date}
              </div>

              {peak.note && (
                <p className="text-xs font-serif text-muted/80 line-clamp-2 italic border-l-2 border-accent/20 pl-4 py-1">
                  "{peak.note}"
                </p>
              )}

              {peak.is_official && (
                <div className="mt-6 inline-block px-3 py-1 bg-accent/5 text-accent border border-accent/10 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider">
                  Official_Trip
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPeaks.length === 0 && (
          <div className="p-32 text-center bg-accent/5 rounded-[3rem] border border-dashed border-accent/20">
            <Mountain className="w-12 h-12 text-accent/20 mx-auto mb-6" />
            <p className="text-sm font-serif text-muted italic">尚未留下任何足跡，開始您的第一趟旅程吧！</p>
          </div>
        )}
      </div>

      {/* Add Peak Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-surface border border-border w-full max-w-lg rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-display italic">登錄山岳足跡</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-foreground transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddPeak} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-3">Mountain_Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="例如：玉山主峰"
                    value={formData.peak_name}
                    onChange={(e) => setFormData({...formData, peak_name: e.target.value})}
                    className="w-full bg-background border border-border px-6 py-4 rounded-2xl text-sm outline-none focus:border-accent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-3">Climb_Date</label>
                  <input 
                    required
                    type="date" 
                    value={formData.climb_date}
                    onChange={(e) => setFormData({...formData, climb_date: e.target.value})}
                    className="w-full bg-background border border-border px-6 py-4 rounded-2xl text-sm outline-none focus:border-accent transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-[0.2em] mb-3">Memories_&_Notes</label>
                  <textarea 
                    rows={4}
                    placeholder="寫下當時的心情或路況..."
                    value={formData.note}
                    onChange={(e) => setFormData({...formData, note: e.target.value})}
                    className="w-full bg-background border border-border px-6 py-4 rounded-2xl text-sm outline-none focus:border-accent transition-all resize-none font-serif"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-8 py-4 bg-background border border-border text-muted rounded-2xl text-[10px] font-mono uppercase tracking-widest font-bold hover:bg-muted/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-4 bg-accent text-white rounded-2xl text-[10px] font-mono uppercase tracking-widest font-bold hover:brightness-110 transition-all shadow-xl shadow-accent/20"
                  >
                    Save_Footprint
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </ProfileLayout>
  );
}
