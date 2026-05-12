"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { introductionContent as defaultContent } from "@/data/history";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function IntroductionPage() {
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      if (!isSupabaseConfigured) {
        setIsLoading(false);
        return;
      }
      const { data } = await supabase
        .from("cms_config")
        .select("content")
        .eq("id", "about_intro")
        .single();
      if (data?.content) {
        setContent(data.content as any);
      }
      setIsLoading(false);
    }
    fetchContent();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <section className={`mb-20 transition-opacity duration-700 ${isLoading ? "opacity-50" : "opacity-100"}`}>
          <h1 className="text-5xl md:text-7xl font-display italic mb-6 tracking-tight">
            社團特色 <span className="text-muted/20">Intro</span>
          </h1>
          <div className="h-1 w-24 bg-accent mb-12"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="prose prose-lg font-serif text-muted leading-relaxed">
              <p className="text-2xl text-foreground font-medium mb-6">
                {content.quote}
              </p>
              {content.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            
            <div className="bg-surface p-10 border border-border space-y-8 rounded-3xl shadow-sm">
              <div>
                <h3 className="text-xl font-display italic text-accent mb-4">核心理念 Core Values</h3>
                <ul className="space-y-3 font-mono text-sm uppercase tracking-wider">
                  {content.coreValues.map((v, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <p className="mt-16 text-center font-mono text-[10px] text-muted/40 uppercase tracking-[0.2em]">
          NTUST Mountaineering Club · Spirit and Tradition
        </p>
      </div>
    </main>
  );
}
