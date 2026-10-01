import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Arabic is the primary experience: "/" always lands on /ar,
  // visitors switch to EN explicitly via the navbar toggle.
  localeDetection: false,
  // The HTTP Link header next-intl adds named an unprefixed "/about" as
  // x-default, which 307s, while the HTML and the sitemap say /ar/about.
  // One signal is enough: the HTML's.
  alternateLinks: false,
});
