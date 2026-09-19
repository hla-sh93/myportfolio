/**
 * Tells the deployed site to drop its cached content reads.
 *
 * The scripts in here write straight to the database, which never passes
 * through Next, so nothing clears the `content` tag and the pages keep
 * serving what they last rendered for up to an hour. Calling this closes
 * that gap: the correction is on the site as soon as it is in the database.
 *
 * Needs REVALIDATE_TOKEN, the same value the deployment has. The target
 * defaults to production rather than NEXT_PUBLIC_SITE_URL, which points at
 * localhost here and would flush a dev server nobody is looking at.
 */
import { config } from "dotenv";

const DEFAULT_TARGET = "https://hla-shindeah.vercel.app";

/* `dotenv/config` in the scripts only reads .env, but Next reads .env.local
   first and that is where a local-only secret belongs. Parsed here without
   touching process.env, so nothing a script already resolved can shift. */
const local = config({ path: ".env.local", processEnv: {}, quiet: true }).parsed ?? {};
const fromEnv = (key) => (process.env[key] ?? local[key])?.trim() || "";

export async function revalidateSite() {
  const token = fromEnv("REVALIDATE_TOKEN");
  const base = (fromEnv("REVALIDATE_URL") || DEFAULT_TARGET).replace(/\/$/, "");

  if (!token) {
    console.log(
      "\n  no REVALIDATE_TOKEN set — the change is in the database, and the\n" +
        "  site will show it once its cache expires (up to an hour)"
    );
    return { flushed: false, reason: "no-token" };
  }

  try {
    const res = await fetch(`${base}/api/revalidate`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(20000),
    });
    if (res.ok) {
      console.log(`\n  cache flushed on ${base} — the change is live now`);
      return { flushed: true };
    }
    const why =
      res.status === 401 ? "the token does not match the deployment's"
      : res.status === 501 ? "the deployment has no REVALIDATE_TOKEN set"
      : res.status === 404 ? "the route is not deployed there yet"
      : `HTTP ${res.status}`;
    console.log(`\n  could not flush the cache: ${why}`);
    return { flushed: false, reason: res.status };
  } catch (e) {
    // never fail a completed write because the flush could not be reached
    console.log(`\n  could not reach ${base}: ${e.message}`);
    return { flushed: false, reason: "unreachable" };
  }
}
