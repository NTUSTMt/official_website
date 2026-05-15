export interface NavItem {
  label: string;
  tKey?: string; // Add this for translation
  href: string;
  subtitle?: string;
  description?: string;
  descKey?: string; // Add this for translated descriptions
  subItems?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  { label: "首頁", tKey: "common.home", href: "/" },
  { 
    label: "關於山社", 
    tKey: "common.about",
    href: "/about",
    subtitle: "ABOUT US",
    description: "探索台科大登山社的歷史傳承、社團特色與核心價值。",
    descKey: "nav.about.desc",
    subItems: [
      { label: "社團簡史與傳承", tKey: "nav.about.history", href: "/about/history", subtitle: "HISTORY", description: "從草創至今，半世紀的山林故事與精神傳承。", descKey: "nav.about.history_desc" },
      { label: "社團特色與簡介", tKey: "nav.about.intro", href: "/about/introduction", subtitle: "INTRODUCTION", description: "了解我們的核心理念、社課規劃與獨特的社團氛圍。", descKey: "nav.about.intro_desc" },
      { label: "社團歷任幹部", tKey: "nav.about.presidents", href: "/about/presidents", subtitle: "PRESIDENTS", description: "向每一位曾為社團付出的幹部們致敬。", descKey: "nav.about.presidents_desc" },
      { label: "關於幹部與職責", tKey: "nav.about.committee", href: "/about/committee", subtitle: "COMMITTEE", description: "幹部分工與社團運作", descKey: "nav.about.committee_desc" },
    ]
  },
  { 
    label: "活動中心", 
    tKey: "common.events",
    href: "/events",
    subtitle: "EVENTS",
    description: "參與我們的每一次冒險，記錄山野間的點滴回憶。",
    descKey: "nav.events.desc",
    subItems: [
      { label: "活動列表", tKey: "nav.events.list", href: "/events/list", subtitle: "EVENT LIST", description: "近期即將展開的活動行程。", descKey: "nav.events.list_desc" },
      { label: "行事曆", tKey: "nav.events.calendar", href: "/events/calendar", subtitle: "CALENDAR", description: "學期的活動規劃與重要時程概覽。", descKey: "nav.events.calendar_desc" },
      { label: "歷史花絮", tKey: "nav.events.gallery", href: "/events/gallery", subtitle: "GALLERY", description: "珍貴的出隊照片與的山林回憶。", descKey: "nav.events.gallery_desc" },
      { label: "活動分級說明", tKey: "nav.events.levels", href: "/events/levels", subtitle: "LEVELS", description: "了解活動難度分級，找到最適合你的行程。", descKey: "nav.events.levels_desc" },
    ]
  },
  { 
    label: "裝備租借", 
    tKey: "common.equipment",
    href: "/equipment",
    subtitle: "EQUIPMENT",
    description: "社團登山裝備租借服務。",
    descKey: "nav.equipment.desc",
    subItems: [
      { label: "裝備瀏覽", tKey: "nav.equipment.browse", href: "/equipment/browse", subtitle: "BROWSE", description: "查看社團現有可外借裝備與庫存。", descKey: "nav.equipment.browse_desc" },
      { label: "我的租借單", tKey: "nav.equipment.cart", href: "/equipment/cart", subtitle: "CART", description: "管理您的租借清單，確認租借品項與費用。", descKey: "nav.equipment.cart_desc" },
    ]
  },
  { 
    label: "規章制度", 
    tKey: "common.rules",
    href: "/rules",
    subtitle: "RULES",
    description: "了解社團運作規範，共同維護良好的社團環境。",
    descKey: "nav.rules.desc",
    subItems: [
      { label: "我想成為社員！", tKey: "nav.rules.membership", href: "/rules/membership", subtitle: "MEMBERSHIP", description: "入社申請流程、權利義務與社員專屬優惠。", descKey: "nav.rules.membership_desc" },
      { label: "我想參與社團活動！", tKey: "nav.rules.joining", href: "/rules/joining", subtitle: "JOINING", description: "參與活動的報名須知、注意事項與規範。", descKey: "nav.rules.joining_desc" },
      { label: "租借規則與費用", tKey: "nav.rules.equipment_rules", href: "/rules/equipment", subtitle: "RENTAL RULES", description: "裝備維護責任、遺失損壞賠償與租借費用標準。", descKey: "nav.rules.equipment_rules_desc" },
      { label: "社辦使用規範", tKey: "nav.rules.room", href: "/rules/room", subtitle: "ROOM RULES", description: "社辦空間使用規範與公物使用準則。", descKey: "nav.rules.room_desc" },
      { label: "組織章程", tKey: "nav.rules.constitution", href: "/rules/constitution", subtitle: "CONSTITUTION", description: "臺科大登山社最高運作準則與章程細節。", descKey: "nav.rules.constitution_desc" },
    ]
  },
  { 
    label: "我的足跡", 
    tKey: "common.profile",
    href: "/profile",
    subtitle: "MY FOOTPRINT",
    description: "記錄您的山野歷程，查看個人資料與租借狀態。",
    descKey: "nav.profile.desc",
    subItems: [
      { label: "個人簡介", tKey: "profile.dashboard", href: "/profile", subtitle: "DASHBOARD", description: "您的數位簡介與社員身份資訊。", descKey: "nav.profile.dashboard_desc" },
      { label: "詳細資料", tKey: "profile.details", href: "/profile/details", subtitle: "DETAILS", description: "管理個人詳細資料。", descKey: "nav.profile.details_desc" },
      { label: "山岳足跡", tKey: "profile.peaks", href: "/profile/peaks", subtitle: "PEAKS", description: "點亮您走過的山岳紀錄。", descKey: "nav.profile.peaks_desc" },
      { label: "出團紀錄", tKey: "profile.records", href: "/profile/events", subtitle: "RECORDS", description: "回顧您參與過的社團出隊活動歷史。", descKey: "nav.profile.records_desc" },
      { label: "租借紀錄", tKey: "profile.rentals", href: "/profile/equipment", subtitle: "RENTALS", description: "查看裝備租借紀錄與歸還狀況。", descKey: "nav.profile.rentals_desc" },
      { label: "繳費紀錄", tKey: "profile.payments", href: "/profile/payments", subtitle: "PAYMENTS", description: "追蹤入社費、活動費與租借費用繳納狀況。", descKey: "nav.profile.payments_desc" },
    ]
  },
  { 
    label: "聯絡我們", 
    tKey: "common.contact",
    href: "/contact", 
    subtitle: "CONTACT US", 
    description: "無論是入社諮詢、活動報名或是器材租借問題，歡迎與我們聯繫。",
    descKey: "nav.contact.desc",
  },
];
