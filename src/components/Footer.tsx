"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Camera, 
  Share2, 
  Mail, 
  MapPin, 
  MessageCircle, 
  ChevronRight
} from "lucide-react";
import { cmsService } from "@/services/cmsService";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    async function fetchConfig() {
      const data = await cmsService.getFooterConfig();
      setConfig(data);
    }
    fetchConfig();
  }, []);

  if (!config) return null;

  return (
    <footer className="relative bg-surface text-stone-600 py-20 px-6 overflow-hidden border-t border-stone-200">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Slogan */}
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl font-display italic tracking-tighter text-stone-900 flex items-center gap-2">
                {config.siteName}
              </h2>
              <p className="text-sm font-serif leading-relaxed max-w-xs text-stone-500 italic whitespace-pre-wrap">
                {config.slogan}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <SocialLink href={config.instagram} icon={<Camera size={18} />} label="Instagram" />
              <SocialLink href={config.facebook} icon={<Share2 size={18} />} label="Facebook" />
              <SocialLink href={config.line} icon={<MessageCircle size={18} />} label="LINE" />
              <SocialLink href={`mailto:${config.email}`} icon={<Mail size={18} />} label="Email" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-stone-400">
              快速導覽 Navigation
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <FooterLink href="/about/introduction">關於山社</FooterLink>
              <FooterLink href="/events">活動列表</FooterLink>
              <FooterLink href="/equipment/browse">裝備瀏覽</FooterLink>
              <FooterLink href="/events/gallery">歷史花絮</FooterLink>
              <FooterLink href="/contact">聯絡我們</FooterLink>
            </ul>
          </div>

          {/* Member Area */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-stone-400">
              社員專區 Members
            </h3>
            <ul className="space-y-3 text-sm font-medium">
              <FooterLink href="/rules/membership">我想成為社員!</FooterLink>
              <FooterLink href="/profile">我的足跡</FooterLink>
              <FooterLink href="/profile/peaks">山岳足跡</FooterLink>
              <FooterLink href="/rules/equipment">租借規則與費用</FooterLink>
              <FooterLink href="/admin">管理後台</FooterLink>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-stone-400">
              社辦基地 Basecamp
            </h3>
            <div className="space-y-5 text-sm leading-relaxed">
              <div className="flex gap-3 group">
                <MapPin size={18} className="text-accent shrink-0 group-hover:scale-110 transition-transform" />
                <address className="not-italic text-stone-700 whitespace-pre-wrap">
                  {config.address}<br />
                  <span className="text-stone-400 text-xs font-mono">{config.basecampDetail}</span>
                </address>
              </div>
              <div className="pt-2 border-l-2 border-stone-100 pl-4">
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-1">對外開放時間</p>
                <p className="text-stone-600 font-medium">{config.officeHours}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px w-full bg-stone-200/60 mb-10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono tracking-widest text-stone-400 uppercase">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2">
            <span className="text-stone-500 font-bold">© {currentYear} {config.copyright}</span>
            <Link href="/rules/constitution" className="hover:text-accent transition-colors">組織章程</Link>
            <Link href="#" className="hover:text-accent transition-colors">隱私權條款</Link>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <span>Made with</span>
            <span className="text-accent animate-pulse">❤️</span>
            <span>by <span className="text-stone-600 group-hover:text-accent transition-colors font-bold">{config.credits}</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="group flex items-center gap-1 hover:text-accent transition-all duration-300"
      >
        <ChevronRight size={12} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent" />
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-900 border border-stone-800 text-stone-500 hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-300 group"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
