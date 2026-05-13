"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { rentalService } from "@/services/equipmentService";
import { useSession, signIn } from "next-auth/react";
import { userService } from "@/services/userService";
import { useEffect } from "react";


export default function RentalCartPage() {
  const { data: session, status } = useSession();
  const { state, dispatch } = useCart();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          setFormData(prev => ({
            ...prev,
            name: user.real_name || prev.name,
            phone: user.phone || prev.phone,
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

    try {
      const applicationData = {
        userId: (session?.user as any)?.lineUserId || "anonymous",
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
      setError(err.message || "提交失敗，請稍後再試。");
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
          <h1 className="text-4xl font-display italic mb-6">預約成功！</h1>
          <p className="text-xl font-serif text-muted mb-12 leading-relaxed">
            器材長已收到您的租借單。我們會在一日內透過 LINE 與您聯繫確認領取時間。
          </p>
          <Link 
            href="/equipment/browse"
            className="inline-block px-12 py-4 bg-accent text-white rounded-full font-mono text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-accent/20"
          >
            返回裝備瀏覽
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-6xl mx-auto">
        <section className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display italic mb-6 tracking-tight">我的租借單</h1>
          <p className="text-lg font-serif text-muted">確認裝備與租借資訊，完成後點擊提交。</p>
        </section>

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-3xl text-red-600 font-serif flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <span className="text-2xl">⚠️</span>
            {error}
          </div>
        )}

        {state.items.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-border rounded-[3rem]">
            <p className="font-serif text-muted italic mb-8">租借單目前是空的。</p>
            <Link 
              href="/equipment/browse"
              className="px-12 py-4 border border-accent text-accent rounded-full font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all"
            >
              去逛逛裝備
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Items List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-border bg-muted/5 font-mono text-[10px] text-muted uppercase tracking-widest font-bold">
                  Items Selected ({state.items.length})
                </div>
                <div className="divide-y divide-border">
                  {state.items.map((item) => (
                    <div key={item.id} className="p-8 flex items-center justify-between group">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-accent/5 rounded-2xl flex items-center justify-center text-2xl">
                          {item.category === "炊事系統" && "🍳"}
                          {item.category === "營帳系統" && "⛺"}
                          {item.category === "睡眠系統" && "🛌"}
                          {item.category === "行進裝備" && "🎒"}
                          {item.category === "技術裝備" && "⛏️"}
                        </div>
                        <div>
                          <h4 className="font-display italic text-lg">{item.name}</h4>
                          <span className="text-[10px] font-mono text-muted/60 uppercase tracking-widest">{item.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <div className="font-mono text-sm font-bold">x{item.quantity}</div>
                          <div className="text-[10px] font-mono text-muted/40 uppercase tracking-widest">
                            ${item.basePrice} Base
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
              <div className="p-8 border border-accent/20 bg-accent/5 rounded-[2.5rem] italic font-serif text-muted text-sm leading-relaxed">
                <span className="font-bold text-accent block mb-2 font-mono uppercase tracking-widest text-xs">Note:</span>
                領取裝備前請確認已清理乾淨。租借期滿一週內須歸還，損壞或遺失須負擔賠償責任。
              </div>
            </div>

            {/* Right: Order Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-5 bg-surface border border-border p-10 rounded-[3rem] shadow-xl space-y-8">
              <h3 className="text-2xl font-display italic border-b border-border pb-4">租借資訊 Form</h3>
              
              <div className="space-y-6">
                {/* Identity & Purpose */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">你的身份</label>
                    <select 
                      value={formData.identity}
                      onChange={(e) => setFormData({...formData, identity: e.target.value as any})}
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none appearance-none"
                    >
                      <option value="MEMBER">台科大登山社員</option>
                      <option value="NON_MEMBER">非社員</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">使用用途</label>
                    <select 
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value as any})}
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none appearance-none"
                    >
                      <option value="CLUB">參加社團活動</option>
                      <option value="PERSONAL">個人/私人行程</option>
                    </select>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">姓名 Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="請輸入姓名"
                    className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">手機 Phone</label>
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
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">LINE ID</label>
                    <input 
                      required
                      type="text"
                      value={formData.lineId}
                      onChange={(e) => setFormData({...formData, lineId: e.target.value})}
                      placeholder="用於聯繫領取"
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none"
                    />
                  </div>
                </div>



                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">領取日期</label>
                    <input 
                      required
                      type="date"
                      value={formData.borrowDate}
                      onChange={(e) => setFormData({...formData, borrowDate: e.target.value})}
                      className="w-full bg-background border border-border p-4 rounded-2xl font-serif text-sm focus:border-accent outline-none"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">歸還日期</label>
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
                    <span>Rental Duration</span>
                    <span>{days} Days</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-display italic text-xl">預估總計</span>
                    <div className="text-right">
                      <div className="text-4xl font-display italic text-accent font-bold">${pricing}</div>
                      <div className="text-[10px] font-mono text-muted uppercase tracking-widest">Taiwan Dollars</div>
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
                    登入 LINE 以預約租借
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-accent text-white rounded-full font-mono text-xs uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-xl shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "正在提交..." : "提交租借單 Submit"}
                  </button>
                )}
                
                {status === "unauthenticated" && (
                  <p className="text-[10px] font-serif text-muted text-center italic">
                    * 預約租借需登錄社員身分以核對資料。
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
