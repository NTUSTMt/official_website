"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { difficultyLevels } from "@/data/events";
import { eventService } from "@/services/eventService";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import RegistrationCTA from "@/components/RegistrationCTA";
import { useTranslation } from "@/context/LanguageContext";

export default function EventDetailPage() {
  const { id } = useParams() as { id: string };
  const { t } = useTranslation();
  const [event, setEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      const data = await eventService.getEventById(id);
      if (!data) {
        notFound();
      }
      setEvent(data);
      setIsLoading(false);
    }
    fetchEvent();
  }, [id]);

  if (isLoading) return null;
  if (!event) return null;

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

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8 md:space-y-12">
          <div className="bg-surface p-6 md:p-12 lg:p-16 border border-border rounded-[2.5rem] md:rounded-[3rem] shadow-xl">
            <div className="max-w-none">
              <h2 className="text-3xl font-display italic mb-8 border-b border-border pb-6">{t('nav.events.details_title')}</h2>
              <div className="space-y-4">
                {Array.isArray(event.description) ? (
                  event.description.map((para: string, i: number) => (
                    <p key={i} className="text-base md:text-lg font-serif text-muted leading-relaxed break-words whitespace-pre-wrap">
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-base md:text-lg font-serif text-muted leading-relaxed break-words whitespace-pre-wrap">{event.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / CTA */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface p-6 md:p-10 border border-border rounded-[2.5rem] md:rounded-[3rem] shadow-lg sticky top-32">
            <div className="mb-8 text-center space-y-4">
              <div>
                <div className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-2 font-bold">{t('nav.events.reg_status_label')}</div>
                <div className={`text-2xl font-display italic ${
                  event.status === "open" ? "text-emerald-600" : "text-muted/40"
                }`}>
                  {event.status === "open" ? t('nav.events.reg_status_open') : event.status === "closed" ? t('nav.events.reg_status_closed') : t('nav.events.reg_status_upcoming')}
                </div>
              </div>

              {event.registrationDeadline && (
                <div className="pt-4 border-t border-border/50">
                  <div className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-2 font-bold">{t('nav.events.registration_deadline_label')}</div>
                  <div className="text-xl font-mono text-accent">
                    {event.registrationDeadline}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="pt-4 border-t border-border/50 text-center">
                <div className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-1 font-bold">{t('nav.events.event_cost_label')}</div>
                <div className="text-3xl font-display italic text-foreground">{event.cost}</div>
              </div>

              <RegistrationCTA event={event} />
            </div>
          </div>

        </div>
      </div>

      {/* Independent Back to List Section */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <Link 
          href="/events/list"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted/40 hover:text-accent transition-colors uppercase tracking-widest group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> {t('nav.events.back_to_list')}
        </Link>
      </div>
    </main>
  );
}
