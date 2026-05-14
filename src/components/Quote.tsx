import React from "react";

interface QuoteProps {
  text: string;
  label?: string;
}

export default function Quote({ text, label }: QuoteProps) {
  if (!text) return null;
  
  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
      <div className="bg-surface relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] py-16 px-8 md:py-32 md:px-12 text-center border border-border shadow-sm group">
        <div 
          className="absolute inset-0 opacity-10 bg-center bg-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]"
          style={{ 
            backgroundImage: "url('/images/hero-bg-0.jpg')",
            backgroundAttachment: "scroll"
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-6xl font-display italic leading-tight mb-8 text-foreground text-balance">
            “ {text} ”
          </h3>
          {label && (
            <div className="font-mono text-[10px] md:text-xs tracking-[0.3em] md:tracking-[0.4em] text-accent uppercase font-bold">
              {label}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
