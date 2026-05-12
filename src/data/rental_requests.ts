export interface RentalRequest {
  id: string;
  userId: string;
  userName: string;
  userType: "MEMBER" | "NON_MEMBER";
  isClubEvent: boolean;
  items: {
    equipmentId: string;
    name: string;
    qty: number;
  }[];
  startDate: string;
  endDate: string;
  totalFee: string;
  status: "PENDING" | "APPROVED" | "PICKED_UP" | "RETURNED" | "CANCELLED";
  requestDate: string;
  notes?: string;
}

export const mockRentalRequests: RentalRequest[] = [
  {
    id: "REQ-2026-001",
    userId: "user-001",
    userName: "高山青",
    userType: "MEMBER",
    isClubEvent: true,
    items: [
      { equipmentId: "backpack-large", name: "大背包", qty: 1 },
      { equipmentId: "trekking-pole", name: "登山杖", qty: 2 }
    ],
    startDate: "2026-06-14",
    endDate: "2026-06-17",
    totalFee: "NT$ 0 (社團活動免收)",
    status: "PENDING",
    requestDate: "2026-05-12",
    notes: "玉山單攻活動借用",
  },
  {
    id: "REQ-2026-002",
    userId: "user-005",
    userName: "李小明",
    userType: "NON_MEMBER",
    isClubEvent: false,
    items: [
      { equipmentId: "tent-4p", name: "四人帳", qty: 1 }
    ],
    startDate: "2026-05-20",
    endDate: "2026-05-22",
    totalFee: "NT$ 600",
    status: "APPROVED",
    requestDate: "2026-05-10",
  },
  {
    id: "REQ-2026-003",
    userId: "user-003",
    userName: "張大山",
    userType: "MEMBER",
    isClubEvent: false,
    items: [
      { equipmentId: "stove-01", name: "蜘蛛爐/攻頂爐", qty: 1 }
    ],
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    totalFee: "NT$ 100",
    status: "RETURNED",
    requestDate: "2026-04-28",
  }
];
