import React from "react";
import Navbar from "@/components/Navbar";
import { difficultyLevels } from "@/data/events";
import { eventService } from "@/services/eventService";
import { notFound } from "next/navigation";
import Link from "next/link";
import RegistrationCTA from "@/components/RegistrationCTA";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await eventService.getEventById(id);

  if (!event) {
    notFound();
  }

  const diffInfo = difficultyLevels.find(l => l.label === event.difficulty);

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${event.coverImage})` }}
          ></div>
        </div>
        
        <div className="relative z-20 w-full px-6 pb-20 max-w-6xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <span className={`px-4 py-1 rounded-full text-[10px] font-mono text-white uppercase tracking-[0.2em] ${diffInfo?.color}`}>
                {event.difficulty}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-display italic text-white tracking-tight drop-shadow-2xl">
              {event.title}
            </h1>
            <div className="font-mono text-2xl text-white tracking-[0.2em] uppercase font-bold">{event.date}</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-30 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-surface p-12 md:p-16 border border-border rounded-[3rem] shadow-xl">
            <div className="max-w-none">
              <h2 className="text-3xl font-display italic mb-8 border-b border-border pb-6">活動詳情 Description</h2>
              <div className="space-y-4">
                {Array.isArray(event.description) ? (
                  event.description.map((para, i) => (
                    <p key={i} className="text-base md:text-lg font-serif text-muted leading-relaxed">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-base md:text-lg font-serif text-muted leading-relaxed">{event.description}</p>
                )}
              </div>
            </div>


          </div>

          <div className="flex justify-between items-center">
            <Link 
              href="/events/list"
              className="flex items-center gap-2 font-mono text-[10px] text-muted uppercase tracking-widest hover:text-accent transition-colors"
            >
              ← Back to List
            </Link>

          </div>
        </div>

        {/* Sidebar / CTA */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface p-10 border border-border rounded-[3rem] shadow-lg sticky top-32">
            <div className="mb-8 text-center space-y-4">
              <div>
                <div className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-2 font-bold">Status</div>
                <div className={`text-2xl font-display italic ${
                  event.status === "open" ? "text-emerald-600" : "text-muted/40"
                }`}>
                  {event.status === "open" ? "開放報名中" : event.status === "closed" ? "報名已截止" : "即將開放"}
                </div>
              </div>

              {event.registrationDeadline && (
                <div className="pt-4 border-t border-border/50">
                  <div className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-2 font-bold">Registration Deadline</div>
                  <div className="text-xl font-mono text-accent">
                    {event.registrationDeadline}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="pt-4 border-t border-border/50 text-center">
                <div className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-1 font-bold">Event Cost</div>
                <div className="text-3xl font-display italic text-foreground">{event.cost}</div>
              </div>

              <RegistrationCTA event={event} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
