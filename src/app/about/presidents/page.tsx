"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { committeeData as defaultData } from "@/data/committee";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function PresidentsPage() {
  const [committees, setCommittees] = useState(defaultData);
  const [showAll, setShowAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }
      const { data } = await supabase
        .from("cms_config")
        .select("content")
        .eq("id", "committee_data")
        .single();
      if (data?.content) {
        setCommittees(data.content as any);
      }
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const sortedCommittees = [...committees].sort((a, b) => b.year.localeCompare(a.year, undefined, { numeric: true }));
  const displayedData = showAll ? sortedCommittees : sortedCommittees.slice(0, 5);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">

        <div className="space-y-16">
          {displayedData.map((yearGroup) => (
            <div key={yearGroup.year} className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Modern Year Display - Scaled Down */}
                <div className="md:sticky md:top-32 flex-shrink-0 flex items-baseline gap-2 group">
                  <span className="text-3xl md:text-5xl font-display italic text-foreground leading-none">{yearGroup.year}</span>
                  <span className="text-[9px] font-mono text-muted uppercase tracking-[0.2em] [writing-mode:vertical-rl] h-fit border-l border-border pl-1.5 py-1">學年度</span>
                </div>

                {/* Members List - Horizontal Scroll */}
                <div className="flex-1 w-full overflow-x-auto no-scrollbar">
                  <div className="flex gap-6 pb-8">
                    {yearGroup.members.map((member, idx) => (
                      <div key={idx} className="w-[240px] md:w-[280px] flex-shrink-0 bg-surface/50 border border-border p-8 group hover:border-accent hover:bg-white transition-all duration-500 rounded-[2rem] shadow-sm hover:shadow-lg flex flex-col items-center text-center">
                        {/* Scaled Down Avatar */}
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-muted/10 rounded-full mb-6 overflow-hidden relative border border-border group-hover:border-accent transition-all duration-500 shadow-inner">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted/20">
                              <svg className="w-10 h-10 md:w-12 md:h-12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="font-mono text-[9px] text-accent uppercase tracking-[0.2em] font-bold">{member.role}</div>
                            <h4 className="text-xl md:text-2xl font-display italic tracking-tight">{member.name}</h4>
                            <div className="font-mono text-[9px] text-muted uppercase tracking-wider">{member.dept}</div>
                          </div>
                          
                          {member.intro && (
                            <div className="pt-3 border-t border-border/50">
                              <p className="text-xs font-serif text-muted italic leading-relaxed px-1 line-clamp-2">
                                「{member.intro}」
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAll && committees.length > 5 && (
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
          2026 © 國立臺灣科技大學登山社 · 歷屆幹部
        </p>
      </div>
    </main>
  );
}
