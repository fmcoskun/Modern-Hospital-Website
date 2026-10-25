import type { Metadata } from "next";
import { InfoPage, infoMetadata, infoStaticParams } from "@/features/pages/InfoPage";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => infoStaticParams("patient");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return infoMetadata("patient", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <InfoPage section="patient" slug={(await params).slug} />;
}
