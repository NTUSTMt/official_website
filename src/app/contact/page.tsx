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
      
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-24">
          {platforms.map((p) => {
            const info = contactInfo?.[p.id];
            return (
              <div key={p.id} className="group bg-surface border border-border p-6 md:p-10 rounded-[2.5rem] hover:border-accent hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row items-center gap-10">
                {/* QR Code Section */}
                <div className="flex-shrink-0">
                  {info?.qrcode ? (
                    <div className="w-32 h-32 bg-white p-3 rounded-2xl shadow-inner border border-border group-hover:rotate-2 transition-transform duration-500">
                      <img src={info.qrcode} alt={`${p.label} QR Code`} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-background/50 rounded-2xl flex items-center justify-center border border-dashed border-border">
                      <span className="text-[10px] font-mono text-muted/30 uppercase tracking-widest">No QR Code</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h3 className="text-3xl font-display italic tracking-tight">{p.label}</h3>
                    <div className="h-px flex-1 bg-border/50 hidden md:block"></div>
                  </div>
                  <p className="text-base font-serif text-muted leading-relaxed mb-6 max-w-2xl">
                    {info?.description || "即時獲取社團資訊與聯繫。"}
                  </p>
                  
                  {info?.link && p.id !== 'email' && (
                    <a 
                      href={info.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex px-8 py-3 bg-white border border-border rounded-xl text-[10px] font-mono font-bold uppercase tracking-widest items-center gap-3 hover:bg-accent hover:text-white hover:border-accent transition-all shadow-sm"
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
        <section className="bg-surface border border-border rounded-[3rem] p-12 md:p-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-accent/10 transition-all duration-700"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="w-20 h-20 bg-accent text-white rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
              <MapPin className="w-10 h-10" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-display italic mb-4">社辦位置 <span className="text-muted/40 font-mono text-xs uppercase tracking-widest not-italic ml-2">Basecamp</span></h2>
              <div className="mb-4">
                <p className="text-xl font-serif text-foreground mb-1">
                  {contactInfo?.basecamp?.location || "國立臺灣科技大學 學生活動中心"}
                </p>
                {contactInfo?.basecamp?.detail && (
                  <p className="text-accent font-display font-bold italic text-lg tracking-tight">
                    {contactInfo.basecamp.detail}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted font-mono uppercase tracking-widest">
                Office hours: {contactInfo?.basecamp?.hours || "每週一至五 12:20 - 13:20 (學期期間)"}
              </p>
            </div>

            <div className="w-full md:w-auto">
              <a 
                href={contactInfo?.basecamp?.mapsLink || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-8 py-4 bg-foreground text-white rounded-2xl font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-accent transition-all flex items-center justify-center gap-3"
              >
                Google Maps <ExternalLink className="w-4 h-4" />
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
