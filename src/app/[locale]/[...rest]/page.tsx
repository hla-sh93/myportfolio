import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched paths under a locale.
 *
 * Without it, a URL like /ar/typo matches no route at all, so Next falls back
 * to the *root* not-found — outside the locale layout, which meant no navbar,
 * no lang/dir, and English text on an Arabic site. Routing every stray path
 * through here sends it to `[locale]/not-found.tsx` instead.
 */
export default function CatchAll() {
  notFound();
}
