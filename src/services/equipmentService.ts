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

  async updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("rental_applications")
      .update({ status })
      .eq("id", id);
    
    if (error) throw error;
  }
};
