import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockCMSConfig, GlobalConfig } from "@/data/cms";
import { committeeData } from "@/data/committee";

export const cmsService = {
  async getConfig(): Promise<GlobalConfig> {
    if (!isSupabaseConfigured) return mockCMSConfig;

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
      heroTagline: data.hero_tagline || mockCMSConfig.heroTagline,
      heroSubtext: data.hero_subtext || mockCMSConfig.heroSubtext,
      stats: { ...mockCMSConfig.stats, ...data.stats },
      announcement: { ...mockCMSConfig.announcement, ...data.announcement },
      fees: { ...mockCMSConfig.fees, ...data.fees },
      officeHours: data.office_hours || mockCMSConfig.officeHours,
    };
  },

  async updateConfig(config: any) {
    if (!isSupabaseConfigured) {
      throw new Error("Cannot update config: Supabase not configured");
    }

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
    if (!isSupabaseConfigured) return [];

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
  },

  async getCommittees(): Promise<any[]> {
    if (!isSupabaseConfigured) return committeeData;
    const { data, error } = await supabase
      .from("committee_years")
      .select("*")
      .order("year", { ascending: false });
    
    if (error || !data || data.length === 0) return committeeData;
    return data;
  },

  async saveCommittees(data: any[]) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    
    // We can do a bulk upsert if the ID (year) is unique
    const { error } = await supabase
      .from("committee_years")
      .upsert(
        data.map(item => ({
          year: item.year,
          members: item.members,
          updated_at: new Date().toISOString()
        }))
      );

    if (error) {
      console.error("Error saving committees:", error);
      throw error;
    }
  },

  async getCommitteeRoles(): Promise<any> {
    const defaultRoles = {
      roles: [
        { title: "社長", description: "負責統籌社團事務：監督社團運作、主持討論、社團競賽、社團負責人會議⋯." },
        { title: "副社長", description: "負責社團行政工作：活動申請、活動結案、社團資料更新、爭取學校補助⋯." },
        { title: "活動長", description: "負責管理社團活動：活動人員管理、行程細項準備.." },
        { title: "器材長", description: "負責管理社團裝備器材：裝備器材採買保養、裝備器材租借管理、社課相關作業." },
        { title: "財務長", description: "負責管理社團$$：辦理活動保險、計算活動收支、管理社團帳簿與財務狀況⋯." },
        { title: "美宣", description: "負責社團對外宣傳事務：管理社團粉專 (發文＋回覆訊息) 、管理社團官網⋯." }
      ],
      commonResponsibilities: [
        "共同執行每次活動的內容規劃、事前準備、人員掌控、行前說明.⋯⋯..",
        "每次社團活動時負責帶領、照顧其他參與人員",
        "每次社團活動時分配並做好各自上山後的工作"
      ],
      mountainDuties: [
        { title: "領隊", description: "隊伍第一人：負責認路、帶路、控制隊伍行進速度" },
        { title: "押隊", description: "隊伍最後一人：確保所有人員都跟上隊伍、防止人員落單" },
        { title: "醫務", description: "擁有急救包之人：攜帶社團急救包供人員受傷時使用" },
        { title: "回報", description: "聯繫留守人之人：固定間隔一段時間於訊號點回報隊伍行進狀況給留守人 (中途如有必要可換人回報)" },
        { title: "留守人", description: "山下待命之人：萬一隊伍遭遇意外, 幫忙尋求救援 (不一定要是幹部)" }
      ]
    };

    if (!isSupabaseConfigured) return defaultRoles;
    const { data, error } = await supabase
      .from("cms_config")
      .select("content")
      .eq("id", "committee_roles")
      .single();
    if (error) return defaultRoles;
    return data.content;
  },

  async saveCommitteeRoles(content: any) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    const { error } = await supabase
      .from("cms_config")
      .upsert({
        id: "committee_roles",
        content: content,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  async getActivityLevels(): Promise<any[]> {
    const defaultLevels = [
      { level: 1, label: "入門", description: "步道設施完善，路況平緩好走。適合沒有登山經驗、體力正常的初學者。", example: "大坑步道、劍潭山、象山步道、草嶺古道。", color: "bg-emerald-500" },
      { level: 2, label: "初階", description: "多為輕裝當日行程，有明顯坡度，需具備基本體能與基礎登山裝備。", example: "七星山、東眼山、五寮尖、加里山。", color: "bg-teal-500" },
      { level: 3, label: "中階", description: "包含兩天以上過夜行程，路況較不穩定，需背負重裝或具備過夜野炊經驗。", example: "合歡群峰、奇萊南華、嘉明湖、松蘿湖。", color: "bg-blue-500" },
      { level: 4, label: "高階", description: "長天數縱走或技術性地形，路跡不明確且氣候變化大，需豐富登山經驗與體能。", example: "南湖大山、雪山聖稜線、奇萊主北、北二段。", color: "bg-orange-500" },
      { level: 5, label: "挑戰", description: "極限天數、探勘路線或極端地形，對體能、意志力與山域技能要求極高。", example: "中央山脈大縱走、四大障礙、干卓萬下武界。", color: "bg-red-500" }
    ];

    if (!isSupabaseConfigured) return defaultLevels;
    const { data, error } = await supabase
      .from("cms_config")
      .select("content")
      .eq("id", "activity_levels")
      .single();
    if (error) return defaultLevels;
    return data.content;
  },

  async saveActivityLevels(levels: any[]) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    const { error } = await supabase
      .from("cms_config")
      .upsert({
        id: "activity_levels",
        content: levels,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  },

  async getSemesterCalendars(): Promise<any[]> {
    const defaultCalendars: any[] = [];
    if (!isSupabaseConfigured) return defaultCalendars;
    const { data, error } = await supabase
      .from("cms_config")
      .select("content")
      .eq("id", "semester_calendars")
      .single();
    if (error) return defaultCalendars;
    return data.content;
  },

  async saveSemesterCalendars(calendars: any[]) {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    const { error } = await supabase
      .from("cms_config")
      .upsert({
        id: "semester_calendars",
        content: calendars,
        updated_at: new Date().toISOString()
      });
    if (error) throw error;
  }
};
