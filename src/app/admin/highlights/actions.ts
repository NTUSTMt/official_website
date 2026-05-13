"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { EventGallery } from "@/data/events";
import { revalidatePath } from "next/cache";

/**
 * 使用 Service Role 權限儲存或更新花絮相簿
 */
export async function upsertGalleryAction(gallery: Partial<EventGallery>) {
  const dbGallery = {
    id: gallery.id || `gal-${Date.now()}`,
    event_title: gallery.eventTitle,
    date: gallery.date,
    cover_image: gallery.coverImage,
    images: gallery.images,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("event_highlights")
    .upsert(dbGallery);

  if (error) {
    console.error("Admin Upsert Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/events/gallery");
  revalidatePath("/admin/highlights");
  return { success: true };
}

/**
 * 使用 Service Role 權限刪除花絮相簿
 */
export async function deleteGalleryAction(id: string) {
  const { error } = await supabaseAdmin
    .from("event_highlights")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Admin Delete Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/events/gallery");
  revalidatePath("/admin/highlights");
  return { success: true };
}
