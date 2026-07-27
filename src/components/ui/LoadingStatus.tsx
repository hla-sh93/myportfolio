"use client";

import { useTranslations } from "next-intl";

/**
 * The only thing a screen reader should hear while a route skeleton is up.
 *
 * `role="status"` + `aria-live="polite"` announces "جارٍ التحميل…" without
 * interrupting, and every skeleton block around it stays `aria-hidden` so the
 * placeholder geometry is never read out as content.
 */
export function LoadingStatus() {
  const t = useTranslations("common");
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {t("loading")}
    </span>
  );
}
