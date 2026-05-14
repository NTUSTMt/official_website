"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { galleryService } from "@/services/galleryService";
import { EventGallery, galleryData as mockData } from "@/data/events";
import { Loader2, Camera, ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<EventGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndices, setActiveIndices] = useState<Record<string, number>>({});
  const [selectedImage, setSelectedImage] = useState<{ albumId: string; index: number } | null>(null);
  const [isLightboxPlaying, setIsLightboxPlaying] = useState(false);

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

  // Auto-play logic
  useEffect(() => {
    if (isLoading || galleries.length === 0) return;
    if (selectedImage && !isLightboxPlaying) return;
    
    const interval = setInterval(() => {
      if (selectedImage) {
        // Play within lightbox
        const album = galleries.find(g => g.id === selectedImage.albumId);
        if (album && album.images.length > 1) {
          setSelectedImage(prev => prev ? {
            ...prev,
            index: (prev.index + 1) % album.images.length
          } : null);
        }
      } else {
        // Play globally
        setActiveIndices(prev => {
          const nextIndices = { ...prev };
          galleries.forEach(album => {
            if (album.images.length > 1) {
              nextIndices[album.id] = ((prev[album.id] || 0) + 1) % album.images.length;
            }
          });
          return nextIndices;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading, galleries, selectedImage, isLightboxPlaying]);

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

  const closeLightbox = () => {
    setSelectedImage(null);
    setIsLightboxPlaying(false);
  };

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      <div className="pt-24 px-6 max-w-6xl mx-auto">

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
                    <div 
                      className="aspect-[16/9] md:aspect-[21/9] overflow-hidden flex items-center justify-center cursor-zoom-in"
                      onClick={() => setSelectedImage({ albumId: album.id, index: currentIndex })}
                    >
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
      {/* Immersive Lightbox Viewer */}
      {selectedImage && (() => {
        const album = galleries.find(g => g.id === selectedImage.albumId);
        const image = album?.images[selectedImage.index];
        if (!album || !image) return null;

        return (
          <div 
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300"
            onClick={closeLightbox}
          >
            <div className="relative flex items-center justify-center w-full h-full p-12 pointer-events-none">
              <div className="relative">
                <img 
                  src={image.src} 
                  alt=""
                  className="max-w-full max-h-[80vh] object-contain shadow-2xl animate-in fade-in zoom-in-95 duration-1000"
                  key={image.src}
                />
                
                <div className="absolute top-full left-0 right-0 pt-8 text-center space-y-2 animate-in slide-in-from-bottom-4 duration-1000">
                  <p className="text-white font-serif italic text-xl md:text-2xl max-w-3xl mx-auto">
                    「{image.caption || "時光匆匆，唯有回憶永存。"}」
                  </p>
                </div>
              </div>
            </div>

            {/* Top Left Index */}
            <div className="absolute top-8 left-8 z-[250] animate-in fade-in duration-500">
              <p className="font-mono text-xs text-white/40 uppercase tracking-[0.2em]">
                {String(selectedImage.index + 1).padStart(2, '0')} / {String(album.images.length).padStart(2, '0')}
              </p>
            </div>

            {/* Top Right Controls (Hover to reveal) */}
            <div 
              className="absolute top-0 right-0 w-64 h-40 z-[250] flex items-start justify-end p-8 opacity-0 hover:opacity-100 transition-opacity duration-500"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-6">
                <button 
                  className="text-white/60 hover:text-white transition-all p-2"
                  onClick={() => setIsLightboxPlaying(!isLightboxPlaying)}
                >
                  {isLightboxPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </button>
                <button 
                  className="text-white/60 hover:text-white transition-all p-2"
                  onClick={closeLightbox}
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
            </div>
            
            {/* Left Navigation Hover Area */}
            <div 
              className="absolute left-0 top-32 bottom-32 w-24 md:w-32 z-[200] group flex items-center justify-start px-8 opacity-0 hover:opacity-100 transition-opacity duration-500"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage({ ...selectedImage, index: (selectedImage.index - 1 + album.images.length) % album.images.length });
              }}
            >
              <div className="text-white/20 hover:text-white transition-all cursor-pointer">
                <ChevronLeft className="w-16 h-16" />
              </div>
            </div>

            {/* Right Navigation Hover Area */}
            <div 
              className="absolute right-0 top-32 bottom-32 w-24 md:w-32 z-[200] group flex items-center justify-end px-8 opacity-0 hover:opacity-100 transition-opacity duration-500"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage({ ...selectedImage, index: (selectedImage.index + 1) % album.images.length });
              }}
            >
              <div className="text-white/20 hover:text-white transition-all cursor-pointer">
                <ChevronRight className="w-16 h-16" />
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}
