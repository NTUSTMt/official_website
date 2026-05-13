import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { EventItem, eventsData } from "@/data/events";

export const eventService = {
  async getAllEvents() {
    if (!isSupabaseConfigured) return [];
    
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching events from Supabase:", error);
      return [];
    }
    
    return data.map((db: any) => this.mapDbToEvent(db));
  },

  async getEventById(id: string) {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching event ${id} from Supabase:`, error);
      return null;
    }

    if (!data) return null;

    return this.mapDbToEvent(data);
  },

  async upsertEvent(event: Partial<EventItem>) {
    const dbEvent = {
      id: event.id,
      title: event.title,
      date_display: event.date,
      calendar_dates: event.calendarDates,
      difficulty: event.difficulty,
      cost: event.cost,
      status: event.status,
      cover_image: event.coverImage,
      summary: event.summary,
      registration_deadline: event.registrationDeadline,
      description: event.description,
      itinerary: event.itinerary,
      requirements: event.requirements,
      tags: event.tags,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("events")
      .upsert(dbEvent);

    if (error) throw error;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  mapDbToEvent(db: any): EventItem {
    return {
      id: db.id,
      title: db.title,
      date: db.date_display,
      calendarDates: db.calendar_dates,
      difficulty: db.difficulty,
      cost: db.cost,
      status: db.status,
      coverImage: db.cover_image,
      summary: db.summary,
      registrationDeadline: db.registration_deadline || "",
      description: db.description || [],
      itinerary: db.itinerary || [],
      requirements: db.requirements || [],
      tags: db.tags || [],
    };
  }
};

export const registrationService = {
  async getRegistrations(eventId: string) {
    const { data, error } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId)
      .order("signup_date", { ascending: true });

    if (error) {
      console.error("Error fetching registrations:", error);
      return [];
    }
    return data;
  },

  async updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("event_registrations")
      .update({ status })
      .eq("id", id);
    
    if (error) throw error;
  },

  async updatePaymentStatus(id: string, payment_status: string) {
    const { error } = await supabase
      .from("event_registrations")
      .update({ payment_status })
      .eq("id", id);
    
    if (error) throw error;
  },

  async registerForEvent(eventId: string, userId: string, note?: string, registrationData?: any) {
    // 1. 檢查是否已報名
    const { data: existing } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      throw new Error("您已經報名過此活動囉！");
    }

    // 2. 檢查活動狀態與名額 (選擇性，若有設定 max_participants)
    const { data: event } = await supabase
      .from("events")
      .select("status, max_participants")
      .eq("id", eventId)
      .single();

    if (event && event.status !== 'open') {
      throw new Error("此活動目前不開放報名。");
    }

    // 3. 執行報名 - 將詳細資料存入報名表單作為快照
    const { data, error } = await supabase
      .from("event_registrations")
      .insert({
        event_id: eventId,
        user_id: userId,
        note: note,
        signup_date: new Date().toISOString(),
        status: 'pending',
        payment_status: 'unpaid',
        // 存入保險與聯絡快照
        real_name: registrationData?.real_name,
        gender: registrationData?.gender,
        birth_date: registrationData?.birth_date,
        nationality_type: registrationData?.nationality_type,
        id_number: registrationData?.id_number,
        line_id: registrationData?.line_id,
        phone: registrationData?.phone,
        email: registrationData?.email,
        address: registrationData?.address,
        emergency_contact_name: registrationData?.emergency_contact_name,
        emergency_contact_phone: registrationData?.emergency_contact_phone,
        emergency_contact_relationship: registrationData?.emergency_contact_relationship,
        emergency_contact_address: registrationData?.emergency_contact_address,
        student_id: registrationData?.student_id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },


  async getMyRegistration(eventId: string, userId: string) {
    const { data, error } = await supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return null;
    return data;
  }
};
