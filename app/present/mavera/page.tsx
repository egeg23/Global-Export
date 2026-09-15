import { permanentRedirect } from "next/navigation";

/**
 * Старый адрес раздела MAVERA.
 *
 * Ссылка уже разошлась по переписке, поэтому она не должна отдавать 404:
 * витрина переехала на /mavera, когда у проекта появились три собственных
 * сайта, и этот файл остаётся указателем.
 */
export default function MaveraMoved() {
  permanentRedirect("/mavera");
}
