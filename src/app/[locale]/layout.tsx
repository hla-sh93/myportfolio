import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { MotionProvider } from "@/components/providers/motion-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/Toast";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  Poppins,
  Tajawal,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import { JsonLd, personSchema, websiteSchema } from "@/components/seo/JsonLd";
import { pageShareImage } from "@/lib/share";
import { CursorRing } from "@/components/ui/CursorRing";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { RouteProgress } from "@/components/ui/RouteProgress";
import "../globals.css";

/* ─── Fonts ───
   None of them is preloaded. A preload is emitted for every face declared
   here on every page, whichever locale is rendering, so /ar fetched eleven
   Latin files its text never uses, at the highest priority, ahead of the
   scripts and images that matter. Without preloads a face is fetched only
   when text is set in it; with display: swap the text paints at once in the
   fallback and the LCP does not wait for the font either way. */
// Latin — display + body
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
});

// Latin display — geometric grotesk with real character (headlines only)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: false,
});

// Arabic — display + body (primary locale)
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-tajawal",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  preload: false,
});

/* ─── Metadata ─── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("description"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        "x-default": "/ar",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `/${locale}`,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_SA",
      type: "website",
      siteName: t("siteName"),
      images: [pageShareImage(locale, "home", t("title"))],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [pageShareImage(locale, "home", t("title")).url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/* ─── Layout ─── */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Opts this subtree into static rendering. Without it next-intl reads the
  // locale from the request, every page renders on demand, and Next answers
  // with Cache-Control: no-store — which is why back/forward cache failed.
  setRequestLocale(locale);

  const messages = await getMessages();
  const tA11y = await getTranslations({ locale, namespace: "a11y" });
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isArabic = locale === "ar";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      {/* Each locale carries only its own faces: the RTL rules in globals.css
          route every Latin variable to Tajawal anyway. */}
      <body
        className={`
          ${isArabic ? tajawal.variable : `${poppins.variable} ${spaceGrotesk.variable}`}
          ${jetbrainsMono.variable}
          antialiased
        `}
      >
        {/* First in the body so the curtain paints on the very first frame,
            before any of the providers below have hydrated. */}
        <IntroLoader />
        <a href="#main" className="skip-link">
          {tA11y("skipToContent")}
        </a>
        <JsonLd data={personSchema(locale)} />
        <JsonLd data={websiteSchema(locale)} />
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
          <ThemeProvider>
            <ToastProvider>
              <RouteProgress />
              <CursorRing />
              <div className="grain-overlay" aria-hidden />
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main id="main" tabIndex={-1} className="flex-1 pt-[var(--navbar-height)] outline-none">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </ThemeProvider>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
