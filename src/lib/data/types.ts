export type * from "./schemas";

/** Hesaplanan, saklanmayan randevu aralığı. `startsAt` UTC ISO. */
export interface Slot {
  doctorId: string;
  branchId: string;
  departmentId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
}

export interface DoctorFilter {
  q?: string;
  departmentSlug?: string;
  branchSlug?: string;
  language?: string;
  interest?: string;
}

export interface SlotQuery {
  departmentId: string;
  branchId: string;
  doctorId?: string;
  /** Dahil, YYYY-MM-DD (Europe/Istanbul). */
  fromDate: string;
  days: number;
  now: Date;
}

/** Yalnız tip — demoda hiçbir yerde saklanmaz (plan 8.2). */
export interface Appointment {
  code: string;
  doctorId?: string;
  departmentId: string;
  branchId: string;
  startsAt: string;
  endsAt: string;
  status: "requested" | "confirmed" | "cancelled" | "completed" | "no_show";
  channel: "web" | "phone";
}
