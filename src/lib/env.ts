import "server-only";
import { z } from "@/lib/zod";

const boolish = z
  .enum(["true", "false"])
  .default("true")
  .transform((v) => v === "true");

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  DATA_SOURCE: z.enum(["mock", "api"]).default("mock"),
  DEMO_MODE: boolish,
  APPOINTMENT_CONFLICT_RATE: z.coerce.number().min(0).max(1).default(0.05),
});

export const env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  DATA_SOURCE: process.env.DATA_SOURCE,
  DEMO_MODE: process.env.DEMO_MODE,
  APPOINTMENT_CONFLICT_RATE: process.env.APPOINTMENT_CONFLICT_RATE,
});
