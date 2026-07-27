import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
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
import { CursorRing } from "@/components/ui/CursorRing";
import { IntroLoader } from "@/components/ui/IntroLoader";
import { RouteProgress } from "@/components/ui/RouteProgress";
import "../globals.css";

/* ─── Fonts ─── */
// Latin — display + body
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

// Latin display — geometric grotesk with real character (headlines only)
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// Arabic — display + body (primary locale)
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
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
      template: `%s | ${t("title")}`,
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
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_SA",
      type: "website",
      siteName: t("title"),
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(t("title"))}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
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

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isArabic = locale === "ar";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`
          ${poppins.variable}
          ${spaceGrotesk.variable}
          ${jetbrainsMono.variable}
          ${isArabic ? tajawal.variable : ""}
          antialiased
        `}
      >
        {/* First in the body so the curtain paints on the very first frame,
            before any of the providers below have hydrated. */}
        <IntroLoader />
        <JsonLd data={personSchema(locale)} />
        <JsonLd data={websiteSchema(locale)} />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ToastProvider>
              <RouteProgress />
              <CursorRing />
              <div className="grain-overlay" aria-hidden />
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1 pt-[var(--navbar-height)]">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
