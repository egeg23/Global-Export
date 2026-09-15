import type { Metadata } from "next";

import { ObjectPage, objectParams } from "@/components/mavera/object/object-page";
import { projects } from "@/content/mavera/data";

export function generateStaticParams() {
  return objectParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project ? `ЖК «${project.name}»` : "Проект" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ObjectPage variant="premium" slug={slug} />;
}
