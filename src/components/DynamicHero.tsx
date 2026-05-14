"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/config/navigation";

const HERO_IMAGES: Record<string, string> = {
  "": "/images/hero-bg-0.jpg",
  "about": "/images/hero-bg-1.jpg",
  "events": "/images/hero-bg-2.jpg",
  "equipment": "/images/hero-bg-3.jpg",
  "rules": "/images/hero-bg-4.jpg",
  "profile": "/images/hero-bg-5.jpg",
  "contact": "/images/hero-bg-6.jpg",
};

// Allow fine-tuning of background position for each category
const HERO_POSITIONS: Record<string, string> = {
  "": "center",
  "about": "center 33%", // Move image down slightly to show more of the top/sky or focal point
  "events": "center",
  "equipment": "center 5%",
  "rules": "center 35%",
  "profile": "center",
  "contact": "center 45%",
};
 
export default function DynamicHero() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const rootPath = segments[0] || "";
  
  // Don't show on admin pages
  if (rootPath === "admin") return null;

  const bgImage = HERO_IMAGES[rootPath] || HERO_IMAGES[""];
  const bgPosition = HERO_POSITIONS[rootPath] || "center";
  const isHome = rootPath === "";
  
  // Don't show on activity detail pages (they have their own local hero)
  const isEventDetail = rootPath === "events" && segments.length === 2 && !["list", "gallery", "calendar", "levels"].includes(segments[1]);
  if (isEventDetail) return null;
  
  // Find current nav item label for sub-page title
  const currentNavItem = navigationConfig.reduce((acc: any, item) => {
    if (item.href === pathname) return item;
    if (item.subItems) {
      const sub = item.subItems.find(s => s.href === pathname);
      if (sub) return sub;
    }
    // Fallback to root path match if no exact match
    if (item.href === `/${rootPath}`) return item;
    return acc;
  }, null);

  const pageTitle = currentNavItem?.label || "";
  const subtitle = currentNavItem?.subtitle || "";
  const description = currentNavItem?.description || "";

  return (
    <div 
      className={`relative w-full overflow-hidden transition-all duration-1000 ease-in-out z-0 ${
        isHome ? "h-screen" : "h-[45vh] md:h-[60vh]"
      }`}
    >
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url('${bgImage}')`,
          backgroundPosition: bgPosition,
          backgroundAttachment: "scroll",
        }}
      />
      
      {/* Dynamic Title Overlay for Sub-pages */}
      {!isHome && pageTitle && rootPath !== "admin" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-6">
          <div className="max-w-5xl text-center space-y-6">
            <h1 className="flex flex-col md:flex-row items-center justify-center gap-x-6 gap-y-2 hero-text-shadow">
              <span className="text-4xl md:text-7xl font-display italic text-white uppercase tracking-tighter leading-tight">
                {pageTitle}
              </span>
              {subtitle && (
                <span className="text-2xl md:text-5xl font-display italic text-white/60 uppercase tracking-tighter leading-tight">
                  {subtitle}
                </span>
              )}
            </h1>
            
            {description && (
              <div className="pt-2">
                <p className="text-white/90 font-serif italic text-sm md:text-lg max-w-2xl mx-auto leading-relaxed hero-text-shadow">
                  {description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
