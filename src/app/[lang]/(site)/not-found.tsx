import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { routes } from "@/lib/routes";

export default async function NotFound() {
  const t = await getDictionary();
  const popular = [
    { label: t.common.bookAppointment, href: routes.appointment },
    { label: t.nav.doctors, href: routes.doctors },
    { label: t.nav.units, href: routes.units },
    { label: t.nav.contactLinks.locations, href: routes.locations },
  ];
  return (
    <>
      <PageHeader
        eyebrow={<span className="text-2xl font-bold text-brand-200">404</span>}
        title={t.notFound.title}
        lead={t.notFound.body}
      />
      <Container className="py-12 sm:py-16">
        <h2 className="font-sans text-base font-semibold">{t.notFound.popular}</h2>
        <ul className="mt-3 flex flex-wrap gap-3">
          {popular.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                className="inline-flex min-h-11 items-center rounded-input border border-brand-600 px-5 font-medium text-brand-700 focus-ring hover:bg-brand-100"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href={routes.home} variant="ghost" className="mt-8">
          ← {t.common.home}
        </ButtonLink>
      </Container>
    </>
  );
}
