"use server";

import { headers } from "next/headers";
import { createRateLimiter } from "./rateLimit";
import {
  contactSchema,
  MIN_FILL_MS,
  type ContactErrorKey,
  type ContactInput,
  type ContactResult,
} from "./schema";

/** 10 dakikada IP başına 5 mesaj (plan T09). */
const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

/**
 * Demo: doğrular ve atar. Hiçbir alan saklanmaz, loglanmaz veya üçüncü tarafa gönderilmez.
 * Spam koruması: honeypot alanı + minimum doldurma süresi + IP bazlı rate limit.
 */
export async function sendContactAction(input: {
  values: unknown;
  website?: string;
  startedAt?: number;
}): Promise<ContactResult> {
  if (input.website) return { ok: false, error: "spam" };
  if (!input.startedAt || Date.now() - input.startedAt < MIN_FILL_MS)
    return { ok: false, error: "spam" };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allow(ip, Date.now())) return { ok: false, error: "rateLimited" };

  const parsed = contactSchema.safeParse(input.values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof ContactInput, ContactErrorKey>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string")
        fieldErrors[field as keyof ContactInput] ??= issue.message as ContactErrorKey;
    }
    return { ok: false, error: "validation", fieldErrors };
  }
  return { ok: true };
}
