import React from "react";

export default function Hero() {
  return (
    <header className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      />
      
      {/* Overlay to ensure text legibility */}
      <div className="absolute inset-0 bg-black/10 z-10" />
      
      <div className="relative z-20 text-center px-4 hero-text-shadow max-w-4xl">
        <h1 className="flex flex-col items-center">
          <span className="text-5xl md:text-8xl font-display leading-[1.1] tracking-tighter mb-4 italic text-white uppercase drop-shadow-2xl">
            臺灣科技大學登山社
          </span>
          <span className="text-white font-mono text-sm md:text-lg tracking-[0.5em] uppercase mt-2 opacity-90 font-bold drop-shadow-md">
            NTUST Mountaineering Club
          </span>
        </h1>
      </div>
    </header>
  );
}
