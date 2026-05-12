export interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
  memberId: string;
  details: {
    realName: string;
    gender: string;
    birthDate: string;
    isCitizen: boolean;
    idType: string;
    idNumber: string;
    phone: string;
    email: string;
    address: string;
    studentId: string;
    lineId: string;
    emergencyContact: {
      name: string;
      phone: string;
      relationship: string;
      address: string;
    };
  };
}

export interface ExpeditionRecord {
  id: string;
  activityId: string;
  title: string;
  date: string;
  status: "ADMITTED" | "WAITLISTED" | "COMPLETED" | "CANCELLED";
  role: string;
}

export interface RentalRecord {
  id: string;
  itemName: string;
  startDate: string;
  endDate: string;
  status: "RENTING" | "RETURNED" | "OVERDUE";
  fee: string;
}

export const mockUserProfile: UserProfile = {
  name: "山林冒險者",
  avatar: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=200&h=200",
  bio: "喜愛獨自攀爬百岳，探索未知的稜線。目前正朝著完攀百岳的目標前進中。",
  memberId: "#8512",
  details: {
    realName: "高山青",
    gender: "男",
    birthDate: "1995-05-20",
    isCitizen: true,
    idType: "身分證",
    idNumber: "A123456789",
    phone: "0912-345-678",
    email: "mountain.lover@example.com",
    address: "台北市大安區基隆路四段 43 號",
    studentId: "B10802001",
    lineId: "mountain_explorer_123",
    emergencyContact: {
      name: "林小姐",
      phone: "0988-765-432",
      relationship: "配偶",
      address: "台北市信義區和平東路三段",
    },
  },
};

export const mockExpeditions: ExpeditionRecord[] = [
  {
    id: "exp-001",
    activityId: "yushan-2024",
    title: "玉山主北峰二日從容行",
    date: "2024-06-15",
    status: "ADMITTED",
    role: "隊員",
  },
  {
    id: "exp-002",
    activityId: "shei-pa-2024",
    title: "雪山主東峰三日計畫",
    date: "2024-07-10",
    status: "WAITLISTED",
    role: "隊員",
  },
  {
    id: "exp-003",
    activityId: "nanhu-2023",
    title: "南湖大山四日經典賽",
    date: "2023-11-20",
    status: "COMPLETED",
    role: "副隊長",
  },
];

export const mockRentals: RentalRecord[] = [
  {
    id: "rent-001",
    itemName: "Mystery Ranch 輕量登山背包 (65L)",
    startDate: "2024-06-14",
    endDate: "2024-06-17",
    status: "RENTING",
    fee: "NT$ 450",
  },
  {
    id: "rent-002",
    itemName: "Snow Peak 四人帳篷",
    startDate: "2023-11-19",
    endDate: "2023-11-23",
    status: "RETURNED",
    fee: "NT$ 800",
  },
];
