import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { EquipmentItem, EquipmentCategory } from "@/data/equipment";

export const equipmentService = {
  async getAllEquipment() {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .order("category", { ascending: true });

    if (error) {
      console.error("Error fetching equipment:", error);
      return [];
    }

    return data.map(this.mapDbToEquipment);
  },

  async upsertEquipment(item: Partial<EquipmentItem>) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");

    const dbItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      available_qty: item.availableQty,
      details: item.details,
      pricing: item.pricing,
      is_rentable: item.isRentable,
      is_member_only: item.isMemberOnly || false,
      image_url: item.image,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("equipment")
      .upsert(dbItem);

    if (error) throw error;
  },

  async uploadImage(file: File) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `equipment/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("equipment")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("equipment")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async deleteEquipment(id: string) {
    const { error } = await supabase
      .from("equipment")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async getEquipmentById(id: string) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return this.mapDbToEquipment(data);
  },

  async updateAvailableQty(id: string, delta: number) {
    if (!isSupabaseConfigured) return;
    
    // Use RPC for atomic increment/decrement to prevent race conditions
    const { error } = await supabase.rpc('increment_available_qty', { 
      row_id: id, 
      delta: delta 
    });

    if (error) {
      console.error("RPC error, falling back to manual update:", error);
      // Fallback: manual update (less safe but works if RPC not defined)
      const { data: item } = await supabase.from("equipment").select("available_qty").eq("id", id).single();
      if (item) {
        await supabase.from("equipment")
          .update({ available_qty: item.available_qty + delta })
          .eq("id", id);
      }
    }
  },

  mapDbToEquipment(db: any): EquipmentItem {
    return {
      id: db.id,
      name: db.name,
      category: db.category as EquipmentCategory,
      quantity: db.quantity,
      availableQty: db.available_qty,
      details: db.details,
      isRentable: db.is_rentable,
      isMemberOnly: db.is_member_only,
      pricing: db.pricing,
      image: db.image_url,
    };
  }
};

export const rentalService = {
  async getAllApplications() {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from("rental_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching rentals:", error);
      return [];
    }
    return data;
  },

  async submitApplication(application: any) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");

    // 1. Check stock for all items
    for (const item of application.items) {
      const equip = await equipmentService.getEquipmentById(item.equipmentId);
      if (!equip || equip.availableQty < item.qty) {
        throw new Error(`裝備「${item.name}」目前庫存不足 (剩餘: ${equip?.availableQty || 0})`);
      }
    }

    // 2. Insert application
    const { data, error } = await supabase
      .from("rental_applications")
      .insert({
        user_id: application.userId,
        user_name: application.userName,
        user_type: application.userType,
        is_club_event: application.isClubEvent,
        items: application.items,
        start_date: application.startDate,
        end_date: application.endDate,
        total_fee: application.totalFee,
        status: "PENDING",
        notes: application.notes,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateStatus(id: string, status: string) {
    // Get original application to know items
    const { data: app } = await supabase
      .from("rental_applications")
      .select("*")
      .eq("id", id)
      .single();

    if (!app) throw new Error("Application not found");

    const oldStatus = app.status;

    // Handle inventory logic based on status transition
    if (status === "APPROVED" && oldStatus !== "APPROVED") {
      // Decrease stock
      for (const item of (app.items as any[])) {
        await equipmentService.updateAvailableQty(item.equipmentId, -item.qty);
      }
    } else if (status === "RETURNED" && oldStatus !== "RETURNED") {
      // Increase stock back
      for (const item of (app.items as any[])) {
        await equipmentService.updateAvailableQty(item.equipmentId, item.qty);
      }
    } else if (status === "CANCELLED" && oldStatus === "APPROVED") {
      // If was approved but now cancelled, return stock
      for (const item of (app.items as any[])) {
        await equipmentService.updateAvailableQty(item.equipmentId, item.qty);
      }
    }

    const { error } = await supabase
      .from("rental_applications")
      .update({ status })
      .eq("id", id);
    
    if (error) throw error;
  }
};

