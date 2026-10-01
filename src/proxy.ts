import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/**
 * Auth.js session cookie, plain on http and `__Secure-` prefixed on https.
 * A large session is split into `.0`, `.1`… chunks, hence the prefix match.
 */
const SESSION_COOKIE = /^(__Secure-)?authjs\.session-token(\.\d+)?$/;

/**
 * /admin is not localized, so it never reaches next-intl. Instead it gets a
 * first, cheap gate: no session cookie, no render. This only checks that a
 * cookie is present; whether it is valid and belongs to an admin is decided
 * by requireAdminPage() in every page, which is the check that counts.
 */
function guardAdmin(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const hasSession = req.cookies
    .getAll()
    .some((cookie) => SESSION_COOKIE.test(cookie.name));
  if (hasSession) return NextResponse.next();

  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return guardAdmin(req);
  }
  return intl(req);
}

export const config = {
  matcher: [
    // Match all pathnames except:
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - Static files with extensions
    // /admin is matched on purpose: guardAdmin() handles it above.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
