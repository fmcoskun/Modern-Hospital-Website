import { articleCategories, articles } from "@/content/seed/articles";
import {
  announcements,
  checkupPackages,
  faqs,
  insuranceProviders,
  technologies,
} from "@/content/seed/catalog";
import { departmentGroups, departments } from "@/content/seed/departments";
import { doctorSchedules, doctors, scheduleExceptions } from "@/content/seed/doctors";
import { branches, hospital } from "@/content/seed/hospital";
import { pages } from "@/content/seed/pages";
import { campusBuildings } from "@/content/seed/campus";
import { matchesQuery } from "@/lib/text";
import type { DataSource } from "../repositories";
import { demoIsBooked, generateSlots, istanbulDate } from "../slots";
import type { DoctorFilter } from "../types";

const published = <T extends { status: string }>(items: T[]) =>
  items.filter((i) => i.status === "published");
const byName = <T extends { name: { tr: string } }>(a: T, b: T) =>
  a.name.tr.localeCompare(b.name.tr, "tr");

const deptById = new Map(departments.map((d) => [d.id, d]));
const branchById = new Map(branches.map((b) => [b.id, b]));

function doctorBranchIds(doctorId: string): string[] {
  return [
    ...new Set(doctorSchedules.filter((s) => s.doctorId === doctorId).map((s) => s.branchId)),
  ];
}

function filterDoctors(filter: DoctorFilter = {}) {
  const dept = filter.departmentSlug
    ? departments.find((d) => d.slug === filter.departmentSlug)
    : undefined;
  const branch = filter.branchSlug ? branches.find((b) => b.slug === filter.branchSlug) : undefined;
  return published(doctors)
    .filter((d) => d.isActive)
    .filter((d) => !filter.departmentSlug || (dept && d.departmentIds.includes(dept.id)))
    .filter((d) => !filter.branchSlug || (branch && doctorBranchIds(d.id).includes(branch.id)))
    .filter((d) => !filter.language || d.languages.includes(filter.language))
    .filter((d) => !filter.interest || matchesQuery(d.interests, filter.interest))
    .filter(
      (d) =>
        !filter.q ||
        matchesQuery(
          [
            d.title,
            d.firstName,
            d.lastName,
            ...d.interests,
            ...d.departmentIds.map((id) => deptById.get(id)?.name.tr ?? ""),
          ],
          filter.q,
        ),
    )
    .sort(
      (a, b) =>
        a.lastName.localeCompare(b.lastName, "tr") || a.firstName.localeCompare(b.firstName, "tr"),
    );
}

export const mockDataSource: DataSource = {
  hospital: { get: async () => hospital },
  campus: { buildings: async () => campusBuildings },
  pages: {
    list: async (section) => pages.filter((p) => !section || p.section === section),
    getByPath: async (path) => pages.find((p) => p.path === path),
  },
  branches: {
    list: async () => published(branches),
    getBySlug: async (slug) => branches.find((b) => b.slug === slug),
    getById: async (id) => branchById.get(id),
  },
  departments: {
    list: async () => published(departments).sort(byName),
    groups: async () => [...departmentGroups].sort((a, b) => a.order - b.order),
    getBySlug: async (slug) => departments.find((d) => d.slug === slug),
    getById: async (id) => deptById.get(id),
    featured: async () => published(departments).filter((d) => d.featured),
    bookable: async () =>
      published(departments)
        .filter(
          (d) =>
            (d.kind === "clinical" || d.kind === "checkup") &&
            doctorSchedules.some((s) => s.departmentId === d.id),
        )
        .sort(byName),
  },
  doctors: {
    list: async (filter) => filterDoctors(filter),
    getBySlug: async (slug) => doctors.find((d) => d.slug === slug),
    getById: async (id) => doctors.find((d) => d.id === id),
    featured: async () => published(doctors).filter((d) => d.featured && d.isActive),
    byDepartment: async (departmentId) =>
      filterDoctors().filter((d) => d.departmentIds.includes(departmentId)),
    schedules: async (doctorId) => doctorSchedules.filter((s) => s.doctorId === doctorId),
    branchIds: async (doctorId) => doctorBranchIds(doctorId),
  },
  technologies: {
    list: async () => technologies,
    byIds: async (ids) => technologies.filter((t) => ids.includes(t.id)),
  },
  articles: {
    list: async ({ departmentId, categoryId, authorDoctorId, limit } = {}) =>
      published(articles)
        .filter((a) => !departmentId || a.departmentIds.includes(departmentId))
        .filter((a) => !categoryId || a.categoryId === categoryId)
        .filter(
          (a) =>
            !authorDoctorId ||
            a.authorDoctorId === authorDoctorId ||
            a.medicalReviewerDoctorId === authorDoctorId,
        )
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
        .slice(0, limit),
    getBySlug: async (slug) => articles.find((a) => a.slug === slug),
    categories: async () => articleCategories,
  },
  announcements: {
    getBySlug: async (slug) =>
      announcements.find((a) => a.slug === slug && a.status === "published"),
    list: async (limit) =>
      published(announcements)
        .sort(
          (a, b) =>
            Number(b.pinned) - Number(a.pinned) || b.publishedAt.localeCompare(a.publishedAt),
        )
        .slice(0, limit),
  },
  faqs: {
    list: async ({ scope, departmentId }) =>
      faqs
        .filter((f) => f.scope === scope && (!departmentId || f.departmentId === departmentId))
        .sort((a, b) => a.order - b.order),
  },
  insurance: { list: async () => insuranceProviders },
  checkups: { list: async () => published(checkupPackages) },
  appointments: {
    getSlots: async ({ departmentId, branchId, doctorId, fromDate, days, now }) => {
      const schedules = doctorSchedules.filter(
        (s) =>
          s.departmentId === departmentId &&
          s.branchId === branchId &&
          (!doctorId || s.doctorId === doctorId),
      );
      return generateSlots({
        schedules,
        exceptions: scheduleExceptions,
        isBooked: demoIsBooked,
        fromDate,
        days,
        now,
      });
    },
    isSlotAvailable: async (slot, now) => {
      const date = istanbulDate(new Date(slot.startsAt));
      const slots = await mockDataSource.appointments.getSlots({
        departmentId: slot.departmentId,
        branchId: slot.branchId,
        doctorId: slot.doctorId,
        fromDate: date,
        days: 1,
        now,
      });
      const match = slots.find((s) => s.startsAt === slot.startsAt);
      return Boolean(match && match.available);
    },
  },
};
