import type { ReactNode } from "react";
import { MobileBottomBar, SiteFooter, TopBar } from "@/components/layout/Chrome";
import { getNavigation } from "@/components/layout/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/ui/Layout";
import { getDictionary } from "@/i18n";
import { data } from "@/lib/data";
import { searchLabels } from "@/features/search/labels";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const t = await getDictionary();
  const [hospital, nav, departments, branches] = await Promise.all([
    data.hospital.get(),
    getNavigation(t),
    data.departments.list(),
    data.branches.list(),
  ]);

  return (
    <>
      <SkipLink label={t.common.skipToContent} />
      <SiteHeader
        topBar={<TopBar t={t} hospital={hospital} />}
        nav={nav}
        searchLabels={searchLabels(t)}
        labels={{
          main: t.nav.main,
          bookAppointment: t.common.bookAppointment,
          search: t.common.search,
          openMenu: t.nav.openMenu,
          closeMenu: t.nav.closeMenu,
          submenu: t.nav.submenu,
          home: t.common.home,
          siteName: t.meta.siteName,
        }}
      />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <SiteFooter t={t} hospital={hospital} departments={departments} branches={branches} />
      <MobileBottomBar t={t} hospital={hospital} />
    </>
  );
}
