"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { galleryService } from "@/services/galleryService";
import { EventGallery, galleryData as mockData } from "@/data/events";
import { Loader2, Camera, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<EventGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndices, setActiveIndices] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const data = await galleryService.getAllGalleries();
        setGalleries(data);
        // Initialize indices
        const indices: Record<string, number> = {};
        data.forEach(g => { indices[g.id] = 0; });
        setActiveIndices(indices);
      } catch (err) {
        console.error("Failed to fetch gallery data:", err);
        setGalleries([]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const nextPhoto = (albumId: string, total: number) => {
    setActiveIndices(prev => ({
      ...prev,
      [albumId]: (prev[albumId] + 1) % total
    }));
  };

  const prevPhoto = (albumId: string, total: number) => {
    setActiveIndices(prev => ({
      ...prev,
      [albumId]: (prev[albumId] - 1 + total) % total
    }));
  };

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">Memories</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display italic mb-8 tracking-tight">歷史花絮</h1>
          <p className="text-xl font-serif text-muted max-w-3xl leading-relaxed">
            重溫每一次登頂的感動。這裡記錄了我們在山林間留下的足跡與笑容。
          </p>
        </section>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-accent/50" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">正在喚起那些珍貴回憶...</p>
          </div>
        ) : (
          <div className="space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {galleries.map((album) => {
              const currentIndex = activeIndices[album.id] || 0;
              const currentImage = album.images[currentIndex];
              
              if (!currentImage) return null;

              return (
                <div key={album.id} className="space-y-8">
                  <div className="flex justify-between items-end border-b border-border pb-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-display italic mb-1">{album.eventTitle}</h2>
                      <div className="font-mono text-[10px] text-muted/60 uppercase tracking-[0.2em]">{album.date}</div>
                    </div>
                    <div className="font-mono text-[10px] text-accent font-bold uppercase tracking-widest">
                      {currentIndex + 1} / {album.images.length}
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-muted/5 flex items-center justify-center">
                      <img 
                        src={currentImage.src} 
                        alt=""
                        className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-500"
                        key={currentImage.src} // Force re-animation on src change
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop";
                        }}
                      />
                    </div>

                    {/* Navigation Buttons */}
                    {album.images.length > 1 && (
                      <>
                        <button 
                          onClick={() => prevPhoto(album.id, album.images.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-md border border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-white"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button 
                          onClick={() => nextPhoto(album.id, album.images.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-md border border-border rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-accent hover:text-white"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  <p className="font-serif italic text-muted text-lg text-center animate-in fade-in duration-700">
                    「{currentImage.caption || "時光匆匆，唯有回憶永存。"}」
                  </p>
                </div>
              );
            })}
            
            {galleries.length === 0 && (
              <div className="py-32 text-center">
                <Camera className="w-16 h-16 mx-auto mb-6 text-muted/20" />
                <p className="font-serif italic text-muted text-xl">暫時還沒有上傳的花絮相簿...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
