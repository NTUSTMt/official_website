import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { EventGallery, galleryData } from "@/data/events";

export const galleryService = {
  async getAllGalleries() {
    if (!isSupabaseConfigured) return [];
    
    const { data, error } = await supabase
      .from("event_highlights")
      .select("*")
      .order("date", { ascending: false });
    
    if (error) {
      console.error("Supabase Fetch Error (event_highlights):", error.message, error.details, error.hint);
      // 如果資料表不存在，通常 error.code 會是 '42P01'
      if (error.code === '42P01') {
        console.warn("Table 'event_highlights' does not exist. Please run the SQL migration.");
      }
      return [];
    }
    
    return data.map((db: any) => this.mapDbToGallery(db));
  },

  async upsertGallery(gallery: Partial<EventGallery>) {
    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured, cannot save gallery");
      return;
    }

    const dbGallery = {
      id: gallery.id || `gal-${Date.now()}`,
      event_title: gallery.eventTitle,
      date: gallery.date,
      cover_image: gallery.coverImage,
      images: gallery.images,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("event_highlights")
      .upsert(dbGallery);

    if (error) throw error;
  },

  async deleteGallery(id: string) {
    if (!isSupabaseConfigured) return;
    
    const { error } = await supabase
      .from("event_highlights")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async uploadImages(files: File[]): Promise<string[]> {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");

    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      // 使用時間戳記 + 隨機數，避免檔名衝突且更易辨識
      const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("activity-images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Supabase Storage Upload Error Detail:", uploadError);
        throw new Error(`上傳失敗: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from("activity-images")
        .getPublicUrl(filePath);

      console.log("Generated Public URL:", publicUrl);
      
      // 確保 URL 包含 /public/ 段落 (某些 SDK 版本或設定可能會有差異)
      let finalUrl = publicUrl;
      if (!finalUrl.includes("/public/") && finalUrl.includes("/storage/v1/object/")) {
        finalUrl = finalUrl.replace("/storage/v1/object/", "/storage/v1/object/public/");
      }

      return finalUrl;
    });

    return Promise.all(uploadPromises);
  },

  mapDbToGallery(db: any): EventGallery {
    return {
      id: db.id,
      eventTitle: db.event_title,
      date: db.date,
      coverImage: db.cover_image,
      images: db.images || [],
    };
  }
};
