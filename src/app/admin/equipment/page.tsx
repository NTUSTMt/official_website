"use client";

import React, { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { equipmentData, EquipmentItem, EquipmentCategory } from "@/data/equipment";
import { mockRentalRequests, RentalRequest } from "@/data/rental_requests";

type Tab = "INVENTORY" | "REQUESTS";

export default function EquipmentAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("INVENTORY");
  const [inventory, setInventory] = useState(equipmentData);
  const [requests, setRequests] = useState(mockRentalRequests);
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateStatus = (reqId: string, newStatus: RentalRequest["status"]) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: newStatus } : r));
  };

  const handleToggleMaintenance = (itemId: string) => {
    alert(`裝備 ${itemId} 已標記為維修狀態。`);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("確定要刪除這項裝備嗎？")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save logic
    alert("Saved (Mock)");
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const TabButton = ({ id, label, count }: { id: Tab, label: string, count?: number }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-8 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all relative ${
        activeTab === id ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-2 bg-accent text-accent-foreground w-4 h-4 rounded-full text-[8px] flex items-center justify-center absolute top-2 right-2">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <AdminLayout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display italic mb-2">裝備與租借管理</h1>
            <p className="text-sm font-serif text-muted">控管社團公裝庫存、審核社員租借申請與追蹤歸還狀態。</p>
          </div>
          {activeTab === "INVENTORY" && (
            <button 
              onClick={() => { setSelectedItem(null); setIsModalOpen(true); }}
              className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-accent/20"
            >
              + Add New Gear
            </button>
          )}
        </div>

        <div className="flex border-b border-border mb-10 overflow-x-auto">
          <TabButton id="INVENTORY" label="Inventory_Cards" />
          <TabButton 
            id="REQUESTS" 
            label="Rental_Requests" 
            count={requests.filter(r => r.status === "PENDING").length} 
          />
        </div>

        {activeTab === "INVENTORY" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {inventory.map((item) => (
              <div key={item.id} className="bg-surface border border-border rounded-[2rem] overflow-hidden group hover:border-accent transition-all flex flex-col">
                {/* Card Header / Image */}
                <div className="h-40 bg-background relative overflow-hidden">
                  <div className="absolute inset-0 bg-accent/5 flex items-center justify-center">
                    <span className="font-mono text-[8px] text-accent/30 tracking-[0.3em] uppercase">No_Media_Placeholder</span>
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-0.5 bg-background/80 backdrop-blur-md rounded-full text-[8px] font-mono text-muted uppercase tracking-widest border border-border/50">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => { setSelectedItem(item); setIsModalOpen(true); }} className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-xs hover:border-accent transition-colors">✏️</button>
                    <button onClick={() => handleDeleteItem(item.id)} className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-xs hover:border-red-500 transition-colors">🗑️</button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-display italic text-foreground leading-tight">{item.name}</h3>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-accent font-bold">{item.availableQty} / {item.quantity}</div>
                      <div className="text-[8px] font-mono text-muted uppercase tracking-tighter">In_Stock</div>
                    </div>
                  </div>
                  
                  {item.details && (
                    <p className="text-xs font-serif text-muted line-clamp-2 mb-4 leading-relaxed">
                      {item.details}
                    </p>
                  )}

                  <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center">
                    <div className="text-[10px] font-mono text-foreground font-bold">
                      {item.pricing ? `NT$ ${item.pricing.base2Days} / 2d` : "Free"}
                    </div>
                    <button 
                      onClick={() => handleToggleMaintenance(item.id)}
                      className="text-[9px] font-mono text-muted hover:text-amber-500 uppercase tracking-widest transition-colors flex items-center gap-1"
                    >
                      🛠️ Maintenance
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "REQUESTS" && (
          <div className="space-y-6">
            {requests.map((req) => (
              <div key={req.id} className="bg-surface border border-border rounded-3xl p-8 hover:border-accent/30 transition-all">
                {/* ... (Same request view as before) */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-[9px] font-mono px-3 py-1 rounded-full border tracking-widest font-bold uppercase ${
                        req.status === "PENDING" ? "border-amber-500/20 text-amber-600 bg-amber-50" :
                        req.status === "APPROVED" ? "border-emerald-500/20 text-emerald-600 bg-emerald-50" :
                        "border-muted/20 text-muted bg-background"
                      }`}>
                        {req.status}
                      </span>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-widest">ID: {req.id}</span>
                    </div>
                    <h3 className="text-xl font-display italic mb-2">{req.userName} <span className="text-xs font-serif text-muted not-italic">({req.userType})</span></h3>
                    <div className="text-xs font-mono text-muted mb-4">Duration: {req.startDate} to {req.endDate}</div>
                    <div className="space-y-2 mt-4">
                      <div className="text-[9px] font-mono text-muted uppercase tracking-widest border-b border-border/50 pb-1 mb-2">Requested_Items</div>
                      {req.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm font-serif">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                          <span>{item.name} x {item.qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full md:w-64 flex flex-col gap-3">
                    <div className="bg-background rounded-2xl p-4 border border-border mb-2 text-center">
                      <div className="text-[10px] font-mono text-muted uppercase mb-1">Total_Fee</div>
                      <div className="text-lg font-mono font-bold text-foreground">{req.totalFee}</div>
                    </div>
                    {req.status === "PENDING" && (
                      <button onClick={() => handleUpdateStatus(req.id, "APPROVED")} className="w-full py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold shadow-lg shadow-emerald-200">Approve_Request</button>
                    )}
                    {req.status === "APPROVED" && (
                      <button onClick={() => handleUpdateStatus(req.id, "PICKED_UP")} className="w-full py-3 bg-accent text-accent-foreground rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold">Confirm_Pickup</button>
                    )}
                    {req.status === "PICKED_UP" && (
                      <button onClick={() => handleUpdateStatus(req.id, "RETURNED")} className="w-full py-3 bg-background border border-emerald-500 text-emerald-600 rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold">Confirm_Return</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add/Edit Gear */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-surface w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-muted hover:text-foreground">✕</button>
              <h2 className="text-3xl font-display italic mb-8">{selectedItem ? "編輯裝備" : "新增裝備"}</h2>
              
              <form onSubmit={handleSaveItem} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">裝備名稱</label>
                    <input type="text" defaultValue={selectedItem?.name} required className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">類別</label>
                    <select defaultValue={selectedItem?.category} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors">
                      <option>炊事系統</option>
                      <option>營帳系統</option>
                      <option>睡眠系統</option>
                      <option>行進裝備</option>
                      <option>技術裝備</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">總量</label>
                    <input type="number" defaultValue={selectedItem?.quantity} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-mono text-sm outline-none focus:border-accent transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">詳細規格 / 內容</label>
                  <textarea rows={3} defaultValue={selectedItem?.details} className="w-full bg-background border border-border px-4 py-3 rounded-xl font-serif text-sm outline-none focus:border-accent transition-colors resize-none" />
                </div>
                <div className="flex justify-end gap-4 mt-10">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-[10px] font-mono text-muted uppercase tracking-widest">Cancel</button>
                  <button type="submit" className="px-10 py-3 bg-accent text-accent-foreground rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold shadow-lg shadow-accent/20">Save_Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
