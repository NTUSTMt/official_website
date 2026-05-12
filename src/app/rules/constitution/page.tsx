"use client";

import React, { useState, useEffect } from "react";
import RulesLayout from "@/components/RulesLayout";
import { ruleService } from "@/services/ruleService";
import { rulesData, RuleCategory } from "@/data/rules";

export default function ConstitutionPage() {
  const [data, setData] = useState<RuleCategory>(rulesData.constitution);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await ruleService.getRuleCategory("constitution");
        setData(result);
      } catch (err) {
        console.error("Failed to load constitution:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const googleDocsUrl = data.sections[0]?.content[0] || "";
  // Try to generate a view URL (strip pub-specific params if it's a pub link)
  const viewUrl = googleDocsUrl.replace('/pub?embedded=true', '/edit').replace('/pub', '/view');

  if (isLoading) {
    return (
      <RulesLayout>
        <div className="flex items-center justify-center h-64 font-mono text-xs animate-pulse">
          FETCHING_CONSTITUTION...
        </div>
      </RulesLayout>
    );
  }

  return (
    <RulesLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display italic mb-6">{data.title}</h1>
          <p className="text-lg font-serif text-muted leading-relaxed">
            {data.description}
          </p>
          <div className="h-px w-full bg-border mt-12"></div>
        </header>

        <div className="flex-1 min-h-[800px] bg-white rounded-2xl overflow-hidden border border-border shadow-inner">
          {googleDocsUrl ? (
            <iframe 
              src={googleDocsUrl.includes('?') ? `${googleDocsUrl}&embedded=true` : `${googleDocsUrl}?embedded=true`}
              className="w-full h-full border-none"
              title="社團組織章程"
            >
              載入中...
            </iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted font-serif">
              <p>尚未設定章程連結</p>
            </div>
          )}
        </div>

        <footer className="mt-12 pt-8 border-t border-border flex justify-between items-center">
          <p className="text-xs font-mono text-muted/40 uppercase tracking-[0.2em]">
            Real-time Update via Google Docs
          </p>
          {googleDocsUrl && (
            <a 
              href={googleDocsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-mono text-accent hover:underline uppercase tracking-widest"
            >
              Open in New Tab
            </a>
          )}
        </footer>
      </div>
    </RulesLayout>
  );
}
