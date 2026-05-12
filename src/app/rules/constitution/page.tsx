"use client";

import React from "react";
import RulesLayout from "@/components/RulesLayout";

export default function ConstitutionPage() {
  // Actual Google Docs ID: 1pBUU3YvKacbfOvrYDhft_vjRU_TVqIQWskwM6Kx7VBA
  const docId = "1pBUU3YvKacbfOvrYDhft_vjRU_TVqIQWskwM6Kx7VBA";
  const googleDocsUrl = `https://docs.google.com/document/d/${docId}/pub?embedded=true`;
  const viewUrl = `https://docs.google.com/document/d/${docId}/edit?usp=sharing`;

  return (
    <RulesLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display italic mb-6">社團組織章程</h1>
          <p className="text-lg font-serif text-muted leading-relaxed">
            本社團之組織、運作及職權劃分，均依照本章程辦理。
          </p>
          <div className="h-px w-full bg-border mt-12"></div>
        </header>

        <div className="flex-1 min-h-[800px] bg-white rounded-2xl overflow-hidden border border-border">
          {/* 
            Google Docs Embed. 
            Note: The URL should be the "Publish to web" -> "Embed" link.
          */}
          <iframe 
            src={googleDocsUrl}
            className="w-full h-full border-none"
            title="社團組織章程"
          >
            載入中...
          </iframe>
        </div>

        <footer className="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <p className="text-xs font-mono text-muted/40 uppercase tracking-[0.2em]">
            Real-time Update via Google Docs
          </p>
          <a 
            href={viewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-mono text-accent hover:underline uppercase tracking-widest"
          >
            Open in New Tab
          </a>
        </footer>
      </div>
    </RulesLayout>
  );
}
