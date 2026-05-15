"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { equipmentData, EquipmentCategory, EquipmentItem } from "@/data/equipment";
import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { equipmentService } from "@/services/equipmentService";
import { useTranslation } from "@/context/LanguageContext";


export default function EquipmentBrowsePage() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [categories, setCategories] = useState<{name: string, emoji: string}[]>([]);
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { state, dispatch } = useCart();

  useEffect(() => {
    async function loadData() {
      const [dbItems, dbCategories] = await Promise.all([
        equipmentService.getAllEquipment(),
        equipmentService.getCategories()
      ]);
      setItems(dbItems.length > 0 ? dbItems : equipmentData);
      setCategories(dbCategories);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredItems = activeCategory === "全部" 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const cartTotalItems = state.items.reduce((acc, item) => acc + item.quantity, 0);

  const handleAddToCart = (item: any) => {
    if (item.availableQty <= 0) return;
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
    const item = items.find(i => i.id === id);
    
    if (delta > 0 && item && current >= item.availableQty) return;

    if (current + delta <= 0) {
      dispatch({ type: "REMOVE_ITEM", id });
    } else {
      dispatch({ type: "UPDATE_QUANTITY", id, quantity: current + delta });
    }
  };


  return (
    <main className="min-h-screen bg-background pb-32">
      <Navbar />
      
      <div className="pt-24 px-6 max-w-7xl mx-auto">
        <section className="mb-6">
          
          {/* Category Filter */}
          <div className="overflow-x-auto no-scrollbar -mx-6 mb-6">
            <div className="flex md:flex-wrap gap-3 px-8 md:px-6 py-2">
              {["全部", ...categories].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full font-mono text-[10px] uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? "bg-accent text-white shadow-lg shadow-accent/20 scale-105" 
                      : "bg-surface text-muted border border-border hover:border-accent"
                  }`}
                >
                  {cat === "全部" ? t('nav.equipment.category_all') : cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="py-32 text-center font-mono animate-pulse text-muted uppercase tracking-widest">
            Loading_Equipment...
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
            {filteredItems.map((item) => {
              const qty = getItemQty(item.id);
              const isOutOfStock = item.availableQty <= 0;
              
              return (
                <div 
                  key={item.id}
                  className={`group bg-surface border border-border rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 ${isOutOfStock ? "opacity-75 grayscale-[0.5]" : ""}`}
                >
                  {/* 1. Image Area */}
                  <div className="aspect-square bg-muted/10 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                    
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                    <div className="text-muted/20 text-4xl md:text-6xl group-hover:scale-110 transition-transform duration-700">
                        <span className="block scale-150">
                          {categories.find(c => c.name === item.category)?.emoji || "📦"}
                        </span>
                    </div>
                    )}

                    {item.isMemberOnly && (
                      <div className="absolute top-3 left-3 md:top-6 md:left-6 bg-red-500/10 border border-red-500/20 text-red-600 text-[8px] md:text-[10px] font-mono px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-widest font-bold z-20">
                        {t('nav.equipment.member_only')}
                      </div>
                    )}
                    
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-30">
                        <div className="bg-white/90 px-4 md:px-6 py-1 md:py-2 rounded-full font-display italic text-red-600 text-[10px] md:text-sm shadow-xl text-center">
                          {t('nav.equipment.out_of_stock')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Container */}
                  <div className="p-4 md:p-8 flex flex-1 flex-col">
                    {/* 2. System & Remaining Qty */}
                    <div className="flex justify-between items-center mb-1 md:mb-2">
                      <div className="font-mono text-[8px] md:text-[10px] text-accent uppercase tracking-widest font-bold">
                        {item.category}
                      </div>
                      <div className="font-mono text-muted uppercase tracking-widest flex items-baseline gap-0.5">
                        <span className={`font-bold text-xs md:text-sm ${isOutOfStock ? "text-red-500" : "text-foreground"}`}>{item.availableQty}</span>
                        <span className="opacity-40 text-[8px] md:text-[10px]">/{item.quantity}</span>
                      </div>
                    </div>

                    {/* 3. Name */}
                    <h3 className="text-base md:text-xl font-display italic mb-1 md:mb-2 line-clamp-1">{item.name}</h3>

                    {/* 4. Note (Details) */}
                    <p className="text-[11px] md:text-sm font-serif text-muted/60 mb-4 md:mb-6 line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] leading-relaxed break-words">
                      {item.details || t('nav.equipment.default_details')}
                    </p>

                    <div className="mt-auto">
                      {/* 5. Pricing (Base & Extra) */}
                      <div className="flex justify-between items-end mb-4 md:mb-6 p-2 md:p-4 bg-background/50 border border-border/50 rounded-xl md:rounded-2xl">
                        <div className="font-mono">
                          <div className="text-[7px] md:text-[8px] text-muted/40 uppercase tracking-widest mb-0.5 md:mb-1">Base</div>
                          <div className="text-xs md:text-sm font-bold text-accent">${item.pricing?.base2Days || 0}</div>
                        </div>
                        <div className="w-px h-4 md:h-6 bg-border/50"></div>
                        <div className="font-mono text-right">
                          <div className="text-[7px] md:text-[8px] text-muted/40 uppercase tracking-widest mb-0.5 md:mb-1">Extra</div>
                          <div className="text-xs md:text-sm font-bold">${item.pricing?.perExtraDay || 0}</div>
                        </div>
                      </div>

                      {qty > 0 ? (
                        <div className="flex items-center justify-between bg-accent text-white rounded-full h-10 md:h-14 p-1">
                          <button 
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors font-bold text-sm md:text-lg"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-sm md:text-base">{qty}</span>
                          <button 
                            onClick={() => updateQty(item.id, 1)}
                            disabled={qty >= item.availableQty}
                            className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors font-bold text-sm md:text-lg disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleAddToCart(item)}
                          disabled={isOutOfStock}
                          className="w-full h-10 md:h-14 bg-accent text-white rounded-full font-mono text-[10px] md:text-sm uppercase tracking-wide hover:brightness-110 transition-all shadow-lg shadow-accent/20 disabled:bg-muted/20 disabled:text-muted disabled:shadow-none disabled:cursor-not-allowed"
                        >
                          {isOutOfStock ? t('nav.equipment.out_of_stock') : t('nav.equipment.add_to_cart')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sticky Checkout Bar */}
        {cartTotalItems > 0 && (
          <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-50 px-safe">
            <div className="bg-surface/80 backdrop-blur-xl border border-accent/30 p-3 md:p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between gap-2 md:gap-6">
              <div className="flex items-center gap-3 md:gap-6 px-2 md:px-4 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-lg text-lg md:text-xl">
                    🛒
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white text-[9px] md:text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-surface">
                    {cartTotalItems}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm md:text-lg font-serif italic text-muted whitespace-nowrap overflow-hidden text-ellipsis">{t('nav.equipment.selected_types', { count: state.items.length })}</div>
                </div>
              </div>
              
              <Link 
                href="/equipment/cart"
                className="flex-shrink-0 px-6 md:px-10 py-3 md:py-4 bg-accent text-white rounded-full font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-lg whitespace-nowrap"
              >
                {t('nav.equipment.checkout_button')} <span className="hidden sm:inline">→</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
