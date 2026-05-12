"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { committeeData } from "@/data/committee";

export default function PresidentsPage() {
  const [showAll, setShowAll] = useState(false);
  const displayedData = showAll ? committeeData : committeeData.slice(0, 5);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <section className="mb-20">
          <h1 className="text-5xl md:text-7xl font-display italic mb-6 tracking-tight">
            歷任幹部 <span className="text-muted/20">Presidents</span>
          </h1>
          <div className="h-1 w-24 bg-accent mb-12"></div>
        </section>

        <div className="space-y-24">
          {displayedData.map((yearGroup) => (
            <div key={yearGroup.year} className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Year Badge */}
                <div className="md:sticky md:top-32 flex-shrink-0">
                  <div className="bg-accent text-white font-mono text-xl px-4 py-2 italic font-bold">
                    {yearGroup.year}學年度
                  </div>
                </div>

                {/* Members Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {yearGroup.members.map((member, idx) => (
                    <div key={idx} className="bg-surface border border-border p-6 group hover:border-accent transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md">
                      {/* Avatar Placeholder */}
                      <div className="w-24 h-24 bg-muted/10 rounded-full mb-6 mx-auto overflow-hidden relative border border-border group-hover:border-accent transition-colors">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted/30">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1 font-bold">{member.role}</div>
                        <h4 className="text-xl font-display italic mb-1">{member.name}</h4>
                        <div className="font-mono text-[10px] text-muted uppercase mb-4 tracking-wider">{member.dept}</div>
                        {member.intro && (
                          <p className="text-sm font-serif text-muted italic leading-relaxed">
                            「{member.intro}」
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAll && committeeData.length > 5 && (
          <div className="mt-24 text-center">
            <button 
              onClick={() => setShowAll(true)}
              className="px-12 py-4 bg-accent text-white font-mono text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all duration-300 rounded-full shadow-lg shadow-accent/20"
            >
              LOAD MORE HISTORY
            </button>
          </div>
        )}

        <p className="mt-24 text-center font-mono text-[10px] text-muted/40 uppercase tracking-[0.2em]">
          NTUST Mountaineering Club · Historical Leadership
        </p>
      </div>
    </main>
  );
}
