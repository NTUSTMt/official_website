import React from "react";

interface HeroProps {
  tagline?: string;
  subtext?: string;
  stats?: {
    expeditions: string;
    members: string;
    years: string;
  };
}

export default function Hero({ tagline, subtext, stats }: HeroProps) {
  return (
    <header className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      />
      
      <div className="relative z-20 text-center px-4 hero-text-shadow max-w-4xl">
        <h1 className="text-5xl md:text-[7rem] font-display leading-[1.1] tracking-tighter mb-8 italic text-white uppercase">
          <span className="text-white block">{tagline || "EXPLORE THE UNKNOWN"}</span>
          <span className="text-white block font-mono text-sm md:text-base tracking-[0.4em] uppercase mt-6 not-italic opacity-100 font-bold">
            NTUST Mountaineering Club
          </span>
        </h1>
        {subtext && (
          <p className="text-white/80 font-serif text-lg md:text-xl max-w-2xl mx-auto mb-12 drop-shadow-lg">
            {subtext}
          </p>
        )}

        {stats && (
          <div className="flex justify-center gap-12 md:gap-24 mt-16">
            <div className="text-center">
              <div className="text-white font-mono text-2xl md:text-4xl font-bold mb-1">{stats.expeditions}</div>
              <div className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Expeditions</div>
            </div>
            <div className="text-center">
              <div className="text-white font-mono text-2xl md:text-4xl font-bold mb-1">{stats.members}</div>
              <div className="text-white/60 font-mono text-[10px] uppercase tracking-widest">Members</div>
            </div>
            <div className="text-center">
              <div className="text-white font-mono text-2xl md:text-4xl font-bold mb-1">{stats.years}</div>
              <div className="text-white/60 font-mono text-[10px] uppercase tracking-widest">History</div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
