"use client";

import React, { useState, useEffect } from "react";
import { EventItem } from "@/data/events";
import { userService, UserProfile } from "@/services/userService";
import { registrationService } from "@/services/eventService";
import RegistrationModal from "./RegistrationModal";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface RegistrationCTAProps {
  event: EventItem;
}

import { useSession, signIn } from "next-auth/react";
import { useTranslation } from "@/context/LanguageContext";

export default function RegistrationCTA({ event }: RegistrationCTAProps) {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    async function loadStatus() {
      if (status === "loading") return;
      
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const reg = await registrationService.getMyRegistration(event.id, currentUser.id);
        setRegistration(reg);
      }
      setIsLoading(false);
    }
    loadStatus();
  }, [event.id, status]);


  if (isLoading) {
    return (
      <div className="w-full py-6 bg-muted/10 rounded-full animate-pulse flex items-center justify-center">
        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "unauthenticated" || !user) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => signIn("line")}
          className="w-full py-6 bg-emerald-500 text-white rounded-full font-mono text-center text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
        >
          <span className="text-xl">💬</span>
          {t('nav.events.login_to_register')}
        </button>
        <p className="text-[9px] font-mono text-muted/60 uppercase tracking-widest text-center">
          {t('nav.events.login_required_desc')}
        </p>
      </div>
    );
  }


  if (registration) {
    return (
      <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-display italic text-lg">{t('nav.events.already_registered')}</span>
        </div>
        <div className="space-y-2">
          <div className="text-[10px] font-mono text-muted uppercase tracking-widest">
            {t('nav.events.reg_status_label')}：{
              registration.status === 'pending' ? t('nav.events.pending') : 
              registration.status === 'confirmed' ? t('nav.events.confirmed') : 
              t('nav.events.waitlist')
            }
          </div>
          <div className="text-[10px] font-mono text-muted uppercase tracking-widest">
            {t('nav.events.payment_status_label')}：{
              registration.payment_status === 'unpaid' ? t('nav.events.unpaid') : 
              t('nav.events.paid')
            }
          </div>
        </div>
      </div>
    );
  }

  const isClosed = event.status !== "open";

  return (
    <>
      <div className="space-y-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={isClosed}
          className={`block w-full py-6 rounded-full font-mono text-center text-xs uppercase tracking-[0.3em] transition-all shadow-xl ${
            isClosed 
              ? "bg-muted/10 text-muted/40 cursor-not-allowed shadow-none" 
              : "bg-accent text-white hover:brightness-110 shadow-accent/20"
          }`}
        >
          {isClosed ? t('nav.events.reg_status_closed') : t('nav.events.register_now')}
        </button>
        

      </div>

      {isModalOpen && (
        <RegistrationModal 
          event={event}
          user={user}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            // Re-fetch registration status
            registrationService.getMyRegistration(event.id, user.id).then(setRegistration);
          }}
        />
      )}
    </>
  );
}
