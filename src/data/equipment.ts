export type EquipmentCategory = "炊事系統" | "營帳系統" | "睡眠系統" | "行進裝備" | "技術裝備";

export interface EquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  quantity: number;
  availableQty: number;
  details?: string;
  notes?: string;
  image?: string;
  isRentable: boolean;
  isMemberOnly?: boolean;
  pricing?: {
    base2Days: number;
    perExtraDay: number;
  };
}

export const rentalRules = [
  "1. 裝備器材出借以用於本社團活動者優先",
  "2. 租借費用請見費用試算（用於社團活動目前免費）",
  "3. 出借的器材於活動結束後一星期內歸還，並請於歸還前做好清潔 (含清除明顯髒污、晾乾)",
  "4. 如有損壞，請同樣先與幹部聯絡後至約定地點歸還，我們會依損壞情況決定如何處理",
  "5. 如有遺失，請自行尋回，否則照原價賠償",
  "6. 攀岩與雪地技術裝備（如冰斧、岩盔）非社員不予租借",
  "7. 借用期限通常為 14 天，超過請主動聯絡幹部",
];

export const equipmentData: EquipmentItem[] = [
  // 炊事系統
  {
    id: "stove-01",
    name: "蜘蛛爐/攻頂爐",
    category: "炊事系統",
    quantity: 4,
    availableQty: 4,
    details: "大蜘蛛爐*1 / 小蜘蛛爐*1 / 中盤式爐*1 / 小攻頂爐*1",
    isRentable: true,
    pricing: { base2Days: 100, perExtraDay: 50 }
  },
  {
    id: "water-bag-01",
    name: "水袋 8L",
    category: "炊事系統",
    quantity: 2,
    availableQty: 2,
    isRentable: true,
    pricing: { base2Days: 150, perExtraDay: 0 }
  },
  
  // 營帳系統
  {
    id: "tent-pyramid",
    name: "金字塔帳",
    category: "營帳系統",
    quantity: 2,
    availableQty: 2,
    details: "含所有零件，輕量化首選",
    notes: "其中一頂延伸桿缺卡扣",
    isRentable: true,
    pricing: { base2Days: 600, perExtraDay: 100 }
  },
  {
    id: "tent-4p",
    name: "四人帳",
    category: "營帳系統",
    quantity: 2,
    availableQty: 2,
    details: "含營柱營釘",
    isRentable: true,
    pricing: { base2Days: 600, perExtraDay: 100 }
  },
  {
    id: "ground-sheet",
    name: "地墊",
    category: "營帳系統",
    quantity: 6,
    availableQty: 6,
    details: "2個一般 / 4個帆布 3*3",
    isRentable: true,
    pricing: { base2Days: 100, perExtraDay: 50 }
  },

  // 睡眠系統
  {
    id: "sleeping-bag-down",
    name: "羽絨睡袋",
    category: "睡眠系統",
    quantity: 3,
    availableQty: 3,
    details: "保暖度高，體積偏大",
    isRentable: true,
    pricing: { base2Days: 150, perExtraDay: 50 }
  },
  {
    id: "sleeping-bag-synthetic",
    name: "化纖睡袋",
    category: "睡眠系統",
    quantity: 1,
    availableQty: 1,
    isRentable: true,
    pricing: { base2Days: 100, perExtraDay: 50 }
  },
  {
    id: "sleeping-pad-foil",
    name: "鋁箔睡墊",
    category: "睡眠系統",
    quantity: 1,
    availableQty: 1,
    isRentable: true,
    pricing: { base2Days: 30, perExtraDay: 10 }
  },
  {
    id: "sleeping-pad-egg",
    name: "蛋殼睡墊",
    category: "睡眠系統",
    quantity: 2,
    availableQty: 2,
    isRentable: true,
    pricing: { base2Days: 50, perExtraDay: 20 }
  },

  // 行進裝備
  {
    id: "backpack-large",
    name: "大背包",
    category: "行進裝備",
    quantity: 5,
    availableQty: 5,
    details: "各容量重裝背包",
    isRentable: true,
    pricing: { base2Days: 100, perExtraDay: 50 }
  },
  {
    id: "trekking-pole",
    name: "登山杖",
    category: "行進裝備",
    quantity: 5,
    availableQty: 5,
    isRentable: true,
    pricing: { base2Days: 50, perExtraDay: 10 }
  },

  // 技術裝備
  {
    id: "ice-axe",
    name: "冰斧",
    category: "技術裝備",
    quantity: 2,
    availableQty: 2,
    isRentable: true,
    isMemberOnly: true,
    pricing: { base2Days: 0, perExtraDay: 0 } // 社員限定通常免費或需諮詢
  },
  {
    id: "helmet",
    name: "岩盔",
    category: "技術裝備",
    quantity: 10,
    availableQty: 10,
    isRentable: true,
    isMemberOnly: true,
    pricing: { base2Days: 0, perExtraDay: 0 }
  }
];
