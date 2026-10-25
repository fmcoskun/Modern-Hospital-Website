import type { Metadata } from "next";
import { InfoPage, infoMetadata, infoStaticParams } from "@/features/pages/InfoPage";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => infoStaticParams("corporate");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return infoMetadata("corporate", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <InfoPage section="corporate" slug={(await params).slug} />;
}
