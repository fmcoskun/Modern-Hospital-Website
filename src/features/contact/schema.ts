import { z } from "@/lib/zod";
import { DEMO_PHONE_RE, digitsOnly } from "@/features/appointments/schema";

export const TOPICS = ["general", "appointment", "feedback", "press", "corporate"] as const;
export type ContactErrorKey =
  "required" | "name" | "email" | "phone" | "contact" | "message" | "topic";

/** Aynı şema istemcide (RHF) ve sunucuda (Server Action) kullanılır. */
export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "name").max(80, "name"),
    email: z.union([z.literal(""), z.email("email").max(120, "email")]),
    phone: z.union([
      z.literal(""),
      z
        .string()
        .trim()
        .refine((v) => DEMO_PHONE_RE.test(digitsOnly(v)), "phone"),
    ]),
    topic: z.enum(TOPICS, "topic"),
    message: z.string().trim().min(10, "message").max(2000, "message"),
  })
  .refine((v) => v.email !== "" || v.phone !== "", { message: "contact", path: ["email"] });

export type ContactInput = z.input<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      error: "validation";
      fieldErrors: Partial<Record<keyof ContactInput, ContactErrorKey>>;
    }
  | { ok: false; error: "rateLimited" | "spam" | "server" };

/** Formun gösterilmesinden itibaren bu süreden önce gelen gönderimler bot kabul edilir. */
export const MIN_FILL_MS = 2500;
