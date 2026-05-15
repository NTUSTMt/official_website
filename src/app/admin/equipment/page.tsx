"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { equipmentData, EquipmentItem, EquipmentCategory } from "@/data/equipment";
import { equipmentService, rentalService } from "@/services/equipmentService";
import { Trash2, Pencil, Plus, Search, Package, CheckCircle, XCircle, Save, Upload, X } from "lucide-react";
import { uploadFileAction } from "../uploadAction";
import { isSupabaseConfigured } from "@/lib/supabase";

type Tab = "INVENTORY" | "RENTALS" | "CATEGORIES";

export default function AdminEquipmentPage() {
  const [activeTab, setActiveTab] = useState<Tab>("INVENTORY");
  const [inventory, setInventory] = useState<EquipmentItem[]>([]);
  const [rentals, setRentals] = useState<any[]>([]);
  const [categories, setCategories] = useState<{id?: string, name: string, emoji: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Load data from DB
  useEffect(() => {
    async function loadData() {
      try {
        const dbEquipment = await equipmentService.getAllEquipment();
        if (dbEquipment.length > 0) {
          setInventory(dbEquipment);
          setIsUsingFallback(false);
        } else {
          setInventory(equipmentData);
          setIsUsingFallback(true);
        }
        
        const dbRentals = await rentalService.getAllApplications();
        setRentals(dbRentals);

        const dbCategories = await equipmentService.getCategories();
        setCategories(dbCategories);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setPreviewImage(editingItem.image || null);
    } else {
      setPreviewImage(null);
    }
  }, [editingItem, isModalOpen]);
  
  const handleFileUpload = async (file: File, bucketName: string = "equipment") => {
    if (!isSupabaseConfigured) return null;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${bucketName}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("bucket", bucketName);

      const result = await uploadFileAction(formData);

      if (!result.success) {
        // 特別檢查如果是桶子不存在的錯誤
        if (result.error.includes("not found")) {
          throw new Error(`儲存桶「${bucketName}」不存在，請先在 Supabase 控制台建立此 Storage Bucket 並設為 Public。`);
        }
        throw new Error(`儲存服務錯誤: ${result.error}`);
      }

      return result.publicUrl!;
    } catch (error) {
      console.error('Error uploading:', error);
      alert(`上傳失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
      return null;
    }
  };

  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.currentTarget);
    const file = (formData.get("image") as File);
    
    let imageUrl = previewImage || "";
    
    // Image was already handled by handleFileUpload in the onChange handler
    // but just in case we have a direct file from the form
    if (file && file.size > 0 && !previewImage?.startsWith('http')) {
      try {
        const uploadedUrl = await handleFileUpload(file, "equipment");
        if (uploadedUrl) imageUrl = uploadedUrl;
      } catch (err) {
        console.error("Upload error:", err);
        alert("圖片上傳失敗");
        setUploading(false);
        return;
      }
    }
    
    const item: Partial<EquipmentItem> = {
      id: editingItem?.id || `eq-${Date.now()}`,
      name: formData.get("name") as string,
      category: formData.get("category") as EquipmentCategory,
      quantity: Number(formData.get("quantity")),
      availableQty: Number(formData.get("availableQty")),
      details: formData.get("details") as string,
      isRentable: true, // Default to true
      isMemberOnly: formData.get("isMemberOnly") === "true",
      image: imageUrl,
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
      console.error("Save error:", err);
      alert("儲存失敗");
    } finally {
      setUploading(false);
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
      // Refresh both rentals and inventory to see stock changes
      const [updatedRentals, updatedInventory] = await Promise.all([
        rentalService.getAllApplications(),
        equipmentService.getAllEquipment()
      ]);
      setRentals(updatedRentals);
      setInventory(updatedInventory);
    } catch (err) {
      alert("更新失敗");
    }
  };



  if (isLoading) {
    return <AdminLayout><div className="p-20 text-center font-mono animate-pulse">裝備資料讀取中...</div></AdminLayout>;
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
                className="px-6 py-2.5 bg-accent text-accent-foreground font-mono text-[10px] uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Plus className="w-3 h-3" />
                新增裝備
              </button>
            )}
          </div>
        </div>

        {isUsingFallback && activeTab === "INVENTORY" && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-3xl text-amber-700 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-4">
              <span className="text-2xl">💡</span>
              <div className="font-serif text-sm">
                目前正在顯示 <span className="font-bold underline">預設靜態資料</span>。資料庫中尚未建立裝備紀錄，請點擊「編輯裝備資訊」並儲存以將資料寫入雲端。
              </div>
            </div>
          </div>
        )}

        <div className="flex border-b border-border mb-10">
          <button 
            onClick={() => setActiveTab("INVENTORY")}
            className={`px-8 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all ${
              activeTab === "INVENTORY" ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            裝備庫存
          </button>
          <button 
            onClick={() => setActiveTab("RENTALS")}
            className={`px-8 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all ${
              activeTab === "RENTALS" ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            租借申請 ({rentals.filter(r => r.status === "PENDING").length})
          </button>
          <button 
            onClick={() => setActiveTab("CATEGORIES")}
            className={`px-8 py-4 text-xs font-mono tracking-widest uppercase border-b-2 transition-all ${
              activeTab === "CATEGORIES" ? "border-accent text-accent font-bold" : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            分類管理
          </button>
        </div>

        {activeTab === "INVENTORY" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {inventory.map((item) => (
              <div 
                key={item.id}
                className="group bg-surface border border-border rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* 1. Image Area */}
                <div className="aspect-square bg-muted/10 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                  
                    <div className="text-muted/20 text-6xl group-hover:scale-110 transition-transform duration-700">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <span className="block scale-150">
                          {categories.find(c => c.name === item.category)?.emoji || "📦"}
                        </span>
                      )}
                    </div>
                  
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
                      <span className="text-foreground font-bold">{item.availableQty}</span> / {item.quantity}
                    </div>
                  </div>

                  {/* 3. Name */}
                  <h3 className="text-xl font-display italic mb-2">{item.name}</h3>

                  {/* 4. Note (Details) */}
                  <p className="text-sm font-serif text-muted/60 mb-6 line-clamp-2 min-h-[2.5rem] break-words">
                    {item.details || "專業登山裝備，提供完善防護與便利性。"}
                  </p>

                  <div className="mt-auto">
                    {/* 5. Pricing (Base & Extra) */}
                    <div className="flex justify-between items-end mb-6 p-4 bg-background/50 border border-border/50 rounded-2xl">
                      <div className="font-mono">
                        <div className="text-[8px] text-muted/40 uppercase tracking-widest mb-1">基本租金 (2天)</div>
                        <div className="text-sm font-bold text-accent">${item.pricing?.base2Days || 0}</div>
                      </div>
                      <div className="w-px h-6 bg-border/50"></div>
                      <div className="font-mono text-right">
                        <div className="text-[8px] text-muted/40 uppercase tracking-widest mb-1">每日加價</div>
                        <div className="text-sm font-bold">${item.pricing?.perExtraDay || 0}</div>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
                      className="w-full py-4 bg-background border border-border text-muted hover:text-accent hover:border-accent rounded-full font-mono text-xs uppercase tracking-[0.2em] transition-all"
                    >
                      編輯裝備資訊
                    </button>
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
                      <button onClick={() => handleUpdateRentalStatus(request.id, "APPROVED")} className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-mono uppercase font-bold">核准申請</button>
                      <button onClick={() => handleUpdateRentalStatus(request.id, "CANCELLED")} className="flex-1 px-6 py-3 bg-surface border border-border text-muted rounded-xl text-[10px] font-mono uppercase font-bold">拒絕申請</button>
                    </>
                  )}
                  {request.status === "APPROVED" && (
                    <button onClick={() => handleUpdateRentalStatus(request.id, "PICKED_UP")} className="flex-1 px-6 py-3 bg-accent text-white rounded-xl text-[10px] font-mono uppercase font-bold">標記已取貨</button>
                  )}
                  {request.status === "PICKED_UP" && (
                    <button onClick={() => handleUpdateRentalStatus(request.id, "RETURNED")} className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-mono uppercase font-bold">標記已歸還</button>
                  )}
                </div>
              </div>
            ))}
            {rentals.length === 0 && (
              <div className="p-20 text-center text-muted font-serif italic border border-dashed border-border rounded-[3rem]">目前尚無租借申請紀錄</div>
            )}
          </div>
        )}

        {activeTab === "CATEGORIES" && (
          <div className="max-w-4xl space-y-8">
            <div className="bg-surface border border-border rounded-[2.5rem] p-10">
              <h2 className="text-2xl font-display italic mb-8">現有分類管理</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map((cat, idx) => (
                  <div key={cat.id || `cat-${idx}`} className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-border group">
                    <input 
                      type="text" 
                      defaultValue={cat.emoji}
                      placeholder="📦"
                      onBlur={async (e) => {
                        const newEmoji = e.target.value;
                        if (newEmoji !== cat.emoji) {
                          try {
                            await equipmentService.upsertCategory({ name: cat.name, emoji: newEmoji });
                            const updated = await equipmentService.getCategories();
                            setCategories(updated);
                          } catch (err) {
                            alert("圖示更新失敗");
                          }
                        }
                      }}
                      className="w-16 h-16 bg-surface border border-border rounded-xl text-center text-2xl outline-none focus:border-accent"
                    />
                    <div className="flex-1 min-w-0">
                      <input 
                        type="text" 
                        defaultValue={cat.name}
                        onBlur={async (e) => {
                          const newName = e.target.value;
                          if (newName && newName !== cat.name) {
                            if (confirm(`確定要把分類「${cat.name}」改名為「${newName}」嗎？這會影響所有屬於此分類的裝備。`)) {
                              try {
                                await equipmentService.updateCategoryName(cat.name, newName);
                                alert("更新成功");
                                const updated = await equipmentService.getCategories();
                                setCategories(updated);
                              } catch (err) {
                                alert("更新失敗");
                              }
                            } else {
                              e.target.value = cat.name;
                            }
                          }
                        }}
                        className="w-full bg-transparent border-none outline-none font-serif text-xl focus:text-accent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-[2.5rem] p-10">
              <h2 className="text-xl font-display italic mb-4 text-accent">新增分類</h2>
              <p className="text-sm font-serif text-muted mb-6 italic">直接在下方輸入新分類名稱，按下確定後即可在編輯裝備時選用。</p>
              <div className="flex gap-4">
                <input 
                  id="new-category-emoji"
                  type="text" 
                  placeholder="📦"
                  className="w-20 bg-surface border border-border px-4 py-4 rounded-2xl font-serif text-center text-lg outline-none focus:border-accent"
                />
                <input 
                  id="new-category-name"
                  type="text" 
                  placeholder="輸入新分類名稱..."
                  className="flex-1 bg-surface border border-border px-6 py-4 rounded-2xl font-serif text-sm outline-none focus:border-accent"
                />
                <button 
                  onClick={async () => {
                    const nameInput = document.getElementById("new-category-name") as HTMLInputElement;
                    const emojiInput = document.getElementById("new-category-emoji") as HTMLInputElement;
                    const name = nameInput?.value.trim();
                    const emoji = emojiInput?.value.trim() || "📦";
                    
                    if (name && !categories.find(c => c.name === name)) {
                      try {
                        await equipmentService.upsertCategory({ name, emoji });
                        const updated = await equipmentService.getCategories();
                        setCategories(updated);
                        nameInput.value = "";
                        emojiInput.value = "";
                        alert(`已新增分類「${name}」`);
                      } catch (err) {
                        alert("新增失敗");
                      }
                    }
                  }}
                  className="px-8 py-4 bg-accent text-white rounded-2xl font-mono text-[10px] uppercase tracking-widest font-bold shadow-lg shadow-accent/20"
                >
                  確定新增
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Equipment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface border border-border w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <form onSubmit={handleSaveItem}>
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-display italic">{editingItem ? "編輯裝備資訊" : "新增裝備"}</h2>
                  {editingItem && (
                    <button 
                      type="button"
                      onClick={() => {
                        handleDeleteItem(editingItem.id);
                        setIsModalOpen(false);
                      }}
                      className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="刪除裝備"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Left Column: Image Upload */}
                  <div className="lg:col-span-4 space-y-6">
                    <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">裝備圖片 Photo</label>
                    <div className="aspect-square bg-background border-2 border-dashed border-border rounded-3xl overflow-hidden relative group cursor-pointer hover:border-accent transition-colors">
                      {previewImage ? (
                        <img src={previewImage} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted/40">
                          <Plus className="w-8 h-8 mb-2" />
                          <span className="text-[10px] font-mono uppercase">上傳圖片</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        name="image" 
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file, "equipment");
                            if (url) setPreviewImage(url);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                      {previewImage && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-mono uppercase tracking-widest">
                          更換圖片
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-muted/40 text-center uppercase tracking-widest">建議尺寸: 800 x 800px</p>
                  </div>

                  {/* Right Column: Details */}
                  <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">裝備名稱 Name</label>
                      <input name="name" type="text" defaultValue={editingItem?.name} className="w-full bg-background border border-border px-6 py-4 rounded-2xl font-serif text-lg outline-none focus:border-accent" required />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">類別 Category</label>
                      <select name="category" defaultValue={editingItem?.category || categories[0]?.name} className="w-full bg-background border border-border px-6 py-4 rounded-2xl font-serif text-sm outline-none focus:border-accent">
                        {categories.map((c, idx) => <option key={c.id || `opt-${idx}`} value={c.name}>{c.name}</option>)}
                      </select>
                      <p className="mt-2 text-[10px] font-serif text-muted italic ml-1">* 若需新增分類，請至「分類管理」分頁。</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">總庫存 Total</label>
                        <input name="quantity" type="number" defaultValue={editingItem?.quantity || 1} className="w-full bg-background border border-border px-6 py-4 rounded-2xl font-mono text-sm outline-none focus:border-accent" required />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">可用庫存 Avail</label>
                        <input name="availableQty" type="number" defaultValue={editingItem?.availableQty || 1} className="w-full bg-background border border-border px-6 py-4 rounded-2xl font-mono text-sm outline-none focus:border-accent" required />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">詳細說明/規格 Details</label>
                      <textarea name="details" defaultValue={editingItem?.details} rows={4} className="w-full bg-background border border-border px-6 py-4 rounded-2xl font-serif text-sm outline-none focus:border-accent resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">基本租金 (2天) Base</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted font-mono text-sm">$</span>
                        <input name="basePrice" type="number" defaultValue={editingItem?.pricing?.base2Days || 0} className="w-full bg-background border border-border pl-12 pr-6 py-4 rounded-2xl font-mono text-sm outline-none focus:border-accent" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-muted uppercase tracking-widest mb-2 ml-1">每日加價 Extra</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted font-mono text-sm">$</span>
                        <input name="extraPrice" type="number" defaultValue={editingItem?.pricing?.perExtraDay || 0} className="w-full bg-background border border-border pl-12 pr-6 py-4 rounded-2xl font-mono text-sm outline-none focus:border-accent" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" name="isMemberOnly" value="true" defaultChecked={editingItem?.isMemberOnly} className="peer sr-only" />
                          <div className="w-10 h-6 bg-border rounded-full peer peer-checked:bg-accent transition-colors"></div>
                          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition-transform shadow-sm"></div>
                        </div>
                        <span className="text-[10px] font-mono text-muted uppercase tracking-widest group-hover:text-accent transition-colors">限社員租借 Member Only</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-background p-8 flex justify-end gap-4 border-t border-border">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  disabled={uploading}
                  className="px-8 py-3 text-[10px] font-mono text-muted uppercase tracking-widest font-bold hover:text-foreground transition-colors disabled:opacity-50"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  disabled={uploading}
                  className="px-12 py-3 bg-accent text-white rounded-xl text-[10px] font-mono uppercase tracking-widest font-bold shadow-lg shadow-accent/20 hover:brightness-110 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    {uploading ? "上傳中..." : "儲存裝備資訊"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
