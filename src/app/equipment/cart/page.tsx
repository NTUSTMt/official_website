"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { rentalService } from "@/services/equipmentService";
import { useSession, signIn } from "next-auth/react";
import { userService } from "@/services/userService";
import { useEffect } from "react";
import { useTranslation } from "@/context/LanguageContext";



export default function RentalCartPage() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const { state, dispatch } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    lineId: "",
    identity: "MEMBER" as "MEMBER" | "NON_MEMBER",
    purpose: "CLUB" as "CLUB" | "PERSONAL",
    borrowDate: "",
    returnDate: "",
    notes: ""
  });

  // Auto-populate user data
  useEffect(() => {
    async function loadUserData() {
      if (status === "authenticated") {
        const user = await userService.getCurrentUser();
        if (user) {
          setUserProfile(user);
          setFormData(prev => ({
            ...prev,
            name: user.real_name || prev.name,
            phone: user.phone || prev.phone,
            lineId: user.line_id || prev.lineId,
            identity: (user.membership_status === "active" || user.membership_status === "alumni") ? "MEMBER" : "NON_MEMBER"
          }));
        }
      }
    }
    loadUserData();
  }, [status]);



  const days = useMemo(() => {
    if (!formData.borrowDate || !formData.returnDate) return 0;
    const start = new Date(formData.borrowDate);
    const end = new Date(formData.returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  }, [formData.borrowDate, formData.returnDate]);

  const pricing = useMemo(() => {
    let total = 0;
    state.items.forEach(item => {
      const base = item.basePrice || 0;
      const extra = item.pricePerDay || 0;
      
      let itemTotal = base;
      if (days > 2) {
        itemTotal += (days - 2) * extra;
      }
      total += itemTotal * item.quantity;
    });

    // Apply modifiers
    if (formData.purpose === "CLUB") return 0;
    if (formData.identity === "MEMBER" && formData.purpose === "PERSONAL") return Math.round(total * 0.5);
    return total;
  }, [state.items, days, formData.identity, formData.purpose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (new Date(formData.returnDate) <= new Date(formData.borrowDate)) {
      setError(t('nav.equipment.date_error'));
      setIsSubmitting(false);
      window.scrollTo(0, 0);
      return;
    }

    try {
      const applicationData = {
        userId: userProfile?.id || (session?.user as any)?.lineUserId || "anonymous",
        userName: formData.name,
        userType: formData.identity,
        isClubEvent: formData.purpose === "CLUB",
        items: state.items.map(item => ({
          equipmentId: item.id,
          name: item.name,
          qty: item.quantity
        })),
        startDate: formData.borrowDate,
        endDate: formData.returnDate,
        totalFee: pricing,
        notes: formData.notes
      };

      await rentalService.submitApplication(applicationData);
      
      setIsSubmitted(true);
      dispatch({ type: "CLEAR_CART" });
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.message || t('nav.equipment.submit_error'));
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isSubmitted) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="pt-48 pb-24 px-6 max-w-xl mx-auto text-center">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl">
            ✓
          </div>
          <h1 className="text-4xl font-display italic mb-6">{t('nav.equipment.success_title')}</h1>
          <p className="text-xl font-serif text-muted mb-12 leading-relaxed">
            {t('nav.equipment.success_desc')}
          </p>
          <Link 
            href="/equipment/browse"
            className="inline-block px-12 py-4 bg-accent text-white rounded-full font-mono text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/20"
          >
            {t('nav.equipment.return_to_browse')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      <div className="pt-24 px-6 max-w-6xl mx-auto">

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-3xl text-red-600 font-serif flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <span className="text-2xl">⚠️</span>
            {error}
          </div>
        )}

        {state.items.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-border rounded-[3rem]">
            <p className="font-serif text-muted italic mb-8">{t('nav.equipment.empty_cart')}</p>
            <Link 
              href="/equipment/browse"
              className="px-12 py-4 border border-accent text-accent rounded-full font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
            >
              {t('nav.equipment.go_browsing')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Items List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-border bg-muted/5 font-mono text-[10px] text-muted uppercase tracking-widest font-bold">
                  {t('nav.equipment.items_selected')} ({state.items.length})
                </div>
                <div className="divide-y divide-border">
                  {state.items.map((item) => (
                    <div key={item.id} className="p-5 md:p-8 flex items-center justify-between group gap-4">
                      <div className="flex items-center gap-3 md:gap-6 min-w-0 flex-1">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-accent/5 rounded-2xl flex items-center justify-center text-xl md:text-2xl">
                          {item.category === "炊事系統" && "🍳"}
                          {item.category === "營帳系統" && "⛺"}
                          {item.category === "睡眠系統" && "🛌"}
                          {item.category === "行進裝備" && "🎒"}
                          {item.category === "技術裝備" && "⛏️"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-display italic text-base md:text-lg truncate">{item.name}</h4>
                          <span className="text-[10px] font-mono text-muted/60 uppercase tracking-widest block truncate">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono text-sm font-bold">x{item.quantity}</div>
                          <div className="text-[9px] md:text-[10px] font-mono text-muted/40 uppercase tracking-widest leading-none">
                            ${item.basePrice} <span className="hidden sm:inline">BASE</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })}
                          className="text-muted/20 hover:text-red-500 transition-colors text-xl"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary of Rules */}
              <div className="p-8 border border-accent/20 bg-accent/5 rounded-[2.5rem] italic font-serif text-muted text-sm leading-relaxed mb-6">
                <span className="font-bold text-accent block mb-2 font-mono uppercase tracking-widest text-xs">Note:</span>
                {t('nav.equipment.rental_rules_desc')}
              </div>

              <div className="px-8 py-4 bg-muted/5 border border-border rounded-[2rem] text-sm font-serif text-muted italic flex items-center gap-3">
                {t('nav.equipment.form_subtitle')}
              </div>
            </div>

            {/* Right: Order Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-5 bg-surface border border-border p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl space-y-8">
              <h3 className="text-2xl font-display italic border-b border-border pb-4">{t('nav.equipment.form_title')}</h3>
              
              <div className="space-y-6">
                {/* Identity & Purpose */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">{t('nav.equipment.identity_label')}</label>
                    <select 
                      value={formData.identity}
                      onChange={(e) => setFormData({...formData, identity: e.target.value as any})}
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none appearance-none"
                    >
                      <option value="MEMBER">{t('nav.equipment.identity_member')}</option>
                      <option value="NON_MEMBER">{t('nav.equipment.identity_non_member')}</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">{t('nav.equipment.purpose_label')}</label>
                    <select 
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value as any})}
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none appearance-none"
                    >
                      <option value="CLUB">{t('nav.equipment.purpose_club')}</option>
                      <option value="PERSONAL">{t('nav.equipment.purpose_personal')}</option>
                    </select>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">{t('nav.equipment.name_label')}</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder={t('nav.equipment.name_placeholder')}
                    className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">{t('nav.equipment.phone_label')}</label>
                    <input 
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="0912..."
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">{t('nav.equipment.line_id_label')}</label>
                    <input 
                      required
                      type="text"
                      value={formData.lineId}
                      onChange={(e) => setFormData({...formData, lineId: e.target.value})}
                      placeholder={t('nav.equipment.line_placeholder')}
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none"
                    />
                  </div>
                </div>



                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">{t('nav.equipment.borrow_date_label')}</label>
                    <input 
                      required
                      type="date"
                      value={formData.borrowDate}
                      onChange={(e) => setFormData({...formData, borrowDate: e.target.value})}
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">{t('nav.equipment.return_date_label')}</label>
                    <input 
                      required
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({...formData, returnDate: e.target.value})}
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none"
                    />
                  </div>
                </div>

                {/* Pricing Summary */}
                <div className="p-8 bg-muted/5 border border-border rounded-3xl space-y-4">
                  <div className="flex justify-between items-center text-xs font-mono text-muted/60 uppercase tracking-widest">
                    <span>{t('nav.equipment.rental_duration')}</span>
                    <span>{days} {t('nav.equipment.days_unit')}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-display italic text-xl">{t('nav.equipment.estimated_total')}</span>
                    <div className="text-right">
                      <div className="text-4xl font-display italic text-accent font-bold">${pricing}</div>
                      <div className="text-[10px] font-mono text-muted uppercase tracking-widest">{t('nav.equipment.currency_unit')}</div>
                    </div>
                  </div>
                </div>

                {status === "unauthenticated" ? (
                  <button 
                    type="button"
                    onClick={() => signIn("line")}
                    className="w-full py-6 bg-emerald-500 text-white rounded-full font-mono text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3"
                  >
                    <span className="text-xl">💬</span>
                    {t('nav.equipment.login_to_rent')}
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-accent text-white rounded-full font-mono text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t('nav.equipment.submitting') : t('nav.equipment.submit_button')}
                  </button>
                )}
                
                {status === "unauthenticated" && (
                  <p className="text-[10px] font-serif text-muted text-center italic">
                    {t('nav.equipment.login_required_desc')}
                  </p>
                )}

              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
