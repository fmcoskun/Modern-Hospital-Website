import { MaterialIcon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Feedback";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { routes } from "@/lib/routes";
import { fmtDay } from "@/lib/dates";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.announcementsPage.title,
    description: t.announcementsPage.lead,
    alternates: { canonical: routes.announcements },
  };
}

export default async function AnnouncementsPage() {
  const t = await getDictionary();
  const a = t.announcementsPage;
  const items = await data.announcements.list();
  return (
    <>
      <PageHeader
        image="banner-duyurular"
        title={a.title}
        lead={a.lead}
        breadcrumb={
          <Breadcrumb
            label={t.common.breadcrumb}
            items={[{ name: t.common.home, href: routes.home }, { name: a.title }]}
          />
        }
      />
      <Container className="max-w-4xl py-10">
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id}>
              <article className="relative rounded-card neu-raised p-6 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <Badge tone="brand">{a.types[item.type]}</Badge>
                  <time dateTime={item.publishedAt} className="text-ink-muted">
                    {fmtDay(item.publishedAt)}
                  </time>
                  {item.pinned && (
                    <MaterialIcon
                      name="keep"
                      size={16}
                      label={a.pinned}
                      className="text-brand-600"
                    />
                  )}
                </div>
                <h2 className="mt-2 text-h3">
                  <Link
                    href={routes.announcement(item.slug)}
                    className="after:absolute after:inset-0 after:rounded-card after:content-[''] hover:text-brand-600 focus:outline-none"
                  >
                    {item.title.tr}
                  </Link>
                </h2>
                <p className="mt-1 text-ink-muted">{item.excerpt.tr}</p>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
