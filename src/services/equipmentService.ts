import { supabase } from "@/lib/supabase";
import { EquipmentItem, EquipmentCategory } from "@/data/equipment";

export const equipmentService = {
  async getAllEquipment() {
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
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("equipment")
      .upsert(dbItem);

    if (error) throw error;
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
    };
  }
};

export const rentalService = {
  async getAllApplications() {
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
