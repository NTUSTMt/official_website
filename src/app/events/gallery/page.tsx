import React from "react";
import Navbar from "@/components/Navbar";
import { galleryData } from "@/data/events";

export default function GalleryPage() {
  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-6xl mx-auto">
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">Memories</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display italic mb-8 tracking-tight">歷史花絮</h1>
          <p className="text-xl font-serif text-muted max-w-3xl leading-relaxed">
            重溫每一次登頂的感動。這裡記錄了我們在山林間留下的足跡與笑容。
          </p>
        </section>

        <div className="space-y-24">
          {galleryData.map((album) => (
            <div key={album.id} className="space-y-12">
              <div className="flex justify-between items-end border-b border-border pb-8">
                <div>
                  <h2 className="text-4xl font-display italic mb-2">{album.eventTitle}</h2>
                  <div className="font-mono text-xs text-muted/60 uppercase tracking-[0.2em]">{album.date}</div>
                </div>
                <div className="font-mono text-[10px] text-accent font-bold uppercase tracking-widest">
                  {album.images.length} Photos
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {album.images.map((image, idx) => (
                  <div 
                    key={idx}
                    className="group relative bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <div className="absolute inset-0 bg-muted/20"></div>
                      <div 
                        className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-[1.5s]"
                        style={{ backgroundImage: `url(${image.src})` }}
                      ></div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
                    </div>
                    
                    <div className="p-8">
                      <p className="font-serif italic text-muted text-sm leading-relaxed text-center group-hover:text-accent transition-colors">
                        「{image.caption}」
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <button className="px-16 py-4 border border-border rounded-full font-mono text-[10px] uppercase tracking-[0.3em] text-muted hover:border-accent hover:text-accent transition-all">
            Load More Memories
          </button>
        </div>
      </div>
    </main>
  );
}
