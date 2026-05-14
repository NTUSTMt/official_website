"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { cmsService } from "@/services/cmsService";
import { isSupabaseConfigured } from "@/lib/supabase";
import { MapPin, ExternalLink } from "lucide-react";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContact() {
      try {
        const data = await cmsService.getContactInfo();
        setContactInfo(data);
      } catch (err) {
        console.error("Failed to fetch contact info:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchContact();
  }, []);

  const platforms = [
    { id: 'line', label: 'LINE' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'email', label: 'Email' },
  ];

  return (
    <main className="min-h-screen bg-white pb-32">
      <Navbar />
      
      <div className="pt-24 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col gap-8 mb-24">
          {platforms.map((p) => {
            const info = contactInfo?.[p.id];
            return (
              <div key={p.id} className="group bg-surface border border-border p-8 md:p-12 rounded-[2.5rem] hover:border-accent hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row items-center text-center md:text-left gap-8 md:gap-16">
                {/* QR Code Section */}
                <div className="flex-shrink-0">
                  {info?.qrcode ? (
                    <div className="w-48 h-48 md:w-56 md:h-56 bg-white p-4 rounded-3xl shadow-inner border border-border group-hover:scale-105 transition-transform duration-500">
                      <img src={info.qrcode} alt={`${p.label} QR Code`} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-48 h-48 md:w-56 md:h-56 bg-background/50 rounded-3xl flex items-center justify-center border border-dashed border-border">
                      <span className="text-[10px] font-mono text-muted/30 uppercase tracking-widest">No QR Code</span>
                    </div>
                  )}
                </div>
 
                {/* Content Section */}
                <div className="flex-1">
                  <h3 className="text-4xl font-display italic tracking-tight mb-4">{p.label}</h3>
                  <p className="text-base font-serif text-muted leading-relaxed mb-8 max-w-lg mx-auto md:mx-0 whitespace-pre-wrap">
                    {info?.description || "即時獲取社團資訊與聯繫。"}
                  </p>
                  
                  {info?.link && p.id !== 'email' && (
                    <a 
                      href={info.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex px-10 py-4 bg-white border border-border rounded-2xl text-[10px] font-mono font-bold uppercase tracking-widest items-center gap-3 hover:bg-accent hover:text-white hover:border-accent transition-all shadow-sm"
                    >
                      前往連結 <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Physical Location Section */}
        <section className="bg-surface border border-border rounded-[3rem] p-10 md:p-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-accent/10 transition-all duration-700"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            {/* Left: Icon & Title */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 group-hover:rotate-6 transition-transform duration-500">
                <MapPin className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-display italic mb-1">社辦位置</h2>
                <span className="text-muted/40 font-mono text-[10px] uppercase tracking-[0.3em]">Basecamp</span>
              </div>
            </div>
            
            {/* Middle: Details with Vertical Divider on Desktop */}
            <div className="flex-1 max-w-xl md:border-l md:border-border md:pl-12">
              <div className="space-y-6">
                <div>
                  <p className="text-base font-serif text-muted mb-1">
                    {contactInfo?.basecamp?.location || "國立臺灣科技大學 學生活動中心"}
                  </p>
                  {contactInfo?.basecamp?.detail && (
                    <p className="text-2xl font-display font-bold italic text-accent tracking-tight">
                      {contactInfo.basecamp.detail}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center md:justify-start gap-4">
                  <p className="text-[10px] text-muted font-mono uppercase tracking-[0.2em] whitespace-nowrap">
                    Office Hours:
                  </p>
                  <p className="text-sm font-serif text-foreground/80 italic">
                    {contactInfo?.basecamp?.hours || "每週一至五 12:20 - 13:20 (學期期間)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Action Button */}
            <div className="w-full md:w-auto">
              <a 
                href={contactInfo?.basecamp?.mapsLink || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-10 py-4 bg-foreground text-white rounded-2xl font-mono text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-accent transition-all flex items-center justify-center gap-3 shadow-xl shadow-foreground/10"
              >
                Google Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* Map Embed Section */}
        {contactInfo?.basecamp?.mapEmbed && (
          <section className="mt-12 rounded-[3rem] overflow-hidden border border-border h-[400px] md:h-[600px] shadow-2xl relative group">
            <div 
              className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full border-none"
              dangerouslySetInnerHTML={{ __html: contactInfo.basecamp.mapEmbed }}
            />
            <div className="absolute inset-0 pointer-events-none border-[12px] border-surface/50 rounded-[3rem]"></div>
          </section>
        )}
      </div>
    </main>
  );
}
