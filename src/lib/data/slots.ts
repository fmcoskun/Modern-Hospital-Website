import type { DoctorSchedule, ScheduleException, Slot } from "./types";

/**
 * Türkiye 2016'dan beri kalıcı UTC+3 kullanır (DST yok varsayımı, plan A2).
 * Yerel tarih/saat → UTC dönüşümü bu sabit ofsetle yapılır.
 */
export const ISTANBUL_OFFSET = "+03:00";
const DAY_MS = 86_400_000;

export function toUtcIso(date: string, time: string): string {
  return new Date(`${date}T${time}:00${ISTANBUL_OFFSET}`).toISOString();
}

/** Bir anın İstanbul yerel tarihini YYYY-MM-DD olarak verir. */
export function istanbulDate(at: Date): string {
  return new Date(at.getTime() + 3 * 3_600_000).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

/** ISO hafta günü: Pazartesi 1 … Pazar 7. */
export function isoWeekday(date: string): number {
  const d = new Date(`${date}T00:00:00Z`).getUTCDay();
  return d === 0 ? 7 : d;
}

function minutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function hhmm(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Deterministik 0–1 sayı (FNV-1a). Demo doluluk işaretlemesi için tohumlu "rastgelelik". */
export function seededUnit(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) / 0xffffffff;
}

export interface GenerateSlotsInput {
  schedules: DoctorSchedule[];
  exceptions: ScheduleException[];
  /** Slot dolu mu? Gerçek sistemde randevu tablosundan, demoda tohumlu yüklemden gelir. */
  isBooked: (doctorId: string, startsAt: string) => boolean;
  fromDate: string;
  days: number;
  now: Date;
}

/**
 * Saf fonksiyon: kural − istisna − dolu − geçmiş = slotlar.
 * Geçmiş saatler ve izin günleri hiç üretilmez; dolu slotlar `available: false` ile döner.
 */
export function generateSlots({
  schedules,
  exceptions,
  isBooked,
  fromDate,
  days,
  now,
}: GenerateSlotsInput): Slot[] {
  const off = new Set(
    exceptions.filter((e) => e.type !== "extra").map((e) => `${e.doctorId}|${e.date}`),
  );
  const slots: Slot[] = [];

  for (let i = 0; i < days; i++) {
    const date = addDays(fromDate, i);
    const weekday = isoWeekday(date);
    for (const s of schedules) {
      if (s.weekday !== weekday || off.has(`${s.doctorId}|${date}`)) continue;
      for (
        let t = minutes(s.startTime);
        t + s.slotMinutes <= minutes(s.endTime);
        t += s.slotMinutes
      ) {
        const startsAt = toUtcIso(date, hhmm(t));
        if (Date.parse(startsAt) <= now.getTime()) continue;
        slots.push({
          doctorId: s.doctorId,
          branchId: s.branchId,
          departmentId: s.departmentId,
          startsAt,
          endsAt: toUtcIso(date, hhmm(t + s.slotMinutes)),
          available: !isBooked(s.doctorId, startsAt),
        });
      }
    }
  }
  return slots.sort(
    (a, b) => a.startsAt.localeCompare(b.startsAt) || a.doctorId.localeCompare(b.doctorId),
  );
}

/** Demo doluluk: slotların ~%40'ı, slot anahtarına göre deterministik olarak dolu. */
export const demoIsBooked = (doctorId: string, startsAt: string) =>
  seededUnit(`${doctorId}|${startsAt}`) < 0.4;
