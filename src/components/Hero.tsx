import React from "react";

interface HeroProps {
  title: string;
  subtitle?: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <header className="relative h-full w-full overflow-hidden flex items-center justify-center bg-white">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/images/hero-bg.jpg')",
        }}
      />
      
      <div className="relative z-20 text-center px-4 hero-text-shadow max-w-4xl">
        <h1 className="flex flex-col items-center">
          <span className="text-4xl md:text-7xl lg:text-8xl font-display leading-[1.1] tracking-tighter mb-4 italic text-white uppercase drop-shadow-2xl">
            {title}
          </span>
          {subtitle && (
            <span className="text-white font-mono text-[10px] md:text-base tracking-[0.3em] md:tracking-[0.5em] uppercase mt-4 opacity-90 font-bold drop-shadow-md max-w-2xl">
              {subtitle}
            </span>
          )}
        </h1>
      </div>
    </header>
  );
}
