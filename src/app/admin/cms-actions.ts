"use server"

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function updateGlobalConfigAction(config: any) {
  try {
    const { error } = await supabaseAdmin
      .from("cms_config")
      .upsert({
        id: "global_config",
        site_name: config.siteName,
        hero_tagline: config.heroTagline,
        hero_subtext: config.heroSubtext,
        stats: config.stats,
        announcement: config.announcement,
        fees: config.fees,
        office_hours: config.officeHours,
        introduction: config.introduction,
        slogan: config.slogan,
        slogan_label: config.sloganLabel,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Action error updating CMS:", error);
      throw new Error(error.message);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Action exception:", error);
    throw error;
  }
}

export async function saveHistoryMilestonesAction(milestones: any[]) {
  try {
    // Delete existing
    await supabaseAdmin.from("history_milestones").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    
    // Insert new
    const { error } = await supabaseAdmin.from("history_milestones").insert(
      milestones.map((m, idx) => ({
        year: m.year,
        title: m.title,
        content: m.content,
        order_index: idx
      }))
    );

    if (error) throw error;
    revalidatePath("/about");
    return { success: true };
  } catch (error: any) {
    throw error;
  }
}

export async function saveCommitteesAction(data: any[]) {
  try {
    const { error } = await supabaseAdmin
      .from("committee_years")
      .upsert(
        data.map(item => ({
          year: item.year,
          members: item.members,
          updated_at: new Date().toISOString()
        }))
      );
    if (error) throw error;
    revalidatePath("/about");
    return { success: true };
  } catch (error: any) {
    throw error;
  }
}

export async function saveCmsConfigAction(id: string, content: any) {
  try {
    const { error } = await supabaseAdmin
      .from("cms_config")
      .upsert({
        id,
        content,
        updated_at: new Date().toISOString()
      });
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    throw error;
  }
}
