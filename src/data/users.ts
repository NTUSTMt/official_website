import { UserProfile } from "./profile";

export interface UserSummary extends UserProfile {
  id: string;
  isVerified: boolean;
  joinDate: string;
}

export const mockUsers: UserSummary[] = [
  {
    id: "user-001",
    name: "高山青",
    avatar: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "喜愛獨自攀爬百岳，探索未知的稜線。",
    memberId: "#8512",
    isVerified: true,
    joinDate: "2023-09-01",
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
  },
  {
    id: "user-002",
    name: "林小華",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200",
    bio: "新手上路，請多多指教！",
    memberId: "#8513",
    isVerified: false,
    joinDate: "2026-05-11",
    details: {
      realName: "林小華",
      gender: "女",
      birthDate: "2003-11-15",
      isCitizen: true,
      idType: "身分證",
      idNumber: "F298765432",
      phone: "0988-123-456",
      email: "hua.h@example.com",
      address: "新北市板橋區...",
      studentId: "B10905032",
      lineId: "hua_lin",
      emergencyContact: {
        name: "林爸爸",
        phone: "0911-222-333",
        relationship: "父女",
        address: "同上",
      },
    },
  },
];
