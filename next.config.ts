import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

/** Hosts that may serve images/media (admin uploads land in Blob or R2). */
const MEDIA_HOSTS =
  "https://*.public.blob.vercel-storage.com https://*.r2.cloudflarestorage.com";

/**
 * Content-Security-Policy.
 *
 * `script-src` carries 'unsafe-inline' deliberately: the App Router streams
 * the RSC payload through inline <script> tags, so the only strict
 * alternative is a per-request nonce — which forces every page to render
 * dynamically and throws away the static generation this whole site depends
 * on. The trade was made in favour of staying static, and the policy still
 * does the work that matters most: no third-party origin can execute script,
 * nothing can be framed, forms can't be redirected off-site, and data can
 * only be sent back to this origin.
 *
 * Fonts are self-hosted by next/font and there are no embeds, so every
 * remaining directive can be locked to 'self' plus the media hosts.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  // Tailwind/next inject <style> tags, and framer-motion writes inline styles.
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${MEDIA_HOSTS}`,
  `media-src 'self' blob: ${MEDIA_HOSTS}`,
  "font-src 'self' data:",
  // ws: is the dev-server hot-reload socket.
  `connect-src 'self'${isDev ? " ws: wss:" : ""} ${MEDIA_HOSTS}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  // Don't advertise the framework/version.
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Cache optimized derivatives for a month instead of the 60s default.
    minimumCacheTTL: 2678400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      // Vercel Blob — where admin uploads land in production
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Isolate the browsing context: blocks cross-origin window handles
          // (the tabnabbing / Spectre-adjacent class of attack).
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        // The admin console must never be cached or indexed.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        // Content-hashed exports from the mockup pipeline — safe to pin.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
