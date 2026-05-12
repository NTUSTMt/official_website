import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { EventItem, eventsData } from "@/data/events";

export const eventService = {
  async getAllEvents() {
    if (!isSupabaseConfigured) return eventsData;
    
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching events from Supabase:", error);
      return eventsData;
    }
    
    return data.length > 0 ? data.map(this.mapDbToEvent) : eventsData;
  },

  async getEventById(id: string) {
    if (!isSupabaseConfigured) {
      return eventsData.find(e => e.id === id) || null;
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching event ${id} from Supabase:`, error);
      // Fallback to mock data if DB fetch fails
      return eventsData.find(e => e.id === id) || null;
    }

    if (!data) {
      return eventsData.find(e => e.id === id) || null;
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
  }
};
