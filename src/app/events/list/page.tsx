"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import { eventsData, difficultyLevels, EventItem } from "@/data/events";
import { eventService } from "@/services/eventService";
import Link from "next/link";

// Helper to get semester from date (Taiwan Academic Year)
const getSemester = (dateStr: string) => {
  const date = new Date(dateStr.replace(/\//g, "-"));
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const academicYear = month >= 8 ? (year - 1911) : (year - 1912);
  const semester = month >= 8 ? 1 : 2;
  
  return `${academicYear}-${semester}`;
};

export default function EventListPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeEventRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    eventService.getAllEvents().then(data => {
      setEvents(data);
      setIsLoading(false);
    });
  }, []);

  // Group events by semester
  const groupedEvents = events.reduce((acc, event) => {
    const sem = getSemester(event.date.split("-")[0]); // Handle range dates
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(event);
    return acc;
  }, {} as Record<string, EventItem[]>);

  // Sort semesters descending
  const sortedSemesters = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a));

  // Auto-scroll to active event
  useEffect(() => {
    if (activeEventRef.current) {
      activeEventRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [events]);

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      <div className="pt-24">


        {isLoading ? (
          <div className="py-32 text-center animate-pulse">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Loading_Expeditions...</p>
          </div>
        ) : sortedSemesters.length > 0 ? (
          <div className="space-y-24">
            {sortedSemesters.map(semester => (
              <div key={semester} className="space-y-8">
                <div className="flex items-center gap-4 max-w-7xl mx-auto px-6">
                  <h2 className="text-3xl font-display italic text-accent">{semester} 學年度</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
                </div>
                
                <div className="flex overflow-x-auto pb-12 gap-8 snap-x no-scrollbar px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
                  {groupedEvents[semester].map((event) => {
                    const isOpen = event.status === "open";
                    return (
                      <div 
                        key={event.id}
                        ref={isOpen ? activeEventRef : null}
                        className="flex-shrink-0 w-[320px] md:w-[400px] snap-center"
                      >
                        <Link href={`/events/${event.id}`} className="block group">
                          <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                            {/* Card Content... */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <div 
                                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-[2s]"
                                style={{ backgroundImage: `url(${event.coverImage})` }}
                              ></div>
                              <div className="absolute top-6 left-6">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-mono text-white uppercase tracking-[0.2em] shadow-lg ${
                                  difficultyLevels.find(l => l.label === event.difficulty)?.color || "bg-accent"
                                }`}>
                                  {event.difficulty}
                                </span>
                              </div>
                              {isOpen && (
                                <div className="absolute top-6 right-6">
                                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-500/20">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                    <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-widest font-bold">Open</span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                              <div className="flex justify-between items-center mb-4">
                                <div className="font-mono text-[10px] text-accent font-bold tracking-widest">{event.date}</div>
                                <div className="font-mono text-[10px] text-muted/60">{event.cost}</div>
                              </div>
                              
                              <h3 className="text-2xl font-display italic mb-4 group-hover:text-accent transition-colors line-clamp-2 break-words">
                                {event.title}
                              </h3>
                              
                              <p className="text-sm font-serif text-muted leading-relaxed mb-8 line-clamp-3 break-words">
                                {event.summary}
                              </p>

                              <div className="mt-auto pt-6 border-t border-border/50 flex justify-between items-center">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold group-hover:translate-x-1 transition-transform">
                                  View Details →
                                </span>
                                <span className="text-[9px] font-mono text-muted/40 uppercase">{event.id}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                  {/* Invisible spacer for end padding */}
                  <div className="flex-shrink-0 w-[max(1.5rem,calc((100vw-80rem)/2))] h-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border border-dashed border-border rounded-[3rem] max-w-7xl mx-auto px-6">
            <p className="font-serif text-muted italic">目前尚無已發布的計畫行程。</p>
          </div>
        )}
      </div>
    </main>
  );
}
