"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { cmsService } from "@/services/cmsService";

export default function CalendarPage() {
  const [calendars, setCalendars] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const dbCalendars = await cmsService.getSemesterCalendars();
        setCalendars(dbCalendars);
      } catch (error) {
        console.error("Error fetching calendars:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return null;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">

        <div className="space-y-20">
          {calendars.map((cal, idx) => {
            const urls = cal.urls || (cal.url ? [cal.url] : []);
            return (
              <div key={idx} className="group space-y-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-display italic text-foreground whitespace-nowrap">{cal.semester} 學期行事曆</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
                  <span className="font-mono text-[10px] text-muted uppercase tracking-widest hidden sm:block">Semester Poster</span>
                </div>
                
                {/* Horizontal Scrollable Container with Bleed Effect */}
                <div className="-mx-6 overflow-x-auto no-scrollbar snap-x flex gap-6 pb-8 scroll-pl-6">
                  <div className="flex-shrink-0 w-6" />
                  {urls.map((url: string, imgIdx: number) => (
                    <div key={imgIdx} className="flex-shrink-0 w-[85vw] md:w-[600px] snap-start">
                      <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-border shadow-sm group-hover:shadow-2xl group-hover:border-accent transition-all duration-700">
                        <img 
                          src={url} 
                          alt={`${cal.semester} Calendar ${imgIdx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        {/* Decorative overlay on hover */}
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      </div>
                    </div>
                  ))}
                  <div className="flex-shrink-0 w-6" />
                  
                  {urls.length === 0 && (
                    <div className="w-[85vw] md:w-[600px] flex-shrink-0 aspect-[3/4] rounded-[2.5rem] bg-surface border border-border flex items-center justify-center italic text-muted/20 font-display text-4xl">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {calendars.length === 0 && (
            <div className="py-40 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-muted/20">
              <div className="text-6xl font-display italic mb-4">Coming Soon</div>
              <p className="font-serif text-sm">目前尚無上傳的學期行事曆，請靜候社團更新。</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
