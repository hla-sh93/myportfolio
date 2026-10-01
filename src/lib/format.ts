/**
 * Numbers and dates that read the same on the server and in every browser.
 *
 * `toLocaleString()` with no locale takes the browser's: a visitor whose
 * browser is set to ar-SA, ar-SY or ar-EG got Arabic-Indic digits ("١٠")
 * even on /en, and a different text from the server's "10", which React
 * reports as a hydration error on every card. Dates had the same problem
 * through the time zone: formatting an instant prints the day before for
 * anyone east of UTC+4.
 */

/** Where the content is dated from; also the clock in the footer. */
export const SITE_TIME_ZONE = "Asia/Damascus";

/** Western digits in both languages — the blueprint's rule for figures. */
export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SY-u-nu-latn" : "en-US").format(value);
}

/**
 * The calendar day of an instant in the site's time zone, as a local Date at
 * midnight, so date-fns prints that day wherever it runs. Content is stamped
 * at Damascus midnight (21:00Z in summer), so this is also the day that was
 * meant: the UTC server printed the one before.
 */
export function siteDay(instant: string | Date): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(instant));
  const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return new Date(part("year"), part("month") - 1, part("day"));
}
