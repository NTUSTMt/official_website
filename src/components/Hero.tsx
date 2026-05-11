import React from "react";

export default function Hero() {
  return (
    <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background Image with Parallax effect simulated by fixed bg */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/hero-bg.png')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 hero-text-shadow">
        <h1 className="text-5xl md:text-[7rem] font-display leading-[1.1] tracking-tighter mb-8 italic text-white">
          <span className="block">台灣科技大學登山社</span>
          <span className="block font-mono text-sm md:text-base tracking-[0.4em] uppercase mt-6 not-italic opacity-100 font-bold">
            NTUST Mountaineering Club
          </span>
        </h1>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-white/30" />
      </div>
    </header>
  );
}
