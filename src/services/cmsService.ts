import { supabase } from "@/lib/supabase";
import { mockCMSConfig, GlobalConfig } from "@/data/cms";

export const cmsService = {
  async getConfig(): Promise<GlobalConfig> {
    const { data, error } = await supabase
      .from("cms_config")
      .select("*")
      .eq("id", "global_config")
      .single();

    if (error) {
      console.error("Error fetching CMS config:", error);
      return mockCMSConfig; // Fallback to mock data
    }
    
    return {
      siteName: data.site_name || mockCMSConfig.siteName,
      heroTagline: data.hero_tagline,
      heroSubtext: data.hero_subtext,
      stats: data.stats,
      announcement: data.announcement,
      fees: data.fees,
      officeHours: data.office_hours,
    };
  },

  async updateConfig(config: any) {
    const { error } = await supabase
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
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error updating CMS config:", error);
      throw error;
    }
  }
};

export const historyService = {
  async getMilestones() {
    const { data, error } = await supabase
      .from("history_milestones")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching history:", error);
      return [];
    }
    return data;
  },

  async saveMilestones(milestones: any[]) {
    // Basic implementation: delete all and insert new (for simplicity in mock migration)
    // In a real app, you'd do selective upserts
    await supabase.from("history_milestones").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    
    const { error } = await supabase.from("history_milestones").insert(
      milestones.map((m, idx) => ({
        year: m.year,
        title: m.title,
        content: m.content,
        order_index: idx
      }))
    );

    if (error) throw error;
  }
};
