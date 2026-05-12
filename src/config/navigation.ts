export interface NavItem {
  label: string;
  href: string;
  subItems?: NavItem[];
}

export const navigationConfig: NavItem[] = [
  { label: "首頁", href: "/" },
  { 
    label: "關於山社", 
    href: "/about",
    subItems: [
      { label: "社團簡史與傳承", href: "/about/history" },
      { label: "社團特色與簡介", href: "/about/introduction" },
      { label: "社團歷任幹部", href: "/about/presidents" },
      { label: "關於幹部與職責", href: "/about/committee" },
    ]
  },
  { 
    label: "活動中心", 
    href: "/events",
    subItems: [
      { label: "活動列表", href: "/events/list" },
      { label: "行事曆", href: "/events/calendar" },
      { label: "歷史花絮", href: "/events/gallery" },
      { label: "活動分級說明", href: "/events/levels" },
    ]
  },
  { 
    label: "裝備租借", 
    href: "/equipment",
    subItems: [
      { label: "裝備瀏覽", href: "/equipment/browse" },
      { label: "我的租借單", href: "/equipment/cart" },
    ]
  },
  { 
    label: "規章制度", 
    href: "/rules",
    subItems: [
      { label: "我想成為社員！", href: "/rules/membership" },
      { label: "我想參與社團活動！", href: "/rules/joining" },
      { label: "租借規則與費用", href: "/rules/equipment" },
      { label: "社辦使用規範", href: "/rules/room" },
      { label: "組織章程", href: "/rules/constitution" },
    ]
  },
  { 
    label: "我的足跡", 
    href: "/profile",
    subItems: [
      { label: "個人簡介", href: "/profile" },
      { label: "詳細資料", href: "/profile/details" },
      { label: "出團紀錄", href: "/profile/events" },
      { label: "租借紀錄", href: "/profile/equipment" },
    ]
  },
];
