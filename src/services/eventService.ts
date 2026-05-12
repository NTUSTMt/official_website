import { supabase } from "@/lib/supabase";
import { EventItem } from "@/data/events";

export const eventService = {
  async getAllEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }

    return data.map(this.mapDbToEvent);
  },

  async getEventById(id: string) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching event ${id}:`, error);
      return null;
    }

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
  }
};
