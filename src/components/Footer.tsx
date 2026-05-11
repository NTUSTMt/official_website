import React from "react";

export default function Footer() {
  return (
    <footer className="py-24 bg-surface text-left px-6 pb-24 border-t border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 pt-12">
        <div className="md:col-span-2">
          <span className="text-2xl font-display italic tracking-tight block mb-4">NTUST Mountaineering Club</span>
          <p className="text-sm text-muted max-w-xs leading-relaxed italic">
            A university-based organization dedicated to high-altitude exploration and wilderness stewardship since 1985.
          </p>
        </div>
        <div className="space-y-4">
          <div className="font-mono text-[10px] text-muted uppercase tracking-widest font-bold">Navigation</div>
          <div className="flex flex-col gap-2 text-xs font-mono uppercase tracking-widest">
            <a href="#" className="hover:text-accent transition-colors">Calendar</a>
            <a href="#" className="hover:text-accent transition-colors">Equipment</a>
            <a href="#" className="hover:text-accent transition-colors">Safety</a>
          </div>
        </div>
        <div className="space-y-4">
          <div className="font-mono text-[10px] text-muted uppercase tracking-widest font-bold">Contact</div>
          <div className="text-xs font-mono uppercase tracking-widest opacity-70">
            Basecamp Building B1<br />
            No. 1 University Rd.
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
          © {new Date().getFullYear()} NTUST Mountaineering Club. All Rights Reserved.
        </p>
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
          Designed by Antigravity
        </p>
      </div>
    </footer>
  );
}
