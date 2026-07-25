/**
 * File-backed content store — the same pattern as counter-store.ts, extended
 * to all editable content. Each collection is one JSON file under data/
 * (git-tracked so content survives and deploys with the repo).
 *
 * On first access a collection is seeded from the current hand-written
 * content (src/content/projects.ts, the i18n messages, the launch articles),
 * after which the JSON file is the single source of truth and the admin
 * panel edits it. A future Postgres/Prisma layer can import these files.
 */
import "server-only";
import fs from "node:fs";
import path from "node:path";
import { projects as staticProjects } from "@/content/projects";
import arMessages from "@/messages/ar.json";
import enMessages from "@/messages/en.json";

const DATA_DIR = path.join(process.cwd(), "data");

/* ── types ────────────────────────────────────────────────────────────── */

export type MediaItem = {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO";
  altEn: string;
  altAr: string;
  order: number;
  width: number;
  height: number;
};

export type StoredProject = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  bodyEn: string | null;
  bodyAr: string | null;
  category: "UIUX" | "WEBSITES" | "GRAPHIC_DESIGN" | "VIDEOS";
  tags: string[];
  coverImage: string;
  blurDataUrl: string | null;
  client: string | null;
  role: string | null;
  tools: string[];
  year: number | null;
  featured: boolean;
  published: boolean;
  publishedAt: string; // ISO
  media: MediaItem[];
};

export type StoredArticle = {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  bodyEn: string;
  bodyAr: string;
  coverImage: string;
  tags: string[];
  readTime: number;
  published: boolean;
  publishedAt: string; // ISO
};

export type StoredExperience = {
  id: string;
  roleEn: string;
  roleAr: string;
  companyEn: string;
  companyAr: string;
  periodEn: string;
  periodAr: string;
  descEn: string;
  descAr: string;
  order: number;
};

export type StoredStat = {
  id: string;
  value: number;
  suffix: string;
  labelEn: string;
  labelAr: string;
};

export type StoredMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO
};

/* ── low-level file helpers ───────────────────────────────────────────── */

function file(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readCollection<T>(name: string, seed: () => T[]): T[] {
  try {
    return JSON.parse(fs.readFileSync(file(name), "utf8")) as T[];
  } catch {
    const seeded = seed();
    writeCollection(name, seeded);
    return seeded;
  }
}

function writeCollection<T>(name: string, data: T[]) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(file(name), JSON.stringify(data, null, 1));
  } catch {
    /* read-only FS (serverless) — writes are dev/local only */
  }
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/* ── seeds ────────────────────────────────────────────────────────────── */

function seedProjects(): StoredProject[] {
  return staticProjects.map((p) => ({
    id: p.id,
    slug: p.slug,
    titleEn: p.titleEn,
    titleAr: p.titleAr,
    descEn: p.descEn,
    descAr: p.descAr,
    bodyEn: p.bodyEn ?? null,
    bodyAr: p.bodyAr ?? null,
    category: p.category,
    tags: p.tags,
    coverImage: p.coverImage,
    blurDataUrl: p.blurDataUrl ?? null,
    client: p.client ?? null,
    role: p.role ?? null,
    tools: p.tools,
    year: p.year ?? null,
    featured: p.featured,
    published: p.published,
    publishedAt: new Date(p.publishedAt).toISOString(),
    media: p.media.map((m) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      altEn: m.altEn,
      altAr: m.altAr,
      order: m.order,
      width: m.width,
      height: m.height,
    })),
  }));
}

type ExpMsg = { role: string; company: string; period: string; desc: string };

function seedExperiences(): StoredExperience[] {
  const ar = (arMessages as Record<string, any>).about.experience;
  const en = (enMessages as Record<string, any>).about.experience;
  const keys = Object.keys(ar).filter((k) => /^e\d+$/.test(k));
  return keys.map((k, i) => {
    const a = ar[k] as ExpMsg;
    const e = en[k] as ExpMsg;
    return {
      id: k,
      roleEn: e.role,
      roleAr: a.role,
      companyEn: e.company,
      companyAr: a.company,
      periodEn: e.period,
      periodAr: a.period,
      descEn: e.desc,
      descAr: a.desc,
      order: i,
    };
  });
}

function seedStats(): StoredStat[] {
  const ar = (arMessages as Record<string, any>).home.stats;
  const en = (enMessages as Record<string, any>).home.stats;
  // Real numbers from the CV (Zanqa Education Platform + career span)
  return [
    { id: "years", value: 7, suffix: "+", labelEn: en.yearsExperience, labelAr: ar.yearsExperience },
    { id: "users", value: 94, suffix: "K+", labelEn: en.usersReached, labelAr: ar.usersReached },
    { id: "downloads", value: 50, suffix: "K+", labelEn: en.appDownloads, labelAr: ar.appDownloads },
    { id: "publishers", value: 3, suffix: "K+", labelEn: en.publishersServed, labelAr: ar.publishersServed },
  ];
}

/* Launch articles — moved here from the page-level mocks so the admin owns
   them; bodies are markdown. */
function seedArticles(): StoredArticle[] {
  return [
    {
      id: "a1",
      slug: "building-with-nextjs-15",
      titleEn: "Building with Next.js 15",
      titleAr: "البناء باستخدام Next.js 15",
      excerptEn:
        "Exploring the new App Router features and server components in Next.js 15.",
      excerptAr:
        "استكشاف ميزات App Router الجديدة ومكونات الخادم في Next.js 15.",
      bodyEn: `## Introduction\n\nNext.js 15 introduces several groundbreaking features that revolutionize the way we build web applications. From enhanced server components to improved routing capabilities, this version marks a significant step forward.\n\n## The App Router\n\nThe App Router is one of the most significant additions. It provides a new paradigm for building applications with React Server Components at its core.\n\n### Key Features\n\n- **Server Components by Default**: Components are server-rendered unless explicitly marked as client components.\n- **Nested Layouts**: Share UI between routes while preserving state.\n- **Loading States**: Built-in loading UI with React Suspense.\n- **Error Handling**: Automatic error boundaries for graceful error recovery.\n\n## Server Components\n\nServer Components allow you to render components on the server, reducing the JavaScript bundle sent to the client.\n\n### Benefits\n\n1. Reduced bundle size\n2. Direct backend access\n3. Improved SEO\n4. Better performance on low-powered devices\n\n## Conclusion\n\nNext.js 15 represents a major leap forward in web development. The combination of Server Components, the App Router, and improved caching makes it an excellent choice for modern web applications.`,
      bodyAr: `## مقدمة\n\nيقدم Next.js 15 العديد من الميزات الرائدة التي تحدث ثورة في طريقة بناء تطبيقات الويب.\n\n## موجه التطبيق\n\nموجه التطبيق هو أحد أهم الإضافات. يوفر نموذجًا جديدًا لبناء التطبيقات.\n\n## الخلاصة\n\nيمثل Next.js 15 قفزة كبيرة في تطوير الويب.`,
      coverImage: "/images/placeholder.jpg",
      tags: ["Next.js", "React", "TypeScript"],
      readTime: 8,
      published: true,
      publishedAt: "2024-05-20T00:00:00.000Z",
    },
    {
      id: "a2",
      slug: "glassmorphism-design-guide",
      titleEn: "Glassmorphism Design Guide",
      titleAr: "دليل تصميم الزجاج الشفاف",
      excerptEn:
        "A comprehensive guide to implementing glassmorphism in modern web design.",
      excerptAr:
        "دليل شامل لتنفيذ تأثير الزجاج الشفاف في تصميم الويب الحديث.",
      bodyEn: `## What is Glassmorphism?\n\nGlassmorphism is a design trend that creates a frosted glass effect using background blur, transparency, and subtle borders.\n\n## Key Properties\n\nThe three main CSS properties that define glassmorphism:\n\n- **backdrop-filter**: Creates the blur effect behind the element\n- **background**: Semi-transparent background color\n- **border**: Subtle border for depth perception\n\n## Implementation\n\nHere's how to implement a basic glass card effect in your CSS.\n\n## Best Practices\n\n1. Use appropriate contrast for readability\n2. Don't overuse the effect\n3. Consider performance implications\n4. Test across different backgrounds\n\n## Conclusion\n\nGlassmorphism adds a modern, elegant touch to web designs when used thoughtfully.`,
      bodyAr: `## ما هو تأثير الزجاج الشفاف؟\n\nتأثير الزجاج الشفاف هو اتجاه تصميمي يخلق تأثير الزجاج المصنفر.\n\n## الخصائص الرئيسية\n\nالخصائص الثلاث الرئيسية التي تحدد التأثير.\n\n## الخلاصة\n\nيضيف تأثير الزجاج الشفاف لمسة عصرية وأنيقة للتصاميم.`,
      coverImage: "/images/placeholder.jpg",
      tags: ["Design", "CSS", "UI"],
      readTime: 5,
      published: true,
      publishedAt: "2024-04-15T00:00:00.000Z",
    },
    {
      id: "a3",
      slug: "tailwind-v4-whats-new",
      titleEn: "Tailwind CSS v4: What's New",
      titleAr: "Tailwind CSS v4: ما الجديد",
      excerptEn:
        "Breaking down the biggest changes and improvements in Tailwind CSS version 4.",
      excerptAr:
        "تحليل أكبر التغييرات والتحسينات في الإصدار الرابع من Tailwind CSS.",
      bodyEn: `## Overview\n\nTailwind CSS v4 brings a complete rewrite of the engine with significant performance improvements and new features.\n\n## New Features\n\n### CSS-First Configuration\n\nTailwind v4 introduces a CSS-first configuration approach, moving away from JavaScript config files.\n\n### Lightning CSS\n\nThe new engine is built on Lightning CSS, providing much faster build times.\n\n### Automatic Content Detection\n\nNo more configuring content paths manually — Tailwind v4 automatically detects your template files.\n\n## Performance\n\nBuild times have improved dramatically with the new architecture.\n\n## Conclusion\n\nTailwind CSS v4 is a major upgrade that makes the framework faster and easier to use.`,
      bodyAr: `## نظرة عامة\n\nيجلب Tailwind CSS v4 إعادة كتابة كاملة للمحرك مع تحسينات كبيرة في الأداء.\n\n## الخلاصة\n\nTailwind CSS v4 ترقية كبيرة تجعل الإطار أسرع وأسهل استخدامًا.`,
      coverImage: "/images/placeholder.jpg",
      tags: ["Tailwind", "CSS", "Frontend"],
      readTime: 6,
      published: true,
      publishedAt: "2024-03-10T00:00:00.000Z",
    },
  ];
}

/* ── projects ─────────────────────────────────────────────────────────── */

export function getStoredProjects(): StoredProject[] {
  return readCollection<StoredProject>("projects", seedProjects);
}

export function getStoredProject(idOrSlug: string): StoredProject | null {
  return (
    getStoredProjects().find((p) => p.id === idOrSlug || p.slug === idOrSlug) ??
    null
  );
}

export function upsertProject(project: StoredProject) {
  const all = getStoredProjects();
  const i = all.findIndex((p) => p.id === project.id);
  if (i >= 0) all[i] = project;
  else all.unshift(project);
  writeCollection("projects", all);
}

export function deleteProject(id: string) {
  writeCollection(
    "projects",
    getStoredProjects().filter((p) => p.id !== id)
  );
}

/* ── articles ─────────────────────────────────────────────────────────── */

export function getStoredArticles(): StoredArticle[] {
  return readCollection<StoredArticle>("articles", seedArticles);
}

export function getStoredArticle(idOrSlug: string): StoredArticle | null {
  return (
    getStoredArticles().find((a) => a.id === idOrSlug || a.slug === idOrSlug) ??
    null
  );
}

export function upsertArticle(article: StoredArticle) {
  const all = getStoredArticles();
  const i = all.findIndex((a) => a.id === article.id);
  if (i >= 0) all[i] = article;
  else all.unshift(article);
  writeCollection("articles", all);
}

export function deleteArticle(id: string) {
  writeCollection(
    "articles",
    getStoredArticles().filter((a) => a.id !== id)
  );
}

/* ── experiences ──────────────────────────────────────────────────────── */

export function getStoredExperiences(): StoredExperience[] {
  return readCollection<StoredExperience>("experiences", seedExperiences).sort(
    (a, b) => a.order - b.order
  );
}

export function upsertExperience(exp: StoredExperience) {
  const all = getStoredExperiences();
  const i = all.findIndex((e) => e.id === exp.id);
  if (i >= 0) all[i] = exp;
  else all.push(exp);
  writeCollection("experiences", all);
}

export function deleteExperience(id: string) {
  writeCollection(
    "experiences",
    getStoredExperiences().filter((e) => e.id !== id)
  );
}

/* ── stats (key highlights) ───────────────────────────────────────────── */

export function getStoredStats(): StoredStat[] {
  return readCollection<StoredStat>("stats", seedStats);
}

export function saveStats(stats: StoredStat[]) {
  writeCollection("stats", stats);
}

/* ── contact messages ─────────────────────────────────────────────────── */

export function getStoredMessages(): StoredMessage[] {
  return readCollection<StoredMessage>("messages", () => []).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export function addMessage(msg: Omit<StoredMessage, "id" | "read" | "createdAt">) {
  const all = getStoredMessages();
  all.unshift({
    ...msg,
    id: newId("msg"),
    read: false,
    createdAt: new Date().toISOString(),
  });
  writeCollection("messages", all);
}

export function setMessageRead(id: string, read: boolean) {
  const all = getStoredMessages();
  const m = all.find((x) => x.id === id);
  if (m) m.read = read;
  writeCollection("messages", all);
}

export function deleteMessage(id: string) {
  writeCollection(
    "messages",
    getStoredMessages().filter((m) => m.id !== id)
  );
}
