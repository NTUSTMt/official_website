"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { historyService } from "@/services/cmsService";

export default function CommitteePage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const dbRoles = await historyService.getCommitteeRoles();
        setData(dbRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
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
      
      <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">

        {/* Individual Roles */}
        <div className="mb-24">
          <h2 className="text-sm font-mono text-accent font-bold uppercase tracking-[0.3em] mb-12 border-l-4 border-accent pl-4">幹部分工 (Roles)</h2>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data?.roles?.map((role: any, i: number) => (
              <div key={i} className="p-8 border border-border bg-surface hover:bg-white transition-all duration-300 rounded-3xl shadow-sm hover:shadow-md group">
                <h3 className="text-xl font-display italic text-foreground mb-4 group-hover:text-accent transition-colors">{role.title}</h3>
                <p className="font-serif text-muted leading-relaxed whitespace-pre-wrap">
                  {role.description}
                </p>
              </div>
            ))}
          </section>
        </div>

        {/* Common Responsibilities */}
        <div className="mb-24">
          <h2 className="text-sm font-mono text-accent font-bold uppercase tracking-[0.3em] mb-12 border-l-4 border-accent pl-4">幹部共同職責 (Shared Duties)</h2>
          <div className="bg-surface border border-border p-8 md:p-12 rounded-[2rem] shadow-sm">
            <ul className="space-y-6">
              {data?.commonResponsibilities?.map((item: string, i: number) => (
                <li key={i} className="flex gap-4 items-start group">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform"></span>
                  <p className="font-serif text-lg text-muted leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mountain Duties */}
        <div className="mb-24">
          <h2 className="text-sm font-mono text-emerald-600 font-bold uppercase tracking-[0.3em] mb-12 border-l-4 border-emerald-600 pl-4">上山後的工作 (Mountain Duties)</h2>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data?.mountainDuties?.map((duty: any, i: number) => (
              <div key={i} className="p-8 border border-border bg-background hover:bg-emerald-50/30 transition-all duration-300 rounded-3xl shadow-sm hover:shadow-md border-t-4 border-t-emerald-600/20">
                <h3 className="text-lg font-display italic text-emerald-700 mb-4">{duty.title}</h3>
                <p className="font-serif text-muted text-sm leading-relaxed whitespace-pre-wrap">
                  {duty.description}
                </p>
              </div>
            ))}
          </section>
        </div>

        <p className="mt-24 text-center font-mono text-[10px] text-muted/40 uppercase tracking-[0.2em]">
          NTUST Mountaineering Club · Organization & Responsibilities
        </p>
      </div>
    </main>
  );
}
