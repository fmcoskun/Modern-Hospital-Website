import type { Metadata } from "next";
import { Suspense } from "react";
import { telHref } from "@/components/layout/navigation";
import { Skeleton } from "@/components/ui/Feedback";
import { Container } from "@/components/ui/Layout";
import { ClientOnly } from "@/features/appointments/ClientOnly";
import { Wizard, type WizardCatalog } from "@/features/appointments/Wizard";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.appointment.title, alternates: { canonical: "/randevu/yeni" } };
}

/** Katalog sunucuda hazırlanır; doktor–şube ilişkisi çalışma programından türetilir (plan 8.3). */
async function buildCatalog(): Promise<WizardCatalog> {
  const [hospital, branches, departments, groups, doctors] = await Promise.all([
    data.hospital.get(),
    data.branches.list(),
    data.departments.bookable(),
    data.departments.groups(),
    data.doctors.list(),
  ]);
  const bookableIds = new Set(departments.map((d) => d.id));
  const docs = (
    await Promise.all(
      doctors
        .filter((d) => bookableIds.has(d.primaryDepartmentId))
        .map(async (d) => ({
          id: d.id,
          slug: d.slug,
          name: `${d.title} ${d.firstName} ${d.lastName}`,
          departmentId: d.primaryDepartmentId,
          branchIds: await data.doctors.branchIds(d.id),
          interests: d.interests,
        })),
    )
  ).filter((d) => d.branchIds.length > 0);

  return {
    callCenter: hospital.callCenterPhone,
    callCenterHref: telHref(hospital.callCenterPhone),
    branches: branches.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name.tr,
      address: `${b.address}, ${b.district}`,
      hasEmergency: b.hasEmergency,
      geo: b.geo,
    })),
    departments: departments.map((d) => ({
      id: d.id,
      slug: d.slug,
      name: d.name.tr,
      group: groups.find((g) => g.id === d.groupId)?.name.tr ?? "",
      branchIds: [
        ...new Set(docs.filter((x) => x.departmentId === d.id).flatMap((x) => x.branchIds)),
      ],
    })),
    doctors: docs,
  };
}

export default async function AppointmentPage() {
  const [t, catalog] = await Promise.all([getDictionary(), buildCatalog()]);
  const fallback = (
    <div aria-busy="true" className="space-y-4">
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-10 w-2/3" />
      <div className="grid gap-3 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  );
  return (
    <Container className="max-w-5xl py-8 sm:py-12">
      <h1 className="text-h1">{t.appointment.title}</h1>
      <p className="mt-2 text-ink-muted">{t.appointment.lead}</p>
      <div className="mt-8">
        <Suspense fallback={fallback}>
          <ClientOnly fallback={fallback}>
            <Wizard
              catalog={catalog}
              labels={{ a: t.appointment, common: t.common, weekdaysShort: t.weekdaysShort }}
            />
          </ClientOnly>
        </Suspense>
      </div>
    </Container>
  );
}
