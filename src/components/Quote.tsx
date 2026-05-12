import React from "react";

export default function Quote() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="bg-surface relative overflow-hidden rounded-[3rem] py-32 px-12 text-center border border-border shadow-sm group">
        <div 
          className="absolute inset-0 opacity-10 bg-fixed bg-center bg-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]"
          style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-6xl font-display italic leading-tight mb-8 text-foreground">
            “ 登山不是為了征服山，<br className="hidden md:block" />
            實是為了在山的懷抱中，學會謙卑與誠實。 ”
          </h3>
          <div className="font-mono text-xs tracking-[0.4em] text-accent uppercase font-bold">Wilderness_Philosophy</div>
        </div>
      </div>
    </section>
  );
}
