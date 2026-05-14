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

export const mockParticipants: Participant[] = [];
