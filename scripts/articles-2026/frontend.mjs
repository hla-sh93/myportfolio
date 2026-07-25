export const frontendArticles = [
  {
    slug: "react-server-components-in-practice",
    cat: "frontend",
    titleEn: "React Server Components in Practice: What Actually Changed",
    titleAr: "مكونات الخادم في React عمليًا: ما الذي تغيّر فعلًا",
    excerptEn:
      "Past the hype, RSC is a simple contract: the server renders data, the client renders interaction. Patterns that work after a year in production.",
    excerptAr:
      "بعيدًا عن الضجيج، مكونات الخادم عقد بسيط: الخادم يعرض البيانات والعميل يعرض التفاعل. أنماط أثبتت نفسها بعد سنة في الإنتاج.",
    tags: ["Front-End", "React", "Next.js"],
    readTime: 7,
    bodyEn: `## The mental model that clicks

Stop thinking "where does this code run?" and start thinking **"what does this component need?"**

- Needs data, secrets, or the filesystem → Server Component.
- Needs state, effects, or event handlers → Client Component.
- Needs both → a server parent fetching data, passing props to a client child.

That's 90% of RSC. The rest is discipline.

## Patterns that survived production

**Push client boundaries down.** A page with one interactive like-button doesn't need to be a client page — only the button does. Every \`"use client"\` you hoist up drags the whole subtree's JavaScript to the browser.

**Fetch where you render.** RSC kills the "one giant fetch at the top" pattern. Each server component fetches what it renders; React deduplicates identical requests. Colocation beats orchestration.

**Serialize consciously.** Props crossing the server→client boundary must be serializable. Dates become strings, functions don't cross at all. Design your types at the boundary first and half your bugs disappear.

## What I stopped doing

- Global state libraries for server data — the server *is* the state now.
- Loading spinners for first paint — streaming and Suspense render content as it's ready.
- API routes as an internal middleman — server components read the data layer directly; routes remain for real external clients.

## The honest trade-off

RSC moves complexity from the browser to the architecture. Your users get less JavaScript and faster pages; you take on stricter thinking about boundaries. In 2026, with the tooling mature, that trade is clearly worth it — my initial JS bundles dropped by more than half on every project I migrated.`,
    bodyAr: `## النموذج الذهني الذي يوضّح كل شيء

توقف عن سؤال «أين يعمل هذا الكود؟» وابدأ بسؤال **«ماذا يحتاج هذا المكوّن؟»**

- يحتاج بيانات أو أسرارًا أو ملفات → مكوّن خادم.
- يحتاج حالة أو تأثيرات أو أحداثًا → مكوّن عميل.
- يحتاج الاثنين → أبٌ على الخادم يجلب البيانات ويمررها لابنٍ على العميل.

هذا 90% من الموضوع. والباقي انضباط.

## أنماط نجت من الإنتاج

**ادفع حدود العميل للأسفل.** صفحة فيها زر إعجاب تفاعلي واحد لا تحتاج أن تكون صفحة عميل — الزر وحده يحتاج. كل \`"use client"\` ترفعه للأعلى يسحب جافاسكربت الشجرة كاملة للمتصفح.

**اجلب حيث تعرض.** مكونات الخادم أنهت نمط «جلبة عملاقة واحدة في الأعلى». كل مكوّن يجلب ما يعرضه، وReact يزيل التكرار عن الطلبات المتطابقة. الجوار يتفوق على الأوركسترا.

**سلسِل بوعي.** الخصائص العابرة من الخادم للعميل يجب أن تكون قابلة للتسلسل: التواريخ تصبح نصوصًا، والدوال لا تعبر إطلاقًا. صمم أنواعك عند الحدود أولًا ويختفي نصف أخطائك.

## ما توقفت عن فعله

- مكتبات الحالة العامة لبيانات الخادم — الخادم *هو* الحالة الآن.
- مؤشرات تحميل للرسم الأول — البث وSuspense يعرضان المحتوى فور جاهزيته.
- مسارات API كوسيط داخلي — مكونات الخادم تقرأ طبقة البيانات مباشرة، والمسارات تبقى للعملاء الخارجيين الحقيقيين.

## المقايضة بصراحة

مكونات الخادم تنقل التعقيد من المتصفح إلى المعمارية. مستخدموك يحصلون على جافاسكربت أقل وصفحات أسرع، وأنت تتحمل تفكيرًا أدق في الحدود. في 2026 ومع نضج الأدوات، المقايضة رابحة بوضوح — حِزمي الأولية انخفضت لأكثر من النصف في كل مشروع رحّلته.`,
  },
  {
    slug: "modern-css-2026-no-framework",
    cat: "frontend",
    titleEn: "CSS in 2026: The Platform Caught Up",
    titleAr: "CSS في 2026: المنصة لحقت بالركب",
    excerptEn:
      "Container queries, :has(), view transitions, and native nesting — half of what we needed JavaScript for is now three lines of CSS.",
    excerptAr:
      "استعلامات الحاوية و:has() وانتقالات العرض والتداخل الأصلي — نصف ما احتجنا له جافاسكربت صار ثلاثة أسطر CSS.",
    tags: ["Front-End", "CSS", "Web Platform"],
    readTime: 6,
    bodyEn: `## The quiet revolution

While frameworks fought over rendering strategies, CSS shipped a decade of wishes: container queries, \`:has()\`, native nesting, \`@scope\`, scroll-driven animations, and view transitions. The result: components that used to need JavaScript observers now style themselves.

## Container queries changed component design

Media queries ask "how wide is the screen?" — the wrong question for a card that lives in a sidebar on desktop and full-width on mobile. Container queries ask **"how wide am I?"**

\`\`\`css
.card-wrap { container-type: inline-size; }
@container (min-width: 420px) {
  .card { grid-template-columns: 160px 1fr; }
}
\`\`\`

Design systems finally ship components that adapt to their slot, not the viewport.

## :has() is the parent selector we begged for

Style a form field's label when its input is invalid. Give a card a different layout when it contains a video. Highlight a nav item when its submenu is open — all without a single class toggle:

\`\`\`css
.field:has(input:invalid) label { color: var(--danger); }
\`\`\`

## View transitions for free polish

Cross-fade between pages, morph a thumbnail into a hero — the View Transitions API does in the browser what used to take a motion library. Progressive enhancement at its best: browsers that don't support it just navigate instantly.

## What this means for your stack

I still love Tailwind for velocity. But the platform now handles the *hard* parts natively — which means less JavaScript, fewer dependencies, and interfaces that stay fast on cheap phones. The best front-end skill of 2026 is knowing what you no longer need to ship.`,
    bodyAr: `## الثورة الهادئة

بينما تتصارع أطر العمل على استراتيجيات العرض، شحنت CSS أمنيات عقد كامل: استعلامات الحاوية، \`:has()\`، التداخل الأصلي، \`@scope\`، الحركات المقادة بالتمرير، وانتقالات العرض. النتيجة: مكونات كانت تحتاج مراقبات جافاسكربت صارت تنسّق نفسها بنفسها.

## استعلامات الحاوية غيّرت تصميم المكونات

استعلامات الميديا تسأل «كم عرض الشاشة؟» — سؤال خاطئ لبطاقة تعيش في شريط جانبي على الحاسوب وبعرض كامل على الموبايل. استعلامات الحاوية تسأل **«كم عرضي أنا؟»**

\`\`\`css
.card-wrap { container-type: inline-size; }
@container (min-width: 420px) {
  .card { grid-template-columns: 160px 1fr; }
}
\`\`\`

أنظمة التصميم أخيرًا تشحن مكونات تتكيف مع مكانها لا مع الشاشة.

## :has() محدد الأب الذي توسلنا له

نسّق تسمية الحقل حين يكون إدخاله خاطئًا. أعطِ البطاقة تخطيطًا مختلفًا حين تحوي فيديو. أبرز عنصر القائمة حين تُفتح قائمته الفرعية — كل ذلك دون تبديل كلاس واحد:

\`\`\`css
.field:has(input:invalid) label { color: var(--danger); }
\`\`\`

## انتقالات العرض: صقلٌ مجاني

تلاشٍ متقاطع بين الصفحات، وصورة مصغرة تتحول إلى هيرو — تفعل View Transitions API في المتصفح ما كان يتطلب مكتبة حركة كاملة. وأجمل ما فيها التحسين التدريجي: المتصفحات غير الداعمة تنتقل فورًا بلا كسر.

## ماذا يعني هذا لحزمة أدواتك

ما زلت أحب Tailwind للسرعة. لكن المنصة صارت تتولى الأجزاء *الصعبة* أصلًا — أي جافاسكربت أقل، واعتماديات أقل، وواجهات تبقى سريعة على الهواتف الرخيصة. أهم مهارة فرونت-إند في 2026 أن تعرف ما لم تعد بحاجة لشحنه.`,
  },
  {
    slug: "core-web-vitals-inp-performance",
    cat: "frontend",
    titleEn: "Core Web Vitals 2026: Winning the INP Era",
    titleAr: "مؤشرات الويب الأساسية 2026: الفوز في عصر INP",
    excerptEn:
      "LCP got easy; INP is where sites lose. A field guide to interaction performance — what to measure, what to defer, and what to delete.",
    excerptAr:
      "تحسين LCP صار سهلًا؛ INP هو حيث تخسر المواقع. دليل ميداني لأداء التفاعل — ماذا تقيس وماذا تؤجل وماذا تحذف.",
    tags: ["Front-End", "Performance", "SEO"],
    readTime: 6,
    bodyEn: `## The metric that separates sites

Largest Contentful Paint is mostly solved: optimize images, stream HTML, preload fonts. **Interaction to Next Paint (INP)** is the new battleground — it measures how fast your page *responds* to every tap and click across the whole session. A beautiful page that freezes for 400ms after a tap is a slow page, whatever its LCP says.

## Where INP dies

1. **Hydration avalanches** — shipping client JavaScript for components that never needed it.
2. **Long tasks** — one 300ms handler blocks every interaction behind it.
3. **Layout thrash** — reading sizes then writing styles in a loop.
4. **Third-party scripts** — the analytics tag you forgot is someone's frozen button.

## The playbook

- **Ship less JavaScript.** Server components, dynamic imports, and deleting dead dependencies beat any micro-optimization.
- **Break long tasks** with \`scheduler.yield()\` (or awaited timeouts) so the browser can paint between chunks.
- **Optimistic UI**: update the interface instantly, reconcile with the server after. A like button must never wait for a network round-trip.
- **CSS over JS** for animation — compositor-driven transforms never block input.
- Measure on a mid-range Android over throttled 4G. Your MacBook lies to you.

## Why SEO people care

Page experience feeds ranking, and INP is the hardest vital to fake. But the real prize is behavioral: fast interactions cut bounce and lift conversions, which search engines read as relevance. Performance is not a lighthouse score — it's compounding trust.`,
    bodyAr: `## المقياس الذي يفرز المواقع

تحسين LCP صار شبه محلول: حسّن الصور، ابثّ HTML، حمّل الخطوط مسبقًا. **الاستجابة للرسم التالي (INP)** هي ساحة المعركة الجديدة — تقيس سرعة *استجابة* صفحتك لكل نقرة عبر الجلسة كاملة. الصفحة الجميلة التي تتجمد 400ms بعد النقر صفحةٌ بطيئة مهما قال LCP.

## أين يموت INP

1. **انهيارات الترطيب** — شحن جافاسكربت عميل لمكونات لم تحتجه يومًا.
2. **المهام الطويلة** — معالج واحد بـ 300ms يحجب كل تفاعل خلفه.
3. **اهتزاز التخطيط** — قراءة الأبعاد ثم كتابة الأنماط في حلقة.
4. **سكربتات الطرف الثالث** — وسم التحليلات المنسي هو زر مجمّد عند مستخدمٍ ما.

## خطة اللعب

- **اشحن جافاسكربت أقل.** مكونات الخادم والاستيراد الديناميكي وحذف الاعتماديات الميتة تتفوق على أي تحسين دقيق.
- **قطّع المهام الطويلة** بـ \`scheduler.yield()\` ليستطيع المتصفح الرسم بين الأجزاء.
- **واجهة متفائلة**: حدّث الواجهة فورًا وسوِّ مع الخادم لاحقًا. زر الإعجاب لا ينتظر رحلة شبكة أبدًا.
- **CSS بدل JS** للحركة — تحويلات المُركِّب لا تحجب الإدخال إطلاقًا.
- قِس على أندرويد متوسط باتصال 4G مخنوق. جهاز الماك يكذب عليك.

## لماذا يهتم أهل السيو

تجربة الصفحة تغذي الترتيب، وINP أصعب مؤشر يمكن تزييفه. لكن الجائزة الحقيقية سلوكية: التفاعلات السريعة تخفض الارتداد وترفع التحويلات، ومحركات البحث تقرأ ذلك كملاءمة. الأداء ليس درجة Lighthouse — إنه ثقة تتراكم.`,
  },
  {
    slug: "typescript-patterns-design-engineers",
    cat: "frontend",
    titleEn: "TypeScript for Design Engineers: Types That Prevent Ugly",
    titleAr: "TypeScript لمهندسي التصميم: أنواع تمنع القبح",
    excerptEn:
      "The type system can enforce design decisions — spacing scales, color tokens, component variants. Make invalid designs unrepresentable.",
    excerptAr:
      "نظام الأنواع يستطيع فرض قرارات التصميم — سلالم المسافات وتوكنز الألوان ومتغيرات المكونات. اجعل التصميم الخاطئ غير قابل للتمثيل.",
    tags: ["Front-End", "TypeScript", "Design Systems"],
    readTime: 5,
    bodyEn: `## Types as design enforcement

Most teams use TypeScript to catch \`undefined\`. Design engineers use it to make **off-system design impossible to write**.

\`\`\`ts
type Space = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
type Tone = "accent" | "neutral" | "danger" | "success";

interface ButtonProps {
  size: "sm" | "md" | "lg";
  tone?: Tone;          // no raw hex ever reaches a component
  iconOnly?: boolean;
}
\`\`\`

A developer physically cannot pass \`padding={13}\` or \`color="#ff0000"\`. The design system stops being a PDF people ignore and becomes a compiler error people fix.

## Variants without chaos

Discriminated unions model real component states better than boolean soup:

\`\`\`ts
type CardProps =
  | { variant: "project"; project: Project }
  | { variant: "article"; article: Article; readTime: number };
\`\`\`

No more \`isArticle && hasProject\` impossible states. Each variant declares exactly what it needs — and autocomplete teaches the system to every new teammate for free.

## satisfies: config with guarantees

\`\`\`ts
const THEME = {
  accent: "#B91942",
  bgBase: "#FAF7F6",
} satisfies Record<string, \\\`#\${string}\\\`>;
\`\`\`

\`satisfies\` validates the shape while preserving the literal values — so \`THEME.accent\` stays typed as its exact string, and a typo'd key fails the build instead of shipping.

## The payoff

Every constraint you encode is a review comment you never write again. On a two-person team that's convenience; across a growing product it's the difference between a design system and a design suggestion.`,
    bodyAr: `## الأنواع كإنفاذ للتصميم

معظم الفرق تستخدم TypeScript لالتقاط \`undefined\`. مهندسو التصميم يستخدمونه ليجعلوا **التصميم خارج النظام مستحيل الكتابة**.

\`\`\`ts
type Space = 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16;
type Tone = "accent" | "neutral" | "danger" | "success";

interface ButtonProps {
  size: "sm" | "md" | "lg";
  tone?: Tone;          // لا يصل hex خام لأي مكوّن
  iconOnly?: boolean;
}
\`\`\`

لا يستطيع المطور فيزيائيًا تمرير \`padding={13}\` أو \`color="#ff0000"\`. يتوقف نظام التصميم عن كونه PDF يتجاهله الجميع ويصبح خطأ ترجمة يصلحه الجميع.

## متغيرات بلا فوضى

الاتحادات المميزة تمثّل حالات المكونات الحقيقية أفضل من حساء القيم المنطقية:

\`\`\`ts
type CardProps =
  | { variant: "project"; project: Project }
  | { variant: "article"; article: Article; readTime: number };
\`\`\`

لا مزيد من حالات \`isArticle && hasProject\` المستحيلة. كل متغير يصرّح بما يحتاجه بالضبط — والإكمال التلقائي يعلّم النظام لكل زميل جديد مجانًا.

## satisfies: إعدادات بضمانات

\`\`\`ts
const THEME = {
  accent: "#B91942",
  bgBase: "#FAF7F6",
} satisfies Record<string, \\\`#\${string}\\\`>;
\`\`\`

يتحقق \`satisfies\` من الشكل مع الحفاظ على القيم الحرفية — فيبقى \`THEME.accent\` بنوع نصه الدقيق، والمفتاح المكتوب خطأً يُفشل البناء بدل أن يصل الإنتاج.

## العائد

كل قيد تُرمّزه هو تعليق مراجعة لن تكتبه مجددًا. في فريق من شخصين هذه راحة؛ وفي منتج ينمو هذا الفرق بين نظام تصميم واقتراح تصميم.`,
  },
];
