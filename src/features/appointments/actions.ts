"use server";

import { randomInt } from "node:crypto";
import { data, type Slot } from "@/lib/data";
import { istanbulDate } from "@/lib/data/slots";
import { env } from "@/lib/env";
import {
  createAppointmentSchema,
  slotRequestSchema,
  type CreateAppointmentResult,
  type PatientErrorKey,
  type PatientInput,
} from "./schema";

const DAYS = 14;

export async function getSlotsAction(
  input: unknown,
): Promise<{ ok: true; slots: Slot[] } | { ok: false }> {
  const parsed = slotRequestSchema.safeParse(input);
  if (!parsed.success) return { ok: false };
  const now = new Date();
  const slots = await data.appointments.getSlots({
    ...parsed.data,
    fromDate: istanbulDate(now),
    days: DAYS,
    now,
  });
  return { ok: true, slots };
}

/** Kafa karıştırmayan karakterlerle (0/O, 1/I yok) tahmin edilemez randevu kodu. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const newCode = () =>
  `FMC-${Array.from({ length: 8 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")}`;

/**
 * İdempotency: aynı anahtarla gelen tekrar istekler aynı sonucu alır (çift tıklama koruması).
 * Yalnız sonuç (kod + slot) tutulur; hasta bilgisi hiçbir yerde saklanmaz veya loglanmaz.
 */
const results = new Map<string, CreateAppointmentResult>();
const MAX_KEYS = 500;

export async function createAppointmentAction(input: unknown): Promise<CreateAppointmentResult> {
  const parsed = createAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof PatientInput, PatientErrorKey>> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === "patient" && typeof issue.path[1] === "string") {
        fieldErrors[issue.path[1] as keyof PatientInput] ??= issue.message as PatientErrorKey;
      }
    }
    // Hasta alanı dışındaki şema hataları (ör. sahte slot) genel hata olarak döner.
    return Object.keys(fieldErrors).length
      ? { ok: false, error: "validation", fieldErrors }
      : { ok: false, error: "server" };
  }

  const { idempotencyKey, departmentId, branchId, doctorId, startsAt } = parsed.data;
  const previous = results.get(idempotencyKey);
  if (previous) return previous;

  const now = new Date();
  const available = await data.appointments.isSlotAvailable(
    { departmentId, branchId, doctorId, startsAt },
    now,
  );
  // Gerçek sistemde eşzamanlı rezervasyon; demoda yapılandırılabilir olasılıkla simüle edilir (plan 5.2).
  const simulatedConflict = Math.random() < env.APPOINTMENT_CONFLICT_RATE;

  let result: CreateAppointmentResult;
  if (!available || simulatedConflict) {
    result = { ok: false, error: "conflict" };
  } else {
    const slot = (
      await data.appointments.getSlots({
        departmentId,
        branchId,
        doctorId,
        fromDate: istanbulDate(new Date(startsAt)),
        days: 1,
        now,
      })
    ).find((s) => s.startsAt === startsAt);
    result = slot
      ? {
          ok: true,
          code: newCode(),
          startsAt,
          endsAt: slot.endsAt,
          doctorId,
          branchId,
          departmentId,
        }
      : { ok: false, error: "conflict" };
  }

  if (results.size >= MAX_KEYS) results.delete(results.keys().next().value!);
  results.set(idempotencyKey, result);
  return result;
}
