import { CONTENT_TAG } from "@/lib/content-store";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Drops the cached content reads.
 *
 * Every read in content-store is wrapped in `unstable_cache` under the
 * `content` tag with an hour's life, and the admin panel clears that tag on
 * every save. A script that writes straight to the database cannot: it never
 * passes through Next, so nothing invalidates anything and the pages keep
 * serving what they last rendered. That is how a corrected project sat right
 * in the database and wrong on the site.
 *
 * So the scripts call this when they are done.
 *
 * Auth is a bearer token rather than the admin session, because the callers
 * are scripts with no cookie to send. With no token configured the route
 * refuses outright — an open flush is a free way to make the site rebuild
 * every page on demand.
 */
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_TOKEN?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "REVALIDATE_TOKEN is not set" },
      { status: 501 }
    );
  }

  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!given || given !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // `updateTag` is the immediate one but only runs inside a Server Action,
  // and a script has no action to call. `expire: 0` is how a route handler
  // says the same thing: treat every entry under this tag as already stale.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  // the tag covers the data; this covers the pages that rendered from it
  revalidatePath("/", "layout");

  return NextResponse.json({
    revalidated: true,
    tag: CONTENT_TAG,
    at: new Date().toISOString(),
  });
}
