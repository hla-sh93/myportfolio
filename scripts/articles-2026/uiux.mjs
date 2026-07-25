export const uiuxArticles = [
  {
    slug: "ai-assisted-design-workflow-2026",
    cat: "uiux",
    titleEn: "Designing With AI in 2026: A Workflow That Keeps the Craft",
    titleAr: "التصميم مع الذكاء الاصطناعي في 2026: منهجية تحافظ على الحِرفة",
    excerptEn:
      "AI tools can draft screens in seconds — but taste, hierarchy, and intent still come from the designer. Here is the workflow I actually use.",
    excerptAr:
      "أدوات الذكاء الاصطناعي ترسم الشاشات في ثوانٍ — لكن الذوق والتسلسل البصري والقصد تبقى مسؤولية المصمم. هذه المنهجية التي أستخدمها فعلًا.",
    tags: ["UI/UX", "AI", "Workflow"],
    readTime: 6,
    bodyEn: `## The wrong question

Every design team I talk to asks the same thing: "Will AI replace designers?" It's the wrong question. The right one is: **which parts of my process deserve my full attention, and which parts can I delegate?**

After a year of running AI inside real client projects, my answer is a three-layer workflow.

## Layer 1 — Delegate the drafts

AI is excellent at the *first 60%*: layout variations, placeholder copy, empty states you forgot, quick style explorations. I treat these outputs like sketches from a fast junior — useful raw material, never the final word.

- Generate 3–5 directions, not one "perfect" screen.
- Ask for structure first (wireframe-level), style second.
- Never let AI invent brand elements — logos, colors, and voice are sacred.

## Layer 2 — Own the decisions

The 40% that remains is the actual job: information hierarchy, flow logic, edge cases, accessibility, and the emotional temperature of the product. AI can propose; it cannot *decide*. Every screen that ships still goes through my checklist:

1. Can a first-time user tell what matters most in 3 seconds?
2. Does the RTL version feel designed, not mirrored?
3. Do error and empty states respect the user's time?

## Layer 3 — Verify like an engineer

The biggest 2026 shift is that designers verify AI output the way engineers review generated code. Contrast ratios, spacing tokens, real content lengths, Arabic text rendering — all checked, never assumed.

## The takeaway

AI made average design cheaper and great design more valuable. The designers who win are not the ones who prompt best — they are the ones who **know what good looks like** and can direct any tool, human or machine, toward it.`,
    bodyAr: `## السؤال الخاطئ

كل فريق تصميم أتحدث معه يسأل السؤال نفسه: «هل سيستبدل الذكاء الاصطناعي المصممين؟» وهو سؤال خاطئ. السؤال الصحيح: **أي أجزاء من عمليتي تستحق تركيزي الكامل، وأيها يمكن تفويضه؟**

بعد سنة كاملة من استخدام الذكاء الاصطناعي في مشاريع حقيقية، إجابتي هي منهجية من ثلاث طبقات.

## الطبقة الأولى — فوّض المسودات

الذكاء الاصطناعي ممتاز في *أول 60%*: تنويعات التخطيط، النصوص المؤقتة، الحالات الفارغة التي نسيتها، واستكشافات الستايل السريعة. أتعامل مع هذه المخرجات كرسومات أولية من مساعد سريع — مادة خام مفيدة، وليست القرار النهائي أبدًا.

- اطلب 3–5 اتجاهات، لا شاشة «مثالية» واحدة.
- ابدأ بالهيكل (مستوى الوايرفريم)، ثم الستايل.
- لا تدع الذكاء الاصطناعي يخترع عناصر الهوية — الشعار والألوان والصوت خطوط حمراء.

## الطبقة الثانية — امتلك القرارات

الـ 40% المتبقية هي الوظيفة الحقيقية: التسلسل المعلوماتي، منطق الرحلات، الحالات الحدّية، إمكانية الوصول، ودرجة حرارة المنتج العاطفية. الذكاء الاصطناعي يقترح، لكنه لا *يقرر*. كل شاشة تصل للمستخدم تمر على قائمتي:

1. هل يعرف المستخدم الجديد ما الأهم خلال 3 ثوانٍ؟
2. هل النسخة العربية RTL مصممة فعلًا لا معكوسة آليًا؟
3. هل تحترم حالات الخطأ والفراغ وقت المستخدم؟

## الطبقة الثالثة — تحقّق كمهندس

أكبر تحوّل في 2026 أن المصممين صاروا يراجعون مخرجات الذكاء الاصطناعي كما يراجع المهندسون الكود المولّد: نسب التباين، مسافات النظام، أطوال المحتوى الحقيقية، وعرض النص العربي — كلها تُفحص ولا تُفترض.

## الخلاصة

الذكاء الاصطناعي جعل التصميم المتوسط أرخص، والتصميم العظيم أغلى قيمة. المصممون الرابحون ليسوا الأمهر في كتابة الأوامر — بل من **يعرفون شكل الجودة** ويوجهون أي أداة نحوها.`,
  },
  {
    slug: "arabic-rtl-ux-design-guide",
    cat: "uiux",
    titleEn: "Arabic-First RTL Design: The Guide I Wish Existed",
    titleAr: "دليل التصميم العربي RTL: الدليل الذي تمنيت وجوده",
    excerptEn:
      "Flipping an English layout is not Arabic design. A practical guide to typography, direction, numerals, and layout decisions for Arabic-first products.",
    excerptAr:
      "عكس التصميم الإنجليزي ليس تصميمًا عربيًا. دليل عملي للخطوط والاتجاه والأرقام وقرارات التخطيط للمنتجات العربية أولًا.",
    tags: ["UI/UX", "RTL", "Arabic"],
    readTime: 7,
    bodyEn: `## Mirrored is not designed

Most "Arabic versions" are English products with the CSS flipped. Users feel the difference immediately: type set too small, broken numerals, icons pointing the wrong way, and copy that reads like a translation memo.

Designing Arabic-first means making decisions **in Arabic** from the start.

## Typography carries everything

Arabic script is visually denser and sits lower than Latin. Three rules I never break:

- **Body text starts at 17px**, not 16 — Arabic reads smaller at equal size, and line-height needs 1.7–1.9.
- Pick the Arabic face first, then pair a Latin twin (Tajawal + Poppins is my go-to geometric pair).
- Display Arabic is a design asset — a bold Arabic headline at 90px has a calligraphic presence Latin cannot match. Use it.

## Direction is logic, not decoration

- Use CSS logical properties (\`margin-inline-start\`, \`padding-inline-end\`) so the layout flows naturally in both directions.
- Mirror directional icons (arrows, back, chevrons). Never mirror logos, media controls, or checkmarks.
- Numbers, phone numbers, and code stay LTR inside RTL text — wrap them in \`dir="ltr"\` spans.

## The details users notice

1. Keep Western digits (1, 2, 3) if your audience spans MENA — they scan faster and match prices everywhere.
2. Slide animations must flip with the reading direction.
3. Forms: labels right-aligned, but keep field masks (email, URL) LTR.
4. Write microcopy natively — warm, short Arabic beats literal translation every time.

## Why it pays

Arabic digital content is scarce relative to its audience. Products that respect the script don't just avoid complaints — they earn loyalty in a market where most competitors ship mirrored English. That gap is a design opportunity.`,
    bodyAr: `## المعكوس ليس مُصمَّمًا

معظم «النسخ العربية» منتجات إنجليزية عُكست بالـ CSS. والمستخدم يشعر بالفرق فورًا: خط أصغر من اللازم، أرقام مكسورة، أيقونات باتجاه خاطئ، ونصوص تُقرأ كمذكرة ترجمة.

التصميم العربي أولًا يعني اتخاذ القرارات **بالعربية** من البداية.

## الخط يحمل كل شيء

الحرف العربي أكثف بصريًا ويجلس أخفض من اللاتيني. ثلاث قواعد لا أكسرها:

- **نص المتن يبدأ من 17px** لا 16 — العربية تُقرأ أصغر عند نفس الحجم، وتحتاج ارتفاع سطر 1.7–1.9.
- اختر الخط العربي أولًا ثم زاوجه بتوأم لاتيني (Tajawal مع Poppins زوجي الهندسي المفضل).
- العناوين العربية الكبيرة أصل تصميمي — عنوان عربي جريء بحجم 90px له حضور خطّي لا يضاهيه اللاتيني. استخدمه.

## الاتجاه منطق لا زخرفة

- استخدم خصائص CSS المنطقية (\`margin-inline-start\` و\`padding-inline-end\`) ليتدفق التخطيط طبيعيًا بالاتجاهين.
- اعكس الأيقونات الاتجاهية (الأسهم، الرجوع). ولا تعكس أبدًا الشعارات أو أزرار الميديا أو علامات الصح.
- الأرقام وأرقام الهواتف والكود تبقى LTR داخل النص العربي — غلّفها بـ \`dir="ltr"\`.

## التفاصيل التي يلاحظها المستخدم

1. أبقِ الأرقام الغربية (1، 2، 3) إن كان جمهورك يمتد عبر المنطقة — تُمسح بصريًا أسرع وتطابق الأسعار في كل مكان.
2. حركات الانزلاق يجب أن تنعكس مع اتجاه القراءة.
3. النماذج: التسميات لليمين، لكن حقول البريد والروابط تبقى LTR.
4. اكتب النصوص الصغيرة بعربية أصلية — جملة قصيرة دافئة تتفوق على أي ترجمة حرفية.

## لماذا يستحق الجهد

المحتوى الرقمي العربي نادر نسبةً إلى جمهوره. المنتجات التي تحترم الحرف لا تتجنب الشكاوى فحسب — بل تكسب ولاءً في سوق ينشر فيه معظم المنافسين إنجليزية معكوسة. هذه الفجوة فرصة تصميمية حقيقية.`,
  },
  {
    slug: "design-tokens-multi-brand-systems",
    cat: "uiux",
    titleEn: "Design Tokens in 2026: Systems That Survive Redesigns",
    titleAr: "توكنز التصميم في 2026: أنظمة تنجو من إعادة التصميم",
    excerptEn:
      "Color palettes die; decision systems live. How to structure tokens, variables, and themes so your design system survives its third rebrand.",
    excerptAr:
      "لوحات الألوان تموت؛ أنظمة القرارات تعيش. كيف تبني التوكنز والمتغيرات والثيمات لينجو نظامك التصميمي من ثالث إعادة هوية.",
    tags: ["UI/UX", "Design Systems", "Tokens"],
    readTime: 6,
    bodyEn: `## The system is the decisions, not the colors

A design system that stores \`#B91942\` in forty places is a liability. A system that stores **"accent"** in one place, and maps it to \`#B91942\` today, is an asset that survives every rebrand.

Tokens are simply named decisions. The craft is naming the *right* decisions.

## Three tiers that keep you sane

- **Primitive tokens** — raw values: \`wine-600\`, \`gray-100\`, \`space-4\`. No opinions, just a palette.
- **Semantic tokens** — meanings: \`accent\`, \`bg-elevated\`, \`text-secondary\`, \`danger\`. This is the layer components consume.
- **Component tokens** — only when a component genuinely deviates: \`button-radius\`, \`card-blur\`.

The rule: **components never touch primitives.** When the brand shifts from purple to wine crimson, you change one mapping and the entire product follows — light mode, dark mode, marketing pages, everything.

## Dark mode is a theme, not an inversion

Inverted light palettes look cheap. Dark mode needs its own semantic mapping: backgrounds get warmer or cooler on purpose, accents *glow* instead of fill, elevation becomes lighter-not-shadowed. Same token names, different intent.

## Sync design and code or die drifting

In 2026 there is no excuse for a Figma palette and a CSS file disagreeing. Variables in the design tool export to CSS custom properties; CI fails when a hex appears outside the token file. One source of truth, two renderers.

## Start smaller than you think

Eight semantic colors, one type scale, one spacing scale. A small system used everywhere beats a complete system used nowhere. Grow tokens when a real need repeats three times — not before.`,
    bodyAr: `## النظام هو القرارات لا الألوان

نظام تصميم يخزّن \`#B91942\` في أربعين مكانًا عبءٌ ثقيل. أما نظام يخزّن **"accent"** في مكان واحد ويربطه اليوم بـ \`#B91942\`، فهو أصلٌ ينجو من كل إعادة هوية.

التوكنز ببساطة قرارات مسماة. والحِرفة في تسمية القرارات *الصحيحة*.

## ثلاث طبقات تحفظ عقلك

- **توكنز أولية** — قيم خام: \`wine-600\`، \`gray-100\`، \`space-4\`. بلا آراء، مجرد لوحة.
- **توكنز دلالية** — معانٍ: \`accent\`، \`bg-elevated\`، \`text-secondary\`، \`danger\`. هذه الطبقة التي تستهلكها المكونات.
- **توكنز المكونات** — فقط عندما يخالف مكونٌ القاعدة فعلًا: \`button-radius\`، \`card-blur\`.

القاعدة: **المكونات لا تلمس الأوليات أبدًا.** حين تتحول الهوية من البنفسجي إلى النبيذي، تغيّر ربطًا واحدًا فيتبع المنتج كله — الوضع الفاتح والداكن وصفحات التسويق، كل شيء.

## الوضع الداكن ثيم مستقل لا انعكاس

اللوحات الفاتحة المعكوسة تبدو رخيصة. الوضع الداكن يحتاج ربطه الدلالي الخاص: خلفيات أدفأ أو أبرد عن قصد، ولمسات لونية *تتوهج* بدل أن تملأ، وارتفاعٌ يُظهره الفاتح لا الظل. أسماء التوكنز نفسها، بنيّة مختلفة.

## زامن التصميم والكود أو انجرف

في 2026 لا عذر لاختلاف لوحة فيغما عن ملف CSS. متغيرات أداة التصميم تُصدَّر لخصائص CSS مخصصة، والـ CI يفشل حين يظهر لون خام خارج ملف التوكنز. مصدر حقيقة واحد، وعارضان.

## ابدأ أصغر مما تظن

ثمانية ألوان دلالية، سلّم خطي واحد، سلّم مسافات واحد. نظام صغير يُستخدم في كل مكان يتفوق على نظام كامل لا يستخدمه أحد. وسّع التوكنز حين تتكرر حاجة حقيقية ثلاث مرات — لا قبلها.`,
  },
  {
    slug: "motion-ux-microinteractions-2026",
    cat: "uiux",
    titleEn: "Motion UX in 2026: Microinteractions That Respect the User",
    titleAr: "حركة الواجهات في 2026: تفاعلات دقيقة تحترم المستخدم",
    excerptEn:
      "Delight is a feature until it's a delay. How to design microinteractions that feel alive on a flagship phone and invisible on a weak connection.",
    excerptAr:
      "البهجة ميزة حتى تصبح تأخيرًا. كيف تصمم تفاعلات دقيقة تنبض بالحياة على هاتف حديث وتختفي بأدب على اتصال ضعيف.",
    tags: ["UI/UX", "Motion", "Accessibility"],
    readTime: 5,
    bodyEn: `## Motion is communication

Every animation answers a question: *Where did this come from? What just happened? What can I do next?* If a movement doesn't answer one of those, it's decoration — and decoration has a cost.

## The 2026 baseline

Users now expect interfaces to feel physical: springs instead of linear easings, elements that respond to the cursor before the click, transitions that preserve context between pages. The tools finally match the ambition — the View Transitions API, scroll-driven animations, and spring physics in every major framework.

But the same year gave us stricter judges: Core Web Vitals punish interaction delay, and \`prefers-reduced-motion\` adoption keeps climbing.

## My four rules

1. **Reveal once.** Scroll-triggered animations fire on the way down, never again on the way up. Re-animating content the user already saw is noise.
2. **Never block content.** Text renders instantly; motion layers on top. A hero that waits for its animation is a broken hero.
3. **Springs, 200–350ms.** Fast enough to feel responsive, physical enough to feel alive. If an animation takes 600ms, it happens to the user, not for them.
4. **Reduced motion is a first-class theme.** Not a stripped version — a calm version. Opacity fades stay; movement goes.

## Budget every delight

My rule from the portfolio you're reading: every playful moment costs at most 5KB of JavaScript and must be deletable without breaking layout. Delight should be a gift the interface gives — never a tax it collects.`,
    bodyAr: `## الحركة تواصُل

كل حركة تجيب عن سؤال: *من أين جاء هذا؟ ماذا حدث للتو؟ ماذا أفعل الآن؟* إن لم تُجب الحركة عن أحد هذه الأسئلة فهي زخرفة — وللزخرفة ثمن.

## خط الأساس في 2026

يتوقع المستخدمون اليوم واجهات ذات إحساس مادي: نوابض بدل المنحنيات الخطية، عناصر تستجيب للمؤشر قبل النقر، وانتقالات تحفظ السياق بين الصفحات. والأدوات أخيرًا بمستوى الطموح — View Transitions API والحركات المقادة بالتمرير وفيزياء النوابض في كل إطار عمل.

لكن السنة نفسها جاءت بحكّام أقسى: مؤشرات الويب الأساسية تعاقب تأخير التفاعل، واعتماد \`prefers-reduced-motion\` في صعود مستمر.

## قواعدي الأربع

1. **اكشف مرة واحدة.** حركات التمرير تعمل في النزول الأول فقط، ولا تتكرر في الصعود. إعادة تحريك محتوى رآه المستخدم ضجيج.
2. **لا تحجب المحتوى أبدًا.** النص يظهر فورًا والحركة طبقة فوقه. الهيرو الذي ينتظر حركته هيرو معطّل.
3. **نوابض، 200–350 مللي ثانية.** أسرع من أن تُشعر بالبطء، وأكثر مادية من أن تبدو آلية. الحركة التي تستغرق 600ms تحدث *على* المستخدم لا *له*.
4. **الحركة المخفّضة ثيم من الدرجة الأولى.** ليست نسخة مبتورة بل نسخة هادئة: تلاشي الشفافية يبقى، والانتقال المكاني يذهب.

## ضع ميزانية لكل بهجة

قاعدتي في الموقع الذي تقرأه الآن: كل لمسة مرحة تكلف 5KB جافاسكربت كحد أقصى، ويجب أن تكون قابلة للحذف دون كسر التخطيط. البهجة هدية تقدمها الواجهة — لا ضريبة تجبيها.`,
  },
];
