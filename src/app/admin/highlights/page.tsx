"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { galleryService } from "@/services/galleryService";
import { upsertGalleryAction, deleteGalleryAction } from "./actions";
import { EventGallery } from "@/data/events";
import { Save, Plus, Trash2, Camera, ChevronLeft, Image as ImageIcon, X, Loader2 } from "lucide-react";

type ViewMode = "LIST" | "EDIT";

export default function AdminHighlightsPage() {
  const [galleries, setGalleries] = useState<EventGallery[]>([]);
  const [view, setView] = useState<ViewMode>("LIST");
  const [selectedGallery, setSelectedGallery] = useState<EventGallery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    setIsLoading(true);
    try {
      const data = await galleryService.getAllGalleries();
      setGalleries(data);
    } catch (err) {
      console.error("Failed to load galleries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    const newGal: EventGallery = {
      id: "",
      eventTitle: "",
      date: new Date().toLocaleDateString('zh-TW'),
      coverImage: "",
      images: []
    };
    setSelectedGallery(newGal);
    setView("EDIT");
  };

  const handleEdit = (gal: EventGallery) => {
    setSelectedGallery({ ...gal });
    setView("EDIT");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這本相簿嗎？")) return;
    try {
      await deleteGalleryAction(id);
      setGalleries(prev => prev.filter(g => g.id !== id));
    } catch (err: any) {
      alert("刪除失敗: " + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGallery) return;
    
    setIsSaving(true);
    try {
      // Set first image as cover if not set
      if (!selectedGallery.coverImage && selectedGallery.images.length > 0) {
        selectedGallery.coverImage = selectedGallery.images[0].src;
      }
      
      await upsertGalleryAction(selectedGallery);
      await loadGalleries();
      setView("LIST");
    } catch (err: any) {
      alert("儲存失敗: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !selectedGallery) return;

    setIsUploading(true);
    try {
      const urls = await galleryService.uploadImages(files);
      const newImages = urls.map(url => ({ src: url, caption: "" }));
      setSelectedGallery({
        ...selectedGallery,
        images: [...selectedGallery.images, ...newImages]
      });
    } catch (err) {
      alert("上傳失敗");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (idx: number) => {
    if (!selectedGallery) return;
    const newImages = [...selectedGallery.images];
    newImages.splice(idx, 1);
    setSelectedGallery({ ...selectedGallery, images: newImages });
  };

  const updateCaption = (idx: number, caption: string) => {
    if (!selectedGallery) return;
    const newImages = [...selectedGallery.images];
    newImages[idx].caption = caption;
    setSelectedGallery({ ...selectedGallery, images: newImages });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 font-mono text-xs animate-pulse">
          <Loader2 className="w-8 h-8 mb-4 animate-spin text-accent" />
          正在載入花絮資料...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">歷史花絮管理</h1>
            <p className="text-sm font-serif text-muted">記錄社團活動的珍貴瞬間，管理精選照片與回憶。</p>
          </div>
          <div className="flex gap-3">
            {view === "LIST" ? (
              <button 
                onClick={handleCreateNew}
                className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                新增花絮相簿
              </button>
            ) : (
              <button 
                onClick={() => setView("LIST")}
                className="px-6 py-2.5 bg-surface border border-border text-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:bg-background transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-3 h-3" />
                返回列表
              </button>
            )}
          </div>
        </div>

        {view === "LIST" ? (
          /* List View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleries.map((gal) => (
              <div 
                key={gal.id}
                className="group bg-surface border border-border rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="aspect-video bg-muted/10 relative overflow-hidden">
                  {gal.coverImage ? (
                    <img src={gal.coverImage} alt={gal.eventTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted/20">
                      <Camera className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={() => handleEdit(gal)}
                      className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(gal.id)}
                      className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <div className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold mb-2">{gal.date}</div>
                  <h3 className="text-xl font-display italic mb-2">{gal.eventTitle}</h3>
                  <div className="text-[10px] font-mono text-muted uppercase tracking-widest">
                    {gal.images.length} Photos
                  </div>
                </div>
              </div>
            ))}
            {galleries.length === 0 && (
              <div className="col-span-full py-32 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-muted/30 italic font-serif">
                目前尚無花絮紀錄。
              </div>
            )}
          </div>
        ) : (
          /* Edit/Create View */
          <form onSubmit={handleSave} className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Sidebar Info */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">活動名稱 Event Title</label>
                    <input 
                      type="text" 
                      value={selectedGallery?.eventTitle}
                      onChange={(e) => setSelectedGallery(prev => prev ? { ...prev, eventTitle: e.target.value } : null)}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-display italic text-lg outline-none focus:border-accent"
                      placeholder="例如：2026 雪山東峰迎新"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">活動日期 Date</label>
                    <input 
                      type="text" 
                      value={selectedGallery?.date}
                      onChange={(e) => setSelectedGallery(prev => prev ? { ...prev, date: e.target.value } : null)}
                      className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-xs outline-none focus:border-accent"
                      placeholder="YYYY/MM/DD"
                      required
                    />
                  </div>
                </div>

                <div className="bg-accent/5 border border-accent/20 rounded-3xl p-8 space-y-4">
                  <h4 className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">批次上傳圖片 Batch Upload</h4>
                  <p className="text-xs text-muted font-serif leading-relaxed">支援同時選取多張圖片。上傳後可為每張照片個別加入說明文字。</p>
                  <label className="block">
                    <div className="w-full py-4 bg-accent text-white rounded-xl font-mono text-[10px] uppercase tracking-widest font-bold text-center cursor-pointer hover:brightness-110 transition-all flex items-center justify-center gap-2">
                      {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                      {isUploading ? "正在上傳..." : "選擇圖片上傳"}
                    </div>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleBatchUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* Photos Area */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-mono text-foreground font-bold uppercase tracking-widest border-l-2 border-accent pl-3">活動照片管理 ({selectedGallery?.images.length || 0})</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {selectedGallery?.images.map((img, idx) => (
                    <div key={idx} className="group bg-surface border border-border rounded-3xl overflow-hidden shadow-sm hover:border-accent/50 transition-all relative">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={img.src} alt="Gallery" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="p-6">
                        <label className="block text-[8px] font-mono text-muted uppercase tracking-widest mb-1.5 ml-1">照片說明 Caption</label>
                        <input 
                          type="text" 
                          value={img.caption}
                          onChange={(e) => updateCaption(idx, e.target.value)}
                          className="w-full bg-background border border-border px-3 py-2 rounded-lg font-serif text-xs outline-none focus:border-accent"
                          placeholder="輸入這張照片的故事..."
                        />
                      </div>
                    </div>
                  ))}
                  {(!selectedGallery?.images || selectedGallery.images.length === 0) && !isUploading && (
                    <div className="col-span-full py-20 border-2 border-dashed border-border rounded-3xl flex flex-col items-center justify-center text-muted/30">
                      <Plus className="w-10 h-10 mb-4 opacity-10" />
                      <p className="font-mono text-[10px] uppercase tracking-widest">目前尚無照片，請先從左側上傳</p>
                    </div>
                  )}
                  {isUploading && (
                    <div className="col-span-full py-20 border-2 border-dashed border-accent/30 rounded-3xl flex flex-col items-center justify-center text-accent/50 animate-pulse">
                      <Loader2 className="w-10 h-10 mb-4 animate-spin" />
                      <p className="font-mono text-[10px] uppercase tracking-widest">正在處理大量照片，請稍候...</p>
                    </div>
                  )}
                </div>

                <div className="pt-10 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="px-12 py-4 bg-foreground text-background rounded-2xl font-mono text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl shadow-foreground/10 hover:bg-accent hover:text-white transition-all disabled:opacity-50 flex items-center gap-3"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "正在儲存中..." : "發佈花絮相簿"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
