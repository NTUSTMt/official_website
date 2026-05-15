import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { EquipmentItem, EquipmentCategory, equipmentData } from "@/data/equipment";

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
      emoji: item.emoji,
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
    if (!isSupabaseConfigured) return equipmentData.find(item => item.id === id) || null;

    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      // Fallback to static data if not found in database
      return equipmentData.find(item => item.id === id) || null;
    }

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
  async getCategories() {
    if (!isSupabaseConfigured) return [
      { name: "炊事系統", emoji: "🍳" },
      { name: "營帳系統", emoji: "⛺" },
      { name: "睡眠系統", emoji: "🛌" },
      { name: "行進裝備", emoji: "🎒" },
      { name: "技術裝備", emoji: "⛏️" }
    ];

    const { data, error } = await supabase
      .from("equipment_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    return data;
  },

  async upsertCategory(category: { name: string; emoji?: string }) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");

    const { error } = await supabase
      .from("equipment_categories")
      .upsert(category, { onConflict: 'name' });

    if (error) throw error;
  },

  async updateCategoryName(oldName: string, newName: string) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");

    // 1. Update the category record
    const { error: catError } = await supabase
      .from("equipment_categories")
      .update({ name: newName })
      .eq("name", oldName);
    
    if (catError) throw catError;

    // 2. Update all equipment that used this category
    const { error: equipError } = await supabase
      .from("equipment")
      .update({ category: newName })
      .eq("category", oldName);

    if (equipError) throw equipError;
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
      emoji: db.emoji,
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

  async getUserRentals(userId: string, lineId?: string) {
    if (!isSupabaseConfigured) return [];
    
    let query = supabase
      .from("rental_applications")
      .select("*");

    if (lineId) {
      query = query.or(`user_id.eq."${userId}",user_id.eq."${lineId}"`);
    } else {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
      
    if (error) {
      console.error("Error fetching user rentals:", error);
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

    // 3. Update user balance and record payment
    if (application.totalFee > 0 && application.userId !== "anonymous") {
      try {
        // Find user by either ID or internal LINE ID
        const { data: userData } = await supabase
          .from("users")
          .select("id, balance")
          .eq("id", application.userId) // We assume userId passed is the Database UUID if logged in
          .single();

        if (userData) {
          const newBalance = (userData.balance || 0) - application.totalFee;
          
          // Update balance
          await supabase.from("users").update({ balance: newBalance }).eq("id", userData.id);
          
          // Record payment history
          await supabase.from("payment_history").insert({
            user_id: userData.id,
            amount: -application.totalFee,
            type: 'rental',
            description: `裝備租借 (單號: ${data.id.substring(0,8)})`,
            created_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("Failed to update balance or record payment history:", err);
        // We don't throw here to avoid failing the whole rental submission 
        // since the application record itself was successful.
      }
    }

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

