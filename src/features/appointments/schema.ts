import { z } from "@/lib/zod";

/**
 * İstemci (React Hook Form) ve sunucu (Server Action) aynı şemayı kullanır (plan 7.3).
 * Mesajlar sözlük anahtarlarıdır; UI tarafında çevrilir.
 */
export type PatientErrorKey = "required" | "name" | "phone" | "email" | "birthYear" | "consent";

const nameRe = /^[\p{L}][\p{L} .'-]{1,49}$/u;
/** Demo modunda yalnız açıkça kurgusal numara: 0 (500) 000 xx xx — gerçek numara girilmesini önler. */
export const DEMO_PHONE_RE = /^0?500000\d{4}$/;

export const digitsOnly = (v: string) => v.replace(/\D/g, "");

export const patientSchema = z.object({
  firstName: z.string().trim().min(1, "required").regex(nameRe, "name"),
  lastName: z.string().trim().min(1, "required").regex(nameRe, "name"),
  phone: z
    .string()
    .trim()
    .min(1, "required")
    .refine((v) => DEMO_PHONE_RE.test(digitsOnly(v)), "phone"),
  email: z.union([z.literal(""), z.email("email").max(120, "email")]),
  birthYear: z
    .string()
    .trim()
    .min(1, "required")
    .refine((v) => {
      const n = Number(v);
      return Number.isInteger(n) && n >= 1900 && n <= new Date().getFullYear();
    }, "birthYear"),
  consent: z.literal(true, "consent"),
});

export type PatientInput = z.input<typeof patientSchema>;

const id = z.string().min(1).max(40);

export const slotRequestSchema = z.object({
  departmentId: id,
  branchId: id,
  doctorId: id.optional(),
});

export const createAppointmentSchema = z
  .object({
    idempotencyKey: z.uuid(),
    departmentId: id,
    branchId: id,
    doctorId: id,
    startsAt: z.iso.datetime(),
    patient: patientSchema,
  })
  .strict();

export type CreateAppointmentInput = z.input<typeof createAppointmentSchema>;

export type CreateAppointmentResult =
  | {
      ok: true;
      code: string;
      startsAt: string;
      endsAt: string;
      doctorId: string;
      branchId: string;
      departmentId: string;
    }
  | {
      ok: false;
      error: "validation";
      fieldErrors: Partial<Record<keyof PatientInput, PatientErrorKey>>;
    }
  | { ok: false; error: "conflict" | "server" };
