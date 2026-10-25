import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Feedback";
import { Breadcrumb, Container, PageHeader } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { fmtDay } from "@/lib/dates";
import { env } from "@/lib/env";
import { announcementPhoto } from "@/lib/photos";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await data.announcements.list()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await data.announcements.getBySlug((await params).slug);
  return a
    ? {
        title: a.title.tr,
        description: a.excerpt.tr,
        alternates: { canonical: routes.announcement(a.slug) },
      }
    : {};
}

export default async function AnnouncementPage({ params }: Props) {
  const item = await data.announcements.getBySlug((await params).slug);
  if (!item) notFound();
  const t = await getDictionary();
  const a = t.announcementsPage;
  const crumbs = [
    { name: t.common.home, href: routes.home },
    { name: a.title, href: routes.announcements },
    { name: item.title.tr, href: routes.announcement(item.slug) },
  ];
  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": item.type === "event" ? "Event" : "NewsArticle",
            ...(item.type === "event"
              ? { name: item.title.tr }
              : { headline: item.title.tr, datePublished: item.publishedAt }),
            description: item.excerpt.tr,
          },
          breadcrumbLd(env.NEXT_PUBLIC_SITE_URL, crumbs),
        ]}
      />
      <PageHeader
        image={announcementPhoto(item.slug)}
        breadcrumb={<Breadcrumb label={t.common.breadcrumb} items={crumbs} />}
        eyebrow={
          <>
            <Badge tone="brand">{a.types[item.type]}</Badge>
            <time dateTime={item.publishedAt}>{fmtDay(item.publishedAt)}</time>
          </>
        }
        title={item.title.tr}
        lead={item.excerpt.tr}
      />
      <Container className="max-w-3xl py-10 sm:py-14">
        <article>
          <div className="space-y-4 text-lg">
            {item.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </article>
        <ButtonLink href={routes.announcements} variant="secondary" className="mt-10">
          ← {a.all}
        </ButtonLink>
      </Container>
    </>
  );
}
