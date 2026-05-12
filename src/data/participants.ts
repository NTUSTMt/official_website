export interface Participant {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  studentId: string;
  phone: string;
  status: "PENDING" | "ADMITTED" | "WAITLISTED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "VERIFYING";
  signupDate: string;
}

export const mockParticipants: Participant[] = [
  {
    id: "reg-001",
    eventId: "yushan-2026-06",
    userId: "user-001",
    name: "高山青",
    studentId: "B10802001",
    phone: "0912-345-678",
    status: "ADMITTED",
    paymentStatus: "PAID",
    signupDate: "2026-05-10",
  },
  {
    id: "reg-002",
    eventId: "yushan-2026-06",
    userId: "user-002",
    name: "林小華",
    studentId: "B10905032",
    phone: "0988-123-456",
    status: "PENDING",
    paymentStatus: "UNPAID",
    signupDate: "2026-05-11",
  },
  {
    id: "reg-003",
    eventId: "yushan-2026-06",
    userId: "user-003",
    name: "張大山",
    studentId: "B11003021",
    phone: "0977-654-321",
    status: "WAITLISTED",
    paymentStatus: "UNPAID",
    signupDate: "2026-05-12",
  },
  {
    id: "reg-004",
    eventId: "north-peak-2026-07",
    userId: "user-001",
    name: "高山青",
    studentId: "B10802001",
    phone: "0912-345-678",
    status: "PENDING",
    paymentStatus: "VERIFYING",
    signupDate: "2026-05-12",
  },
];
