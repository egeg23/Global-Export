import type { Metadata } from "next";

import { AdminPage } from "@/components/mavera/admin/admin-page";

export const metadata: Metadata = { title: "Панель управления — «Люкс»" };

export default function Page() {
  return <AdminPage variant="lux" />;
}
