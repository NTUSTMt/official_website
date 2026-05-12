import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { rulesData, RuleCategory } from "@/data/rules";

export const ruleService = {
  async getRuleCategory(id: string): Promise<RuleCategory> {
    if (!isSupabaseConfigured) return rulesData[id] || { id, title: "Unknown", description: "", sections: [] };

    const { data, error } = await supabase
      .from("cms_config")
      .select("content")
      .eq("id", `rule_${id}`)
      .single();

    if (error || !data) {
      console.warn(`Rule category ${id} not found in DB, using static data.`);
      return rulesData[id] || { id, title: "Unknown", description: "", sections: [] };
    }

    return data.content as RuleCategory;
  },

  async saveRuleCategory(category: RuleCategory) {
    if (!isSupabaseConfigured) {
      console.log("Mock Save:", category);
      return;
    }

    const { error } = await supabase
      .from("cms_config")
      .upsert({
        id: `rule_${category.id}`,
        content: category,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error(`Error saving rule category ${category.id}:`, error);
      throw error;
    }
  }
};
