"use client";

import { useSyncExternalStore } from "react";

const noSubscription = () => () => {};

/**
 * The copyright year, read in the browser.
 *
 * On a statically generated page `new Date()` runs at build time and freezes,
 * so a site built in December still claims the old year in January. The server
 * snapshot keeps the build year in the HTML; the client corrects it.
 */
export function CurrentYear({ fallback }: { fallback: number }) {
  const year = useSyncExternalStore(
    noSubscription,
    () => new Date().getFullYear(),
    () => fallback,
  );

  return <>{year}</>;
}
