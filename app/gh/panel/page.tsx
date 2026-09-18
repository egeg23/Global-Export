import type { Metadata } from "next";

import { PanelApp } from "@/components/gh/panel-app";

export const metadata: Metadata = { title: "Панель управления" };

export default function Page() {
  return <PanelApp />;
}
