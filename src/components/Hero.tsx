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
      
      <div className="relative z-20 text-center px-4 hero-text-shadow">
        <h1 className="text-5xl md:text-[7rem] font-display leading-[1.1] tracking-tighter mb-8 italic text-white">
          <span className="text-white block">台灣科技大學登山社</span>
          <span className="text-white block font-mono text-sm md:text-base tracking-[0.4em] uppercase mt-6 not-italic opacity-100 font-bold">
            NTUST Mountaineering Club
          </span>
        </h1>
      </div>
    </header>
  );
}
