export interface NavItem {
  label: string;
  href: string;
  subtitle?: string;
  description?: string;
  subItems?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  { label: "首頁", href: "/" },
  { 
    label: "關於山社", 
    href: "/about",
    subtitle: "ABOUT US",
    description: "探索台科大登山社的歷史傳承、社團特色與核心價值。",
    subItems: [
      { label: "社團簡史與傳承", href: "/about/history", subtitle: "HISTORY", description: "從草創至今，一甲子的山野故事與精神傳承。" },
      { label: "社團特色與簡介", href: "/about/introduction", subtitle: "INTRODUCTION", description: "了解我們的核心理念、社課規劃與獨特的社團氛圍。" },
      { label: "社團歷任幹部", href: "/about/presidents", subtitle: "PRESIDENTS", description: "向每一位曾為社團付出的帶領者致敬。" },
      { label: "關於幹部與職責", href: "/about/committee", subtitle: "COMMITTEE", description: "現任幹部團隊與社團運作的幕後英雄。" },
    ]
  },
  { 
    label: "活動中心", 
    href: "/events",
    subtitle: "EVENTS",
    description: "參與我們的每一次冒險，記錄山野間的點滴回憶。",
    subItems: [
      { label: "活動列表", href: "/events/list", subtitle: "EVENT LIST", description: "近期即將展開的登山、溯溪與攀岩行程。" },
      { label: "行事曆", href: "/events/calendar", subtitle: "CALENDAR", description: "全年度的活動規劃與重要時程概覽。" },
      { label: "歷史花絮", href: "/events/gallery", subtitle: "GALLERY", description: "珍貴的出隊照片與社員們的山野足跡。" },
      { label: "活動分級說明", href: "/events/levels", subtitle: "LEVELS", description: "了解活動難度分級，找到最適合你的行程。" },
    ]
  },
  { 
    label: "裝備瀏覽", 
    href: "/equipment",
    subtitle: "EQUIPMENT",
    description: "專業登山裝備租借服務，工欲善其事，必先利其器。",
    subItems: [
      { label: "裝備瀏覽", href: "/equipment/browse", subtitle: "BROWSE", description: "查看社團現有器材規格、庫存與租借狀況。" },
      { label: "我的租借單", href: "/equipment/cart", subtitle: "CART", description: "管理您的預約清單，確認租借品項與費用。" },
    ]
  },
  { 
    label: "規章制度", 
    href: "/rules",
    subtitle: "RULES",
    description: "了解社團運作規範，共同維護良好的社團環境。",
    subItems: [
      { label: "我想成為社員！", href: "/rules/membership", subtitle: "MEMBERSHIP", description: "入社申請流程、權利義務與社員專屬優惠。" },
      { label: "我想參與社團活動！", href: "/rules/joining", subtitle: "JOINING", description: "非社員參與活動的報名須知與安全規範。" },
      { label: "租借規則與費用", href: "/rules/equipment", subtitle: "RENTAL RULES", description: "裝備維護責任、遺失損壞賠償與租借費用標準。" },
      { label: "社辦使用規範", href: "/rules/room", subtitle: "ROOM RULES", description: "社辦空間維護、開放時間與公物使用準則。" },
      { label: "組織章程", href: "/rules/constitution", subtitle: "CONSTITUTION", description: "台科大登山社最高運作準則與章程細節。" },
    ]
  },
  { 
    label: "我的足跡", 
    href: "/profile",
    subtitle: "MY FOOTPRINT",
    description: "記錄您的山野歷程，查看個人資料與租借狀態。",
    subItems: [
      { label: "個人簡介", href: "/profile", subtitle: "DASHBOARD", description: "您的數位山野足跡與社員身份資訊。" },
      { label: "詳細資料", href: "/profile/details", subtitle: "DETAILS", description: "管理個人聯繫資訊與登山經驗記錄。" },
      { label: "山岳足跡", href: "/profile/peaks", subtitle: "PEAKS", description: "點亮您登頂過的百岳與郊山紀錄。" },
      { label: "出團紀錄", href: "/profile/events", subtitle: "RECORDS", description: "回顧您參與過的社團出隊活動歷史。" },
      { label: "租借紀錄", href: "/profile/equipment", subtitle: "RENTALS", description: "查看過往的裝備租借紀錄與歸還狀況。" },
    ]
  },
  { 
    label: "聯絡我們", 
    href: "/contact", 
    subtitle: "CONTACT US", 
    description: "無論是入社諮詢、活動合作或是器材租借問題，歡迎與我們聯繫。" 
  },
];
