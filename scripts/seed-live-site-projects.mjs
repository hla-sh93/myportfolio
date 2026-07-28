/**
 * Write the three live-site projects into data/projects.json and emit the SQL
 * to mirror them into Postgres (the store reads the database first).
 *
 *   node scripts/seed-live-site-projects.mjs [--sql out.sql]
 *
 * Image dimensions and blur placeholders are read from the manifest that
 * scripts/build-live-site-projects.mjs produced, so the records always match
 * the artwork actually on disk.
 */
import fs from "node:fs";

const manifest = JSON.parse(fs.readFileSync("src/content/project-images.json", "utf8"));
const projectsPath = "data/projects.json";
const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));

const ROLE_EN = "UI/UX Designer & Front-End Developer";

const DEFS = [
  {
    id: "maritime-flag-administrations",
    slug: "maritime-flag-administrations",
    titleEn: "Maritime Flag Administrations",
    titleAr: "بوابات الإدارات البحرية",
    descEn:
      "Seven maritime authorities, seven separate clients, one problem repeated: a flag state has to publish the same things — services, certification, approved organisations, document verification — and still look like itself while doing it. I designed and built each front end. Zimbabwe runs deep green and gold; Nicaragua is cream and navy. The same skeleton underneath, no two alike on the surface.",
    descAr:
      "سبع هيئات بحرية، وسبعة عملاء منفصلين، ومسألة واحدة تتكرّر: دولة العَلَم تنشر المحتوى نفسه — الخدمات، وإصدار الشهادات، والمؤسسات المعتمدة، والتحقّق من الوثائق — وعليها أن تظلّ محتفظة بهويتها وهي تفعل ذلك. صمّمت كل واجهة وبنيتها. زيمبابوي بالأخضر الغامق والذهبي، ونيكاراغوا بالكريمي والكحلي. الهيكل واحد في العمق، ولا يتشابه اثنان في السطح.",
    category: "WEBSITES",
    tags: ["Maritime", "Government", "Next.js"],
    client: null, // each portal is its own client
    role: ROLE_EN,
    tools: ["Next.js", "React"],
    year: 2026,
    liveUrl: "https://zimadmin.org",
    featured: true,
    publishedAt: "2026-06-01T00:00:00.000Z",
  },
  {
    id: "asset-security-systems",
    slug: "asset-security-systems",
    titleEn: "ASSET — Security & Safety Technology",
    titleAr: "أسِت — تقنيات الأمن والسلامة",
    descEn:
      "ASSET represents high-tech security manufacturers out of Dubai: screening detectors, X-ray inspection, perimeter protection, rescue medicine, optical communication. The job was to make a dense technical catalogue readable to a procurement officer who is not an engineer — so the range leads, and the specifications wait until they are asked for. I designed and built the front end.",
    descAr:
      "أسِت شركة في دبي تمثّل مصنّعي أنظمة الأمن والسلامة عالية التقنية: أجهزة الكشف، والتفتيش بالأشعة، وحماية المحيط، وطبّ الإنقاذ، والاتصالات الضوئية. المهمّة كانت جعل كتالوج تقني كثيف قابلاً للقراءة أمام موظّف مشتريات ليس مهندسًا، فتتقدّم العائلات أوّلًا وتنتظر المواصفات حتى يُسأل عنها. صمّمت الواجهة وبنيتها.",
    category: "WEBSITES",
    tags: ["Security Tech", "Corporate", "Next.js"],
    client: "ASSET",
    role: ROLE_EN,
    tools: ["Next.js", "React"],
    year: 2023,
    liveUrl: "https://asset-uae.com",
    featured: false,
    publishedAt: "2023-05-01T00:00:00.000Z",
  },
  {
    id: "rasael-messaging-platform",
    slug: "rasael-messaging-platform",
    titleEn: "Rasael — Multi-Channel Messaging",
    titleAr: "رسائل — منصّة مراسلة متعدّدة القنوات",
    descEn:
      "One inbox for WhatsApp, SMS, Telegram and email, built Arabic-first: campaigns, templates, bots and a shared inbox in a single workspace. A dark product page whose whole job is to explain a multi-channel platform without collapsing into a feature list. I designed and built the front end.",
    descAr:
      "صندوق وارد واحد لواتساب والرسائل القصيرة وتيليغرام والبريد، مبنيّ بالعربية أوّلًا: حملات وقوالب وبوتات ومحادثات مشتركة في مساحة عمل واحدة. صفحة منتج داكنة مهمّتها كلّها شرح منصّة متعدّدة القنوات دون أن تنهار إلى قائمة ميزات. صمّمت الواجهة وبنيتها.",
    category: "WEBSITES",
    tags: ["SaaS", "Product Site", "Arabic-first"],
    client: "Rasael",
    role: ROLE_EN,
    tools: [],
    year: 2026,
    liveUrl: "https://rasaelapp.com",
    featured: true,
    publishedAt: "2026-07-01T00:00:00.000Z",
  },
];

const records = DEFS.map((d) => {
  const imgs = (manifest[d.slug] ?? []).filter((m) => /mockup-\d\.webp$/.test(m.url));
  if (!imgs.length) throw new Error(`no artwork for ${d.slug} — run build-live-site-projects first`);
  return {
    ...d,
    bodyEn: null,
    bodyAr: null,
    coverImage: imgs[0].url,
    blurDataUrl: imgs[0].blurDataUrl,
    published: true,
    media: imgs.map((m, i) => ({
      id: `${d.slug}-m${i + 1}`,
      url: m.url,
      type: "IMAGE",
      altEn: `${d.titleEn} — ${i + 1}`,
      altAr: `${d.titleAr} — ${i + 1}`,
      order: i,
      width: m.width,
      height: m.height,
    })),
  };
});

// ── file store ──
const kept = projects.filter((p) => !records.some((r) => r.slug === p.slug));
const merged = [...records, ...kept].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
);
fs.writeFileSync(projectsPath, JSON.stringify(merged, null, 1));
console.error(`✓ data/projects.json: ${merged.length} projects (${records.length} new)`);

// ── SQL mirror ──
const q = (v) =>
  v === null || v === undefined ? "NULL" : `'${String(v).replace(/'/g, "''")}'`;
const arr = (a) => `ARRAY[${a.map(q).join(", ")}]::text[]`;

const projectValues = records
  .map(
    (r) => `(${q(r.id)}, ${q(r.slug)}, ${q(r.titleEn)}, ${q(r.titleAr)}, ${q(r.descEn)}, ${q(r.descAr)},
   ${q(r.category)}::"Category", ${arr(r.tags)}, ${q(r.coverImage)}, ${q(r.blurDataUrl)},
   ${q(r.client)}, ${q(r.role)}, ${arr(r.tools)}, ${r.year}, ${q(r.liveUrl)},
   ${r.featured}, ${r.published}, ${q(r.publishedAt)}::timestamptz, NOW())`
  )
  .join(",\n  ");

const mediaValues = records
  .flatMap((r) =>
    r.media.map(
      (m) =>
        `(${q(m.id)}, ${q(m.url)}, ${q(m.type)}::"MediaType", ${q(m.altEn)}, ${q(m.altAr)}, ${m.order}, ${m.width}, ${m.height}, ${q(r.id)})`
    )
  )
  .join(",\n  ");

const sql = `-- projects
INSERT INTO projects (id, slug, "titleEn", "titleAr", "descEn", "descAr", category, tags,
  "coverImage", "blurDataUrl", client, role, tools, year, "liveUrl", featured, published,
  "publishedAt", "updatedAt")
VALUES
  ${projectValues}
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug, "titleEn" = EXCLUDED."titleEn", "titleAr" = EXCLUDED."titleAr",
  "descEn" = EXCLUDED."descEn", "descAr" = EXCLUDED."descAr", category = EXCLUDED.category,
  tags = EXCLUDED.tags, "coverImage" = EXCLUDED."coverImage",
  "blurDataUrl" = EXCLUDED."blurDataUrl", client = EXCLUDED.client, role = EXCLUDED.role,
  tools = EXCLUDED.tools, year = EXCLUDED.year, "liveUrl" = EXCLUDED."liveUrl",
  featured = EXCLUDED.featured, published = EXCLUDED.published,
  "publishedAt" = EXCLUDED."publishedAt", "updatedAt" = NOW();

-- media
INSERT INTO media (id, url, type, "altEn", "altAr", "order", width, height, "projectId")
VALUES
  ${mediaValues}
ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url, type = EXCLUDED.type, "altEn" = EXCLUDED."altEn",
  "altAr" = EXCLUDED."altAr", "order" = EXCLUDED."order",
  width = EXCLUDED.width, height = EXCLUDED.height, "projectId" = EXCLUDED."projectId";
`;

const sqlOut = process.argv.includes("--sql")
  ? process.argv[process.argv.indexOf("--sql") + 1]
  : "scripts/.live-site-projects.sql";
fs.writeFileSync(sqlOut, sql);
console.error(`✓ SQL → ${sqlOut}`);
