export interface Announcement {
  id: string;
  enabled: boolean;
  text: string;
  link: string;
}

export interface GlobalConfig {
  siteName: string;
  heroTagline: string;
  heroSubtext: string;
  stats: {
    expeditions: string;
    members: string;
    years: string;
  };
  announcements: Announcement[];
  fees: {
    membershipFee: number;
    accountNumber: string;
    bankCode: string;
    bankName: string;
  };
  officeHours: string;
  introduction: string;
  slogan: string;
  sloganLabel: string;
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
  announcements: [
    {
      id: "recruit-113",
      enabled: true,
      text: "🔥 113學年度下學期新血招募說明會將於 2/25 舉辦，點此報名！",
      link: "/events/recruitment-113",
    }
  ],
  fees: {
    membershipFee: 1500,
    bankCode: "700",
    bankName: "中華郵政",
    accountNumber: "0001234-5678901",
  },
  officeHours: "週一至週五 18:30 - 21:00",
  introduction: "來山社，賞山色，與山為伴，與我們同樂\n\n----------\n\n台科大登山社於1979年創立至今，每學期開設大量精彩的登山戶外活動，為凝聚與傳承台科大登山人的交流天地，同時以專業領隊嚮導的培訓為目標!\n\n歡迎加入我們~ 來這裡跟我們一起上山、一起瘋享青春、一起創造精彩ㄉ大學生活!",
  slogan: "登山不是為了征服山，實是為了在山的懷抱中，學會謙卑與誠實",
  sloganLabel: "Wilderness_Philosophy",
};
