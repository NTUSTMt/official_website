"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { equipmentData, EquipmentItem, EquipmentCategory } from "@/data/equipment";
import { equipmentService, rentalService } from "@/services/equipmentService";

type Tab = "INVENTORY" | "RENTALS";

export default function AdminEquipmentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("INVENTORY");
  const [inventory, setInventory] = useState<EquipmentItem[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

  // Load data from DB
  useEffect(() => {
    async function loadData() {
      try {
        const dbEquipment = await equipmentService.getAllEquipment();
        setInventory(dbEquipment.length > 0 ? dbEquipment : equipmentData);
        
        const dbRentals = await rentalService.getAllApplications();
        setRentals(dbRentals);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const item: Partial<EquipmentItem> = {
      id: editingItem?.id || `eq-${Date.now()}`,
      name: formData.get("name") as string,
      category: formData.get("category") as EquipmentCategory,
      quantity: Number(formData.get("quantity")),
      availableQty: Number(formData.get("availableQty")),
      details: formData.get("details") as string,
      isRentable: formData.get("isRentable") === "true",
      isMemberOnly: formData.get("isMemberOnly") === "true",
      pricing: {
        base2Days: Number(formData.get("basePrice")),
        perExtraDay: Number(formData.get("extraPrice")),
      }
    };

    try {
      await equipmentService.upsertEquipment(item);
      alert("儲存成功");
      const updated = await equipmentService.getAllEquipment();
      setInventory(updated);
      setIsModalOpen(false);
    } catch (err) {
      alert("儲存失敗");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("確定要刪除此裝備嗎？")) {
      try {
        await equipmentService.deleteEquipment(id);
        setInventory(prev => prev.filter(i => i.id !== id));
      } catch (err) {
        alert("刪除失敗");
      }
    }
  };

  const handleUpdateRentalStatus = async (id: string, status: string) => {
    try {
      await rentalService.updateStatus(id, status);
      setRentals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      alert("更新失敗");
    }
  };

  const categories: EquipmentCategory[] = ["炊事系統", "營帳系統", "睡眠系統", "行進裝備", "技術裝備"];

  if (isLoading) {
    return <AdminLayout><div className="p-20 text-center font-mono animate-pulse">LOADING_EQUIPMENT...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">裝備與租借管理</h1>
            <p className="text-sm font-serif text-muted">管理社團裝備庫存、維護狀態與租借申請審核。</p>
          </div>
          <div className="flex gap-3">
            {activeTab === "INVENTORY" && (
              <button 
                onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                + Add Equipment
              </button>
            )}
          </div>
        </div>

        <div className="flex border-b border-border mb-10">
          <button 
            onClick={() => setActiveTab("INVENTORY")}
            className={`px-8 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all ${
              activeTab === "INVENTORY" ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Inventory_Stock
          </button>
          <button 
            onClick={() => setActiveTab("RENTALS")}
            className={`px-8 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all ${
              activeTab === "RENTALS" ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Rental_Requests ({rentals.filter(r => r.status === "PENDING").length})
          </button>
        </div>

        {activeTab === "INVENTORY" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory.map((item) => (
              <div key={item.id} className="bg-surface border border-border rounded-3xl p-6 hover:border-accent/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{item.category}</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-muted hover:text-accent transition-colors">✎</button>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-muted hover:text-red-500 transition-colors">🗑️</button>
                  </div>
                </div>
                <h3 className="text-xl font-display italic mb-2">{item.name}</h3>
                <p className="text-xs font-serif text-muted mb-6 line-clamp-2 min-h-[2.5rem]">{item.details || "無詳細說明"}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div>
                    <div className="text-[10px] font-mono text-muted uppercase mb-1">Stock</div>
                    <div className="text-lg font-mono">{item.availableQty} / {item.quantity}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-muted uppercase mb-1">Status</div>
                    <div className={`text-[10px] font-mono font-bold uppercase ${item.availableQty > 0 ? "text-emerald-500" : "text-red-400"}`}>
                      {item.availableQty > 0 ? "In Stock" : "Out of Stock"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "RENTALS" && (
          <div className="space-y-6">
            {rentals.map((request) => (
              <div key={request.id} className="bg-surface border border-border rounded-3xl p-8 flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-mono bg-background border border-border px-2 py-1 rounded tracking-widest">{request.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-1 rounded uppercase font-bold ${
                      request.status === "PENDING" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                      request.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                      "bg-background text-muted border border-border"
                    }`}>{request.status}</span>
                  </div>
                  <h3 className="text-2xl font-display italic mb-2">{request.user_name}</h3>
                  <div className="flex flex-wrap gap-4 text-xs font-serif text-muted">
                    <span>期間: {request.start_date} ~ {request.end_date}</span>
                    <span>預估租金: {request.total_fee}</span>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {request.items.map((item: any, i: number) => (
                      <span key={i} className="px-3 py-1 bg-background border border-border rounded-full text-[10px] font-mono">
                        {item.name} x {item.qty}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-row lg:flex-col gap-2 justify-center">
                  {request.status === "PENDING" && (
                    <>
                      <button onClick={() => handleUpdateRentalStatus(request.id, "APPROVED")} className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-mono uppercase font-bold">Approve</button>
                      <button onClick={() => handleUpdateRentalStatus(request.id, "CANCELLED")} className="flex-1 px-6 py-3 bg-surface border border-border text-muted rounded-xl text-[10px] font-mono uppercase font-bold">Reject</button>
                    </>
                  )}
                  {request.status === "APPROVED" && (
                    <button onClick={() => handleUpdateRentalStatus(request.id, "PICKED_UP")} className="flex-1 px-6 py-3 bg-accent text-white rounded-xl text-[10px] font-mono uppercase font-bold">Mark Picked Up</button>
                  )}
                  {request.status === "PICKED_UP" && (
                    <button onClick={() => handleUpdateRentalStatus(request.id, "RETURNED")} className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-mono uppercase font-bold">Mark Returned</button>
                  )}
                </div>
              </div>
            ))}
            {rentals.length === 0 && (
              <div className="p-20 text-center text-muted font-serif italic border border-dashed border-border rounded-[3rem]">目前尚無租借申請紀錄</div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Equipment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface border border-border w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <form onSubmit={handleSaveItem}>
              <div className="p-8 md:p-10">
                <h2 className="text-2xl font-display italic mb-8">{editingItem ? "編輯裝備資訊" : "新增裝備"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">裝備名稱</label>
                    <input name="name" type="text" defaultValue={editingItem?.name} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">類別</label>
                    <select name="category" defaultValue={editingItem?.category || "炊事系統"} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">總量</label>
                      <input name="quantity" type="number" defaultValue={editingItem?.quantity || 1} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">可用數量</label>
                      <input name="availableQty" type="number" defaultValue={editingItem?.availableQty || 1} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent" required />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">詳細說明/規格</label>
                    <textarea name="details" defaultValue={editingItem?.details} rows={3} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">基本租金 (2天)</label>
                    <input name="basePrice" type="number" defaultValue={editingItem?.pricing?.base2Days || 0} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">每日加價</label>
                    <input name="extraPrice" type="number" defaultValue={editingItem?.pricing?.perExtraDay || 0} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent" />
                  </div>
                </div>
              </div>
              <div className="bg-background p-6 flex justify-end gap-3 border-t border-border">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-[10px] font-mono text-muted uppercase tracking-widest font-bold">Cancel</button>
                <button type="submit" className="px-8 py-2.5 bg-accent text-white rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold shadow-lg shadow-accent/20">Save_Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
