import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// next/og runs on the Node runtime; the edge runtime is deprecated and was
// also forcing this route out of static optimization.
export const runtime = "nodejs";

/**
 * Fallback share card.
 *
 * Every real page ships a pre-built card (see lib/share.ts) — project and
 * article cards made from their own artwork, page cards rendered in a browser.
 * This route only covers a slug added in the admin since the last card build.
 *
 * It carries no title on purpose. It renders through Satori, which lays glyphs
 * out left-to-right in their isolated forms and cannot shape Arabic: "نبذة عني"
 * came out as "ةذبن ينع". A card with no title is recoverable; a card with
 * broken Arabic on it is not.
 *
 * The palette was also indigo (#030014 / #a78bfa) — a colour that appears
 * nowhere on this site. It is the brand's wine on studio black now.
 */

const GROUND = "#120409";
const ACCENT = "#B91942";
const ACCENT_SOFT = "#E64A6E";

const LABELS: Record<string, string> = {
  project: "Project",
  article: "Article",
  page: "Portfolio",
};

export async function GET(req: NextRequest) {
  try {
    const type = new URL(req.url).searchParams.get("type") ?? "page";
    const label = LABELS[type] ?? LABELS.page;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: GROUND,
            backgroundImage: `radial-gradient(110% 75% at 50% 0%, ${ACCENT}55 0%, ${GROUND} 62%)`,
            padding: "72px 80px",
          }}
        >
          {/* Label chip */}
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 26px",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 100,
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "3px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  backgroundColor: ACCENT_SOFT,
                }}
              />
              {label}
            </div>
          </div>

          {/* Wordmark carries the card on its own */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                color: "#ffffff",
                fontSize: 86,
                fontWeight: 700,
                letterSpacing: "-1px",
              }}
            >
              Hla Shindeah
              <span style={{ color: ACCENT_SOFT }}>.</span>
            </div>
            <div style={{ display: "flex", color: "rgba(255,255,255,0.55)", fontSize: 26 }}>
              UI/UX · Front-End · Brand · Motion
            </div>
          </div>

          {/* Accent rule, the same one the built cards carry */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: 8,
              backgroundColor: ACCENT,
              display: "flex",
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          // Nothing here varies per request; render once, serve from the edge.
          "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch {
    return new Response("Failed to generate image", { status: 500 });
  }
}
