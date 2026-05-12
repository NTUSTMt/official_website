export interface EventItem {
  id: string;
  title: string;
  date: string;
  calendarDates: string[]; // ISO format YYYY-MM-DD
  difficulty: "入門" | "初級" | "中級" | "進階" | "挑戰";
  cost: string;
  status: "open" | "closed" | "upcoming";
  coverImage: string;
  summary: string;
  description: string[];
  itinerary?: { time: string; activity: string }[];
  requirements?: string[];
  signupUrl?: string;
  tags?: string[];
}

export interface DifficultyLevel {
  level: number;
  label: string;
  description: string;
  example: string;
  color: string;
}

export interface EventGallery {
  id: string;
  eventTitle: string;
  date: string;
  coverImage: string;
  images: { src: string; caption: string }[];
}

export const difficultyLevels: DifficultyLevel[] = [
  {
    level: 1,
    label: "入門",
    description: "適合無經驗者，步道平緩，當天往返。",
    example: "陽明山大屯山系、象山步道",
    color: "bg-emerald-500"
  },
  {
    level: 2,
    label: "初級",
    description: "需基礎體能，含輕裝多日行程或較長陡坡。",
    example: "雪山東峰、合歡群峰",
    color: "bg-cyan-500"
  },
  {
    level: 3,
    label: "中級",
    description: "需良好體能，路況多變，含重裝宿營。",
    example: "玉山主峰、嘉明湖",
    color: "bg-orange-500"
  },
  {
    level: 4,
    label: "進階",
    description: "高強度行程，含斷崖、攀岩或長距離縱走。",
    example: "大霸尖山、南湖大山",
    color: "bg-red-500"
  },
  {
    level: 5,
    label: "挑戰",
    description: "極高難度，需具備專業技術與卓越耐力。",
    example: "中央尖山、干卓萬縱走",
    color: "bg-purple-600"
  }
];

export const eventsData: EventItem[] = [
  {
    id: "yushan-2026-06",
    title: "玉山主峰單攻",
    date: "2026/06/15",
    calendarDates: ["2026-06-15"],
    difficulty: "中級",
    cost: "NT$ 2,500",
    status: "open",
    coverImage: "/images/events/yushan-placeholder.jpg",
    summary: "挑戰台灣最高峰，一日往返主峰之巔。",
    description: [
      "玉山主峰海拔3952公尺，為台灣第一高峰。",
      "本行程採單攻形式，需具備良好體能與高山經驗。",
      "我們將從塔塔加登山口出發，經排雲山莊抵達頂峰。"
    ],
    itinerary: [
      { time: "02:00", activity: "塔塔加登山口出發" },
      { time: "07:00", activity: "抵達排雲山莊" },
      { time: "10:30", activity: "登頂玉山主峰" },
      { time: "17:00", activity: "回到登山口" }
    ],
    requirements: ["具備3000公尺以上高山經驗", "良好心肺耐力", "需參加行前訓練"],
    signupUrl: "https://forms.gle/placeholder",
    tags: ["百岳", "單攻", "最高峰"]
  },
  {
    id: "snow-mountain-2026-04",
    title: "雪山東峰迎新",
    date: "2026/04/20",
    calendarDates: ["2026-04-20"],
    difficulty: "初級",
    cost: "NT$ 1,200",
    status: "closed",
    coverImage: "/images/events/snow-placeholder.jpg",
    summary: "迎接新團員，在雪山山脈感受高山魅力。",
    description: [
      "雪山東峰是入門百岳的首選之一。",
      "沿途經過著名的哭坡，視野遼闊。",
      "這是一個輕鬆且愉快的迎新登山活動。"
    ],
    signupUrl: "https://forms.gle/placeholder",
    tags: ["迎新", "百岳", "新手推薦"]
  },
  {
    id: "north-peak-2026-07",
    title: "奇萊北峰三日",
    date: "2026/07/10-12",
    calendarDates: ["2026-07-10", "2026-07-11", "2026-07-12"],
    difficulty: "進階",
    cost: "NT$ 4,800",
    status: "upcoming",
    coverImage: "/images/events/qilai-placeholder.jpg",
    summary: "深入奇萊山脈，感受黑色奇萊的震撼美景。",
    description: [
      "奇萊北峰以險峻著稱，山勢雄偉。",
      "我們將在小奇萊與成功山屋宿營。",
      "需具備基本攀爬技巧與重裝體能。"
    ],
    tags: ["百岳", "宿營", "險峻"]
  }
];

export const galleryData: EventGallery[] = [
  {
    id: "gal-001",
    eventTitle: "合歡山追雪",
    date: "2026/01/15",
    coverImage: "/images/gallery/snow-hike.jpg",
    images: [
      { src: "/images/gallery/snow-1.jpg", caption: "合歡山莊前的銀白世界" },
      { src: "/images/gallery/snow-2.jpg", caption: "勇敢的社員們在雪中合影" }
    ]
  },
  {
    id: "gal-002",
    eventTitle: "北大武山縱走",
    date: "2025/11/05",
    coverImage: "/images/gallery/mountain-cloud.jpg",
    images: [
      { src: "/images/gallery/cloud-1.jpg", caption: "北大武著名的雲海景觀" }
    ]
  }
];
