import React from "react";
import Navbar from "@/components/Navbar";
import { eventsData, difficultyLevels } from "@/data/events";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = eventsData.find((e) => e.id === params.id);

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
              <span className="px-4 py-1 rounded-full text-[10px] font-mono bg-white/20 backdrop-blur-md text-white uppercase tracking-[0.2em] border border-white/20">
                {event.cost}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-display italic text-white tracking-tight drop-shadow-2xl">
              {event.title}
            </h1>
            <div className="font-mono text-sm text-white/80 tracking-[0.3em] uppercase">{event.date}</div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-30 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-surface p-12 md:p-16 border border-border rounded-[3rem] shadow-xl">
            <div className="prose prose-stone max-w-none">
              <h2 className="text-3xl font-display italic mb-8 border-b border-border pb-6">活動詳情 Description</h2>
              <div className="space-y-6">
                {event.description.map((para, i) => (
                  <p key={i} className="text-xl font-serif text-muted leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {event.itinerary && (
              <div className="mt-16">
                <h3 className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-8 font-bold">Itinerary Schedule</h3>
                <div className="space-y-6">
                  {event.itinerary.map((item, i) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="font-mono text-sm text-muted/40 w-16 group-hover:text-accent transition-colors">{item.time}</div>
                      <div className="font-serif text-lg text-muted">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {event.requirements && (
              <div className="mt-16 p-8 bg-background border border-border rounded-2xl">
                <h3 className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-4 font-bold">Requirements</h3>
                <ul className="list-disc list-inside font-serif text-muted space-y-2">
                  {event.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <Link 
              href="/events/list"
              className="flex items-center gap-2 font-mono text-[10px] text-muted uppercase tracking-widest hover:text-accent transition-colors"
            >
              ← Back to List
            </Link>
            <div className="font-mono text-[10px] text-muted/40 uppercase tracking-widest">
              Event ID: {event.id}
            </div>
          </div>
        </div>

        {/* Sidebar / CTA */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface p-10 border border-border rounded-[3rem] shadow-lg sticky top-32">
            <div className="mb-8 text-center">
              <div className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mb-2 font-bold">Status</div>
              <div className={`text-2xl font-display italic ${
                event.status === "open" ? "text-emerald-600" : "text-muted/40"
              }`}>
                {event.status === "open" ? "開放報名中" : event.status === "closed" ? "報名已截止" : "即將開放"}
              </div>
            </div>

            <div className="space-y-4">
              {event.status === "open" && event.signupUrl ? (
                <a 
                  href={event.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-6 bg-accent text-white rounded-full font-mono text-center text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl shadow-accent/20"
                >
                  一鍵報名
                </a>
              ) : (
                <button 
                  disabled
                  className="block w-full py-6 bg-muted/10 text-muted/40 rounded-full font-mono text-center text-xs uppercase tracking-[0.3em] cursor-not-allowed"
                >
                  無法報名
                </button>
              )}
              
              <div className="p-6 border border-border/50 rounded-2xl text-center">
                <p className="text-[10px] font-mono text-muted/60 uppercase tracking-widest leading-relaxed">
                  如有任何疑問請聯繫<br />出隊負責人
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
