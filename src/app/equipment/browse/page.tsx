"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { equipmentData, EquipmentCategory } from "@/data/equipment";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";

const CATEGORIES: (EquipmentCategory | "全部")[] = ["全部", "炊事系統", "營帳系統", "睡眠系統", "行進裝備", "技術裝備"];

export default function EquipmentBrowsePage() {
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory | "全部">("全部");
  const { state, dispatch } = useCart();

  const filteredItems = activeCategory === "全部" 
    ? equipmentData 
    : equipmentData.filter(item => item.category === activeCategory);

  const cartTotalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (item: any) => {
    dispatch({ 
      type: "ADD_ITEM", 
      item: { 
        id: item.id, 
        name: item.name, 
        category: item.category, 
        quantity: 1,
        basePrice: item.pricing?.base2Days,
        pricePerDay: item.pricing?.perExtraDay
      } 
    });
  };

  const getItemQty = (id: string) => {
    return state.items.find(i => i.id === id)?.quantity || 0;
  };

  const updateQty = (id: string, delta: number) => {
    const current = getItemQty(id);
    if (current + delta <= 0) {
      dispatch({ type: "REMOVE_ITEM", id });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", id, quantity: current + delta });
    }
  };

  return (
    <main className="min-h-screen bg-background pb-32">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <section className="mb-12">
          <h1 className="text-5xl md:text-6xl font-display italic mb-8 tracking-tight">裝備瀏覽</h1>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {CATEGORIES.map(cat => (cat !== undefined && (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all ${
                  activeCategory === cat 
                    ? "bg-accent text-white shadow-lg shadow-accent/20" 
                    : "bg-surface text-muted border border-border hover:border-accent"
                }`}
              >
                {cat}
              </button>
            )))}
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredItems.map((item) => {
            const qty = getItemQty(item.id);
            return (
              <div 
                key={item.id}
                className="group bg-surface border border-border rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* 1. Image Area */}
                <div className="aspect-square bg-muted/10 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                  
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="text-muted/20 text-6xl group-hover:scale-110 transition-transform duration-700">
                      {item.category === "炊事系統" && "🍳"}
                      {item.category === "營帳系統" && "⛺"}
                      {item.category === "睡眠系統" && "🛌"}
                      {item.category === "行進裝備" && "🎒"}
                      {item.category === "技術裝備" && "⛏️"}
                    </div>
                  )}

                  {item.isMemberOnly && (
                    <div className="absolute top-6 left-6 bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest font-bold z-20">
                      🔒 社員限定
                    </div>
                  )}
                </div>

                {/* Content Container */}
                <div className="p-8 flex flex-1 flex-col">
                  {/* 2. System & Remaining Qty */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-mono text-[10px] text-accent uppercase tracking-widest font-bold">{item.category}</div>
                    <div className="font-mono text-xs text-muted uppercase tracking-widest">
                      剩餘: <span className="text-foreground font-bold">{item.availableQty}</span>
                    </div>
                  </div>

                  {/* 3. Name */}
                  <h3 className="text-xl font-display italic mb-2">{item.name}</h3>

                  {/* 4. Note (Details) */}
                  <p className="text-sm font-serif text-muted/60 mb-6 line-clamp-2 min-h-[2.5rem]">
                    {item.details || "專業登山裝備，提供完善防護與便利性。"}
                  </p>

                  <div className="mt-auto">
                    {/* 5. Pricing (Base & Extra) */}
                    <div className="flex justify-between items-end mb-6 p-4 bg-background/50 border border-border/50 rounded-2xl">
                      <div className="font-mono">
                        <div className="text-[8px] text-muted/40 uppercase tracking-widest mb-1">Base (2D)</div>
                        <div className="text-sm font-bold text-accent">${item.pricing?.base2Days || 0}</div>
                      </div>
                      <div className="w-px h-6 bg-border/50"></div>
                      <div className="font-mono text-right">
                        <div className="text-[8px] text-muted/40 uppercase tracking-widest mb-1">Extra / Day</div>
                        <div className="text-sm font-bold">${item.pricing?.perExtraDay || 0}</div>
                      </div>
                    </div>

                    {qty > 0 ? (
                      <div className="flex items-center justify-between bg-accent text-white rounded-full p-1">
                        <button 
                          onClick={() => updateQty(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors font-bold"
                        >
                          -
                        </button>
                        <span className="font-mono font-bold">{qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, 1)}
                          disabled={qty >= item.availableQty}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors font-bold disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="w-full py-4 bg-accent text-white rounded-full font-mono text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg shadow-accent/20"
                      >
                        加入租借單
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Checkout Bar */}
        {cartTotalItems > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50">
            <div className="bg-surface/80 backdrop-blur-xl border border-accent/30 p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between">
              <div className="flex items-center gap-6 px-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-lg">
                    🛒
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-surface">
                    {cartTotalItems}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold">My Rental Cart</div>
                  <div className="text-sm font-serif italic text-muted">已選擇 {state.items.length} 類裝備</div>
                </div>
              </div>
              
              <Link 
                href="/equipment/cart"
                className="px-10 py-4 bg-accent text-white rounded-full font-mono text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg"
              >
                前往預約 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
