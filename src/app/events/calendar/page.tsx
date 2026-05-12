"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { eventsData } from "@/data/events";
import Link from "next/link";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | null>(new Date());

  // Function to check if a date has events
  const hasEvent = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return eventsData.some((event) => event.calendarDates.includes(dateString));
  };

  // Get events for the selected date
  const selectedDateString = date?.toISOString().split("T")[0] || "";
  const dayEvents = eventsData.filter((event) => 
    event.calendarDates.includes(selectedDateString)
  );

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-5xl mx-auto">
        <section className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display italic mb-6 tracking-tight">近期行程</h1>
          <p className="text-lg font-serif text-muted">選擇日期查看當日預定行程與活動詳情。</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 bg-surface p-8 border border-border rounded-[2.5rem] shadow-sm">
            <style jsx global>{`
              .react-calendar {
                width: 100%;
                border: none;
                background: transparent;
                font-family: inherit;
              }
              .react-calendar__navigation button {
                color: var(--accent);
                font-size: 1.25rem;
                font-family: var(--font-display);
                font-style: italic;
              }
              .react-calendar__month-view__weekdays {
                font-family: var(--font-mono);
                text-transform: uppercase;
                font-size: 0.75rem;
                font-weight: bold;
                letter-spacing: 0.1em;
                color: var(--muted);
              }
              .react-calendar__tile {
                padding: 1.5em 0.5em;
                font-family: var(--font-mono);
                border-radius: 1rem;
                transition: all 0.2s;
              }
              .react-calendar__tile--active {
                background: var(--accent) !important;
                color: white !important;
              }
              .react-calendar__tile--now {
                background: var(--accent-foreground);
                color: var(--accent);
              }
              .has-event {
                position: relative;
                color: #064e3b !important; /* Dark Green */
                font-weight: bold;
              }
              .has-event::after {
                content: "";
                position: absolute;
                bottom: 20%;
                left: 50%;
                transform: translateX(-50%);
                width: 6px;
                height: 6px;
                background: #064e3b;
                border-radius: 50%;
              }
            `}</style>
            <Calendar
              onChange={(val) => setDate(val as Date)}
              value={date}
              tileClassName={({ date, view }) => {
                if (view === "month" && hasEvent(date)) {
                  return "has-event";
                }
                return null;
              }}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface p-8 border border-border rounded-[2.5rem] min-h-[400px]">
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-6 font-bold border-b border-border pb-4">
                Selected Date: {selectedDateString}
              </div>

              {dayEvents.length > 0 ? (
                <div className="space-y-8">
                  {dayEvents.map((event) => (
                    <div key={event.id} className="group">
                      <div className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono mb-2 uppercase tracking-widest bg-emerald-100 text-emerald-800`}>
                        {event.difficulty}
                      </div>
                      <h3 className="text-2xl font-display italic group-hover:text-accent transition-colors mb-2">
                        {event.title}
                      </h3>
                      <p className="text-muted font-serif text-sm mb-6 leading-relaxed">
                        {event.summary}
                      </p>
                      <Link 
                        href={`/events/${event.id}`}
                        className="inline-flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-widest hover:gap-4 transition-all font-bold"
                      >
                        Details <span>→</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-muted/10 text-6xl mb-4 italic font-display">No Events</div>
                  <p className="text-sm text-muted/60 font-serif">當日尚無排定出隊行程。</p>
                </div>
              )}
            </div>
            
            <div className="p-8 bg-background border border-border rounded-[2.5rem] italic font-serif text-muted text-sm text-center">
              * 點擊日期可查看更多細節，<br />部分活動名額有限，請及早報名。
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
