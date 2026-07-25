"use server";

/**
 * Admin server actions — every mutation goes through here.
 * Auth-guarded via the session; writes hit the file-backed content store
 * and revalidate the public pages that render the touched collection.
 */
import { auth, signOut } from "@/auth";
import {
  deleteArticle as storeDeleteArticle,
  deleteExperience as storeDeleteExperience,
  deleteMessage as storeDeleteMessage,
  deleteProject as storeDeleteProject,
  getStoredArticle,
  getStoredProject,
  newId,
  saveStats as storeSaveStats,
  setMessageRead,
  upsertArticle,
  upsertExperience,
  upsertProject,
  type MediaItem,
  type StoredArticle,
  type StoredExperience,
  type StoredProject,
  type StoredStat,
} from "@/lib/content-store";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

function revalidateAll() {
  // Locale-prefixed public routes + admin lists. revalidatePath with
  // "layout" walks the whole subtree — simplest correct choice here.
  revalidatePath("/", "layout");
}

/* ── auth ─────────────────────────────────────────────────────────────── */

export async function signOutAction() {
  await signOut({ redirect: false });
  redirect("/admin/login");
}

/* ── projects ─────────────────────────────────────────────────────────── */

export type ProjectInput = {
  id?: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  category: StoredProject["category"];
  tags: string; // comma separated
  coverImage: string;
  client: string;
  role: string;
  tools: string; // comma separated
  year: string; // "" or number
  featured: boolean;
  published: boolean;
  mediaUrls: string; // one URL per line; .mp4 → VIDEO
};

const splitList = (s: string) =>
  s.split(",").map((x) => x.trim()).filter(Boolean);

export async function saveProjectAction(input: ProjectInput) {
  await requireAdmin();
  const id = input.id || newId("proj");
  const existing = input.id ? await getStoredProject(input.id) : null;

  const media: MediaItem[] = input.mediaUrls
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((url, i) => {
      const prev = existing?.media.find((m) => m.url === url);
      return {
        id: prev?.id ?? `${id}-m${i + 1}`,
        url,
        type: url.toLowerCase().endsWith(".mp4") ? "VIDEO" : "IMAGE",
        altEn: `${input.titleEn} — ${i + 1}`,
        altAr: `${input.titleAr} — ${i + 1}`,
        order: i,
        width: prev?.width ?? 1600,
        height: prev?.height ?? 1200,
      };
    });

  await upsertProject({
    id,
    slug: input.slug,
    titleEn: input.titleEn,
    titleAr: input.titleAr,
    descEn: input.descEn,
    descAr: input.descAr,
    bodyEn: existing?.bodyEn ?? null,
    bodyAr: existing?.bodyAr ?? null,
    category: input.category,
    tags: splitList(input.tags),
    coverImage: input.coverImage || existing?.coverImage || "/images/placeholder.jpg",
    blurDataUrl:
      input.coverImage === existing?.coverImage ? (existing?.blurDataUrl ?? null) : null,
    client: input.client.trim() || null,
    role: input.role.trim() || null,
    tools: splitList(input.tools),
    year: input.year ? Number(input.year) : null,
    featured: input.featured,
    published: input.published,
    publishedAt: existing?.publishedAt ?? new Date().toISOString(),
    media,
  });
  revalidateAll();
  return { ok: true, id };
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  storeDeleteProject(id);
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
  storeDeleteArticle(id);
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
  storeDeleteExperience(id);
  revalidateAll();
  return { ok: true };
}

/* ── stats (key highlights) ───────────────────────────────────────────── */

export async function saveStatsAction(stats: StoredStat[]) {
  await requireAdmin();
  storeSaveStats(
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
  storeDeleteMessage(id);
  revalidatePath("/admin/messages");
  return { ok: true };
}
