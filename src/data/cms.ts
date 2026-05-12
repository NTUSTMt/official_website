export interface GlobalConfig {
  siteName: string;
  heroTagline: string;
  heroSubtext: string;
  stats: {
    expeditions: string;
    members: string;
    years: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    link: string;
  };
  fees: {
    membershipFee: number;
    accountNumber: string;
    bankCode: string;
    bankName: string;
  };
  officeHours: string;
}

export const mockCMSConfig: GlobalConfig = {
  siteName: "台科大登山社",
  heroTagline: "EXPLORE THE UNKNOWN",
  heroSubtext: "與我們一起探索台灣百岳的壯麗，挑戰自我，尋找群山中的歸屬感。",
  stats: {
    expeditions: "450+",
    members: "1200+",
    years: "45+",
  },
  announcement: {
    enabled: true,
    text: "🔥 113學年度下學期新血招募說明會將於 2/25 舉辦，點此報名！",
    link: "/events/recruitment-113",
  },
  fees: {
    membershipFee: 1500,
    bankCode: "700",
    bankName: "中華郵政",
    accountNumber: "0001234-5678901",
  },
  officeHours: "週一至週五 18:30 - 21:00",
};
