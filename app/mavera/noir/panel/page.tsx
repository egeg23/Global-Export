import type { Metadata } from "next";

import { PanelApp } from "@/components/mavera/admin/panel-app";

export const metadata: Metadata = {
  title: "Панель управления — вход · «Премиум Noir»",
};

export default function Page() {
  return <PanelApp variant="noir" />;
}
