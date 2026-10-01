"use client";

import { useMemo, useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { SITE_TIME_ZONE } from "@/lib/format";

/* One shared clock: the subscribers wake every half minute. The server
   snapshot is null, so nothing is rendered until the client runs — the
   server's time would not match the visitor's first paint anyway. */
let tick = Date.now();
function subscribe(onChange: () => void) {
  const id = setInterval(() => {
    tick = Date.now();
    onChange();
  }, 30_000);
  return () => clearInterval(id);
}
const getTick = () => tick;
const getServerTick = () => null;

/* Live clock in Hla's timezone (Lattakia); Western digits in both locales
   per the blueprint. */
export function LocalTime() {
  const locale = useLocale();
  const now = useSyncExternalStore(subscribe, getTick, getServerTick);
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ar" ? "ar-SY-u-nu-latn" : "en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: SITE_TIME_ZONE,
      }),
    [locale]
  );

  if (now === null) return null;

  return <span dir="ltr">{formatter.format(new Date(now))}</span>;
}
