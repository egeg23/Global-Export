import { HeaderBar } from "@/components/akbar/header-bar";
import { menuData } from "@/lib/akbar/menu";

/** Серверная обёртка: меню собирается здесь, в браузер уходит только выжимка. */
export function AkbarHeader() {
  return <HeaderBar menu={menuData()} />;
}
