"use server";

/**
 * Admin server actions — every mutation goes through here.
 * Auth-guarded via the session; writes hit the file-backed content store
 * and revalidate the public pages that render the touched collection.
 */
import { auth, signOut } from "@/auth";
import {
  deleteArticle as storeDeleteArticle,
  deleteCertificate as storeDeleteCertificate,
  deleteExperience as storeDeleteExperience,
  deleteMessage as storeDeleteMessage,
  deleteProject as storeDeleteProject,
  getStoredArticle,
  getStoredProject,
  newId,
  saveStats as storeSaveStats,
  setMessageRead,
  upsertArticle,
  upsertCertificate,
  upsertExperience,
  upsertProject,
  normaliseLinks,
  type MediaItem,
  type ProjectLink,
  type StoredArticle,
  type StoredCertificate,
  type StoredExperience,
  type StoredProject,
  type StoredStat,
  CONTENT_TAG,
} from "@/lib/content-store";
import { syncContentFromBundle } from "@/lib/content-sync";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function revalidateAll() {
  // Drop the memoised content reads first, then re-render every route that
  // rendered from them. revalidatePath with "layout" walks the whole subtree.
  updateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
}

/* ── auth ─────────────────────────────────────────────────────────────── */

export async function signOutAction() {
  await signOut({ redirect: false });
  redirect("/admin/login");
}

/* ── content import ───────────────────────────────────────────────────── */

/**
 * Imports the JSON content shipped with this deployment into the database.
 * Runs here rather than from a local script because the database is only
 * reachable from the deployment. Upsert only — nothing is removed.
 */
export async function syncContentAction() {
  await requireAdmin();
  const report = await syncContentFromBundle();
  revalidateAll();
  return report;
}

/* ── projects ─────────────────────────────────────────────────────────── */

export type ProjectInput = {
  id?: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  bodyEn?: string; // markdown case study, "" clears it
  bodyAr?: string;
  category: StoredProject["category"];
  tags: string; // comma separated
  coverImage: string;
  client: string;
  role: string;
  tools: string; // comma separated
  year: string; // "" or number
  /** One "type|url" per line; see LINK_TYPES. */
  links?: string;
  featured: boolean;
  published: boolean;
  mediaUrls: string; // one URL per line; .mp4 → VIDEO
  /** What the uploader measured, keyed by URL. Absent for hand-typed URLs. */
  mediaMeta?: Record<
    string,
    { width: number; height: number; blurDataUrl?: string }
  >;
  /** The placeholder for a cover picked in this edit. */
  coverBlurDataUrl?: string;
};

/** "play|https://…" per line, from the textarea the panel renders. */
function parseLinks(raw?: string): ProjectLink[] {
  if (!raw) return [];
  return normaliseLinks(
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const at = line.indexOf("|");
        return at === -1
          ? { type: "site", url: line }
          : { type: line.slice(0, at).trim(), url: line.slice(at + 1).trim() };
      })
  );
}

const splitList = (s: string) =>
  s.split(",").map((x) => x.trim()).filter(Boolean);

export async function saveProjectAction(input: ProjectInput) {
  await requireAdmin();
  const id = input.id || newId("proj");
  const existing = input.id ? await getStoredProject(input.id) : null;

  const urls = input.mediaUrls
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  /* A picture that stays keeps its id wherever it moves to; a new one takes
     the first number nothing else is using. Numbering purely by position
     handed a new picture the id of one that had merely been reordered, the
     two collided inside a single insert, and the gallery was lost. */
  const taken = new Set(
    urls
      .map((url) => existing?.media.find((m) => m.url === url)?.id)
      .filter((x): x is string => Boolean(x))
  );
  let counter = 0;
  const freshId = () => {
    let candidate = `${id}-m${++counter}`;
    while (taken.has(candidate)) candidate = `${id}-m${++counter}`;
    taken.add(candidate);
    return candidate;
  };

  const media: MediaItem[] = urls
    .map((url, i) => {
      const prev = existing?.media.find((m) => m.url === url);
      const measured = input.mediaMeta?.[url];
      return {
        id: prev?.id ?? freshId(),
        url,
        type: url.toLowerCase().endsWith(".mp4") ? "VIDEO" : "IMAGE",
        altEn: `${input.titleEn} — ${i + 1}`,
        altAr: `${input.titleAr} — ${i + 1}`,
        order: i,
        // A freshly uploaded file knows its real size; anything else keeps
        // what was stored, and 1600×1200 is the last resort for a URL typed
        // in by hand.
        width: measured?.width ?? prev?.width ?? 1600,
        height: measured?.height ?? prev?.height ?? 1200,
      };
    });

  const record = {
    id,
    slug: input.slug,
    titleEn: input.titleEn,
    titleAr: input.titleAr,
    descEn: input.descEn,
    descAr: input.descAr,
    // undefined means the caller did not send the field — keep what is
    // stored. An empty string is a deliberate clear.
    bodyEn: input.bodyEn === undefined ? (existing?.bodyEn ?? null) : input.bodyEn.trim() || null,
    bodyAr: input.bodyAr === undefined ? (existing?.bodyAr ?? null) : input.bodyAr.trim() || null,
    category: input.category,
    tags: splitList(input.tags),
    coverImage: input.coverImage || existing?.coverImage || "/images/placeholder.jpg",
    blurDataUrl:
      input.coverImage === existing?.coverImage
        ? (existing?.blurDataUrl ?? null)
        : (input.coverBlurDataUrl ??
          input.mediaMeta?.[input.coverImage]?.blurDataUrl ??
          null),
    client: input.client.trim() || null,
    role: input.role.trim() || null,
    liveUrl: null, // superseded by links; upsertProject keeps it in step
    links: parseLinks(input.links),
    tools: splitList(input.tools),
    year: input.year ? Number(input.year) : null,
    featured: input.featured,
    published: input.published,
    publishedAt: existing?.publishedAt ?? new Date().toISOString(),
    media,
  };

  /* Report why a save failed. Next redacts a thrown server-action error in
     production, so the form was left guessing and blamed the session for
     what was really a rejected write. */
  try {
    await upsertProject(record);
  } catch (e) {
    console.error("[saveProjectAction] upsert failed", e);
    return {
      ok: false as const,
      error: e instanceof Error ? e.message : "The database rejected the save.",
    };
  }
  revalidateAll();
  return { ok: true as const, id };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await storeDeleteProject(id);
  revalidateAll();
  return { ok: true };
}

export async function toggleProjectAction(
  id: string,
  field: "published" | "featured"
) {
  await requireAdmin();
  const p = await getStoredProject(id);
  if (!p) return { ok: false };
  await upsertProject({ ...p, [field]: !p[field] });
  revalidateAll();
  return { ok: true };
}

/* ── articles ─────────────────────────────────────────────────────────── */

export type ArticleInput = {
  id?: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  coverImage: string;
  tags: string;
  readTime: string;
  published: boolean;
};

export async function saveArticleAction(input: ArticleInput) {
  await requireAdmin();
  const id = input.id || newId("art");
  const existing = input.id ? await getStoredArticle(input.id) : null;
  const article: StoredArticle = {
    id,
    slug: input.slug,
    titleEn: input.titleEn,
    titleAr: input.titleAr,
    excerptEn: input.excerptEn,
    excerptAr: input.excerptAr,
    bodyEn: input.bodyEn,
    bodyAr: input.bodyAr,
    coverImage: input.coverImage || "/images/placeholder.jpg",
    tags: splitList(input.tags),
    readTime: Number(input.readTime) || 5,
    published: input.published,
    publishedAt: existing?.publishedAt ?? new Date().toISOString(),
  };
  await upsertArticle(article);
  revalidateAll();
  return { ok: true, id };
}

export async function deleteArticleAction(id: string) {
  await requireAdmin();
  await storeDeleteArticle(id);
  revalidateAll();
  return { ok: true };
}

/* ── experiences ──────────────────────────────────────────────────────── */

export async function saveExperienceAction(exp: StoredExperience) {
  await requireAdmin();
  await upsertExperience({ ...exp, id: exp.id || newId("exp") });
  revalidateAll();
  return { ok: true };
}

export async function deleteExperienceAction(id: string) {
  await requireAdmin();
  await storeDeleteExperience(id);
  revalidateAll();
  return { ok: true };
}

/* ── stats (key highlights) ───────────────────────────────────────────── */

export async function saveStatsAction(stats: StoredStat[]) {
  await requireAdmin();
  await storeSaveStats(
    stats.map((s) => ({ ...s, id: s.id || newId("stat"), value: Number(s.value) || 0 }))
  );
  revalidateAll();
  return { ok: true };
}

/* ── contact messages ─────────────────────────────────────────────────── */

export async function setMessageReadAction(id: string, read: boolean) {
  await requireAdmin();
  await setMessageRead(id, read);
  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function deleteMessageAction(id: string) {
  await requireAdmin();
  await storeDeleteMessage(id);
  revalidatePath("/admin/messages");
  return { ok: true };
}

/* ── certificates ─────────────────────────────────────────────────────── */

export async function saveCertificateAction(input: {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  category: string;
  url: string;
  order: string;
}) {
  await requireAdmin();
  const id = input.id || newId("cert");
  const cert: StoredCertificate = {
    id,
    title: input.title.trim(),
    issuer: input.issuer.trim() || null,
    date: input.date.trim() || null,
    category: input.category || "uiux",
    url: input.url.trim(),
    width: 1200,
    height: 900,
    blurDataUrl: null,
    order: Number(input.order) || 0,
  };
  await upsertCertificate(cert);
  revalidateAll();
  return { ok: true, id };
}

export async function deleteCertificateAction(id: string) {
  await requireAdmin();
  await storeDeleteCertificate(id);
  revalidateAll();
  return { ok: true };
}
