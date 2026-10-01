import type { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // /api/og is the share card for anything added since the last card
        // build; a crawler that honours robots.txt would otherwise show no
        // image at all for those pages. The longer rule wins the tie.
        allow: ["/", "/api/og"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
