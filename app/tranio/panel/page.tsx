import type { Metadata } from "next";

import { Panel } from "@/components/tr/panel";

export const metadata: Metadata = {
  title: "Панель управления",
  description:
    "Панель управления Tranio: заявки из подбора и калькулятора, спрос по направлениям, пороги входа.",
};

export default function TranioPanelPage() {
  return <Panel />;
}
