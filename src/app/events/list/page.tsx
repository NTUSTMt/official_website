"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { eventsData, difficultyLevels } from "@/data/events";
import Link from "next/link";

export default function EventListPage() {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredEvents = filter === "ALL" 
    ? eventsData 
    : eventsData.filter(e => e.difficulty === filter);

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-6xl mx-auto">
        <section className="mb-16">
          <h1 className="text-5xl md:text-7xl font-display italic mb-8 tracking-tight">活動列表</h1>
          
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3 items-center">
            <button 
              onClick={() => setFilter("ALL")}
              className={`px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all ${
                filter === "ALL" ? "bg-accent text-white" : "bg-surface text-muted border border-border hover:border-accent"
              }`}
            >
              All Expeditions
            </button>
            {difficultyLevels.map(level => (
              <button 
                key={level.label}
                onClick={() => setFilter(level.label)}
                className={`px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all ${
                  filter === level.label ? "bg-accent text-white" : "bg-surface text-muted border border-border hover:border-accent"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-12">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div 
                key={event.id}
                className="group grid grid-cols-1 md:grid-cols-12 bg-surface border border-border rounded-[3rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Image Section */}
                <div className="md:col-span-5 relative h-64 md:h-full min-h-[300px] overflow-hidden">
                  <div className="absolute inset-0 bg-muted/20 animate-pulse"></div>
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-[2s]"
                    style={{ backgroundImage: `url(${event.coverImage})` }}
                  ></div>
                  <div className="absolute top-8 left-8">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-mono text-white uppercase tracking-[0.2em] shadow-lg ${
                      difficultyLevels.find(l => l.label === event.difficulty)?.color || "bg-accent"
                    }`}>
                      {event.difficulty}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="md:col-span-7 p-10 md:p-16 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-6">
                    <div className="font-mono text-xs text-accent font-bold tracking-widest">{event.date}</div>
                    <div className="font-mono text-xs text-muted/60">{event.cost}</div>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-display italic mb-6 group-hover:text-accent transition-colors">
                    {event.title}
                  </h2>
                  
                  <p className="text-lg font-serif text-muted leading-relaxed mb-10 max-w-xl">
                    {event.summary}
                  </p>

                  <div className="flex items-center gap-8">
                    <Link 
                      href={`/events/${event.id}`}
                      className="px-10 py-4 bg-accent text-white rounded-full font-mono text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg shadow-accent/20"
                    >
                      詳細說明
                    </Link>
                    
                    {event.status === "open" && (
                      <span className="flex items-center gap-2 font-mono text-[10px] text-emerald-600 uppercase tracking-widest font-bold">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                        報名開放中
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center border border-dashed border-border rounded-[3rem]">
              <p className="font-serif text-muted italic">目前沒有符合該難度等級的計畫行程。</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
