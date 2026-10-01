const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/** A cover may live on Blob storage already; only a path gets the site prefix. */
const absolute = (url: string) => (url.startsWith("/") ? `${BASE}${url}` : url);

/**
 * Renders a JSON-LD script tag. The data is authored in the admin, so "<"
 * is escaped: a "</script>" inside a title would otherwise end the tag and
 * let the rest of the string run as markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function personSchema(locale: string) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: isAr ? "حلا شندية" : "Hla Shindeah",
    alternateName: isAr ? "Hla Shindeah" : "حلا شندية",
    jobTitle: isAr
      ? "مصممة UI/UX (Senior) ومطوّرة واجهات أمامية"
      : "Senior UI/UX Designer & Front-End Developer",
    url: `${BASE}/${locale}`,
    sameAs: [
      "https://dribbble.com/hla-shindeah",
      "https://www.linkedin.com/in/hla-shindeah/",
    ],
    knowsAbout: [
      "UI/UX Design",
      "Front-End Development",
      "React",
      "Next.js",
      "Graphic Design",
      "Motion Design",
      "Arabic RTL Design",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: isAr ? "اللاذقية" : "Lattakia",
      addressCountry: "SY",
    },
  };
}

export function websiteSchema(locale: string) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: isAr
      ? "حلا شندية — مصممة UI/UX ومطوّرة واجهات أمامية"
      : "Hla Shindeah — Senior UI/UX Designer & Front-End Developer",
    url: `${BASE}/${locale}`,
    inLanguage: isAr ? "ar" : "en",
  };
}

export function creativeWorkSchema(
  locale: string,
  p: {
    slug: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    coverImage: string;
    publishedAt: Date | string;
  }
) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: isAr ? p.titleAr : p.titleEn,
    description: isAr ? p.descAr : p.descEn,
    url: `${BASE}/${locale}/projects/detail/${p.slug}`,
    image: absolute(p.coverImage),
    datePublished: new Date(p.publishedAt).toISOString(),
    inLanguage: isAr ? "ar" : "en",
    author: { "@type": "Person", name: isAr ? "حلا شندية" : "Hla Shindeah", url: `${BASE}/${locale}` },
  };
}

export function articleSchema(
  locale: string,
  a: {
    slug: string;
    titleAr: string;
    titleEn: string;
    excerptAr: string;
    excerptEn: string;
    coverImage: string;
    publishedAt: Date | string;
    tags: string[];
  }
) {
  const isAr = locale === "ar";
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isAr ? a.titleAr : a.titleEn,
    description: isAr ? a.excerptAr : a.excerptEn,
    url: `${BASE}/${locale}/blog/${a.slug}`,
    image: absolute(a.coverImage),
    datePublished: new Date(a.publishedAt).toISOString(),
    keywords: a.tags.join(", "),
    inLanguage: isAr ? "ar" : "en",
    author: { "@type": "Person", name: isAr ? "حلا شندية" : "Hla Shindeah", url: `${BASE}/${locale}` },
  };
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE}${item.path}`,
    })),
  };
}
