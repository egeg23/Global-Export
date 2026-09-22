import type { Metadata } from "next";

import { PanelApp } from "@/components/nm/panel";

export const metadata: Metadata = { title: "Панель управления" };

export default function Page() {
  return <PanelApp />;
}
