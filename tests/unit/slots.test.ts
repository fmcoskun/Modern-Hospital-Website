import { describe, expect, it } from "vitest";
import { addDays, generateSlots, istanbulDate, isoWeekday, toUtcIso } from "@/lib/data/slots";
import type { DoctorSchedule } from "@/lib/data/types";

const monday = "2027-01-04";
const schedule = (over: Partial<DoctorSchedule> = {}): DoctorSchedule => ({
  doctorId: "doc-a",
  branchId: "br-1",
  departmentId: "d-1",
  weekday: 1,
  startTime: "09:00",
  endTime: "10:00",
  slotMinutes: 20,
  ...over,
});
const base = {
  exceptions: [],
  isBooked: () => false,
  fromDate: monday,
  days: 7,
  now: new Date("2026-12-01T00:00:00Z"),
};

describe("tarih yardımcıları", () => {
  it("İstanbul saati UTC+3", () => {
    expect(toUtcIso("2027-01-04", "09:00")).toBe("2027-01-04T06:00:00.000Z");
    expect(istanbulDate(new Date("2027-01-04T22:30:00Z"))).toBe("2027-01-05");
  });
  it("hafta günü ve gün ekleme", () => {
    expect(isoWeekday(monday)).toBe(1);
    expect(isoWeekday("2027-01-10")).toBe(7);
    expect(addDays("2027-01-31", 1)).toBe("2027-02-01");
  });
});

describe("generateSlots", () => {
  it("kuraldan slot üretir; slot bitişi kural bitişini aşmaz", () => {
    const slots = generateSlots({ ...base, schedules: [schedule({ endTime: "10:10" })] });
    expect(slots.map((s) => s.startsAt)).toEqual([
      "2027-01-04T06:00:00.000Z",
      "2027-01-04T06:20:00.000Z",
      "2027-01-04T06:40:00.000Z",
    ]);
    expect(slots.every((s) => s.available)).toBe(true);
  });

  it("kural olmayan günlerde (hafta sonu) slot yok", () => {
    const slots = generateSlots({
      ...base,
      schedules: [schedule({ weekday: 1 }), schedule({ weekday: 5 })],
    });
    const weekdays = new Set(slots.map((s) => isoWeekday(istanbulDate(new Date(s.startsAt)))));
    expect([...weekdays].sort()).toEqual([1, 5]);
  });

  it("izin günü slot üretmez, ek mesai istisnası engellemez", () => {
    const schedules = [schedule()];
    expect(
      generateSlots({
        ...base,
        schedules,
        exceptions: [{ doctorId: "doc-a", date: monday, type: "leave" }],
      }),
    ).toHaveLength(0);
    expect(
      generateSlots({
        ...base,
        schedules,
        exceptions: [{ doctorId: "doc-a", date: monday, type: "extra" }],
      }),
    ).toHaveLength(3);
  });

  it("geçmiş saatleri atlar", () => {
    const now = new Date("2027-01-04T06:20:00Z"); // 09:20 İstanbul
    const slots = generateSlots({ ...base, now, schedules: [schedule()] });
    expect(slots.map((s) => s.startsAt)).toEqual(["2027-01-04T06:40:00.000Z"]);
  });

  it("dolu slotu available=false işaretler", () => {
    const isBooked = (_: string, startsAt: string) => startsAt === "2027-01-04T06:20:00.000Z";
    const slots = generateSlots({ ...base, isBooked, schedules: [schedule()] });
    expect(slots.filter((s) => !s.available)).toHaveLength(1);
  });

  it("birden çok doktoru zamana göre sıralar", () => {
    const slots = generateSlots({
      ...base,
      schedules: [
        schedule({ doctorId: "doc-b", startTime: "09:10", endTime: "09:30" }),
        schedule({ endTime: "09:20" }),
      ],
    });
    expect(slots.map((s) => `${s.doctorId}@${s.startsAt.slice(11, 16)}`)).toEqual([
      "doc-a@06:00",
      "doc-b@06:10",
    ]);
  });
});
