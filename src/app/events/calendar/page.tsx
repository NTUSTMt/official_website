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
      
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">Schedule</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display italic mb-8 tracking-tight">行事曆</h1>
          <p className="text-xl font-serif text-muted max-w-3xl leading-relaxed">
            台科大登山社每學期皆會規劃豐富的社課、校園活動與出隊行程。請參考下方的學期行事曆安排您的山野計畫。
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {calendars.map((cal, idx) => (
            <div key={idx} className="group space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-3xl font-display italic text-foreground">{cal.semester} 學期行事曆</h2>
                <span className="font-mono text-[10px] text-muted uppercase tracking-widest">Semester Poster</span>
              </div>
              
              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-border shadow-sm group-hover:shadow-2xl group-hover:border-accent transition-all duration-700">
                {cal.url ? (
                  <img 
                    src={cal.url} 
                    alt={`${cal.semester} Calendar`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                ) : (
                  <div className="w-full h-full bg-surface flex items-center justify-center italic text-muted/20 font-display text-4xl">
                    No Image
                  </div>
                )}
                
                {/* Decorative overlay on hover */}
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>
          ))}
          
          {calendars.length === 0 && (
            <div className="col-span-full py-40 border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-muted/20">
              <div className="text-6xl font-display italic mb-4">Coming Soon</div>
              <p className="font-serif text-sm">目前尚無上傳的學期行事曆，請靜候社團更新。</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
