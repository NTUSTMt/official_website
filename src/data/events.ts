export interface EventItem {
  id: string;
  title: string;
  date: string;
  difficulty: "入門" | "初級" | "中級" | "進階" | "挑戰";
  cost: string;
  status: "open" | "closed" | "upcoming";
  coverImage: string;
  summary: string;
  registrationDeadline?: string;
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

export const eventsData: EventItem[] = [];

export const galleryData: EventGallery[] = [];
