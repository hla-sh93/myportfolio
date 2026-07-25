export const productArticles = [
  {
    slug: "ui-designer-to-product-designer",
    cat: "product",
    titleEn: "From UI Designer to Product Designer: Thinking in Outcomes",
    titleAr: "من مصمم واجهات إلى مصمم منتج: التفكير بالنتائج",
    excerptEn:
      "The screens are the last 20%. How the job changes when you own the problem, not the polish — and how to grow into it from a visual background.",
    excerptAr:
      "الشاشات هي آخر 20%. كيف تتغير الوظيفة حين تمتلك المشكلة لا اللمسة الأخيرة — وكيف تنمو إليها من خلفية بصرية.",
    tags: ["Product Design", "Career", "Strategy"],
    readTime: 6,
    bodyEn: `## The question changes

A UI designer asks: *how should this screen look?* A product designer asks: **should this screen exist?**

That shift sounds philosophical; it's practical. On a services app I worked on, the requested feature was "design the pricing calculator page." The product question — *why do users abandon before pricing?* — led to showing an estimate one step earlier. Less UI, more outcome.

## Own the numbers, gently

You don't need a data science degree. You need three habits:

1. Attach a measurable intent to every design: "this flow should cut sign-up drop-off," not "this flow is cleaner."
2. Watch five real users before defending any opinion. Five sessions kill more debates than fifty comments.
3. Ship, measure, iterate — a live "good enough" teaches more than a perfect mockup in review.

## Visual craft is your unfair advantage

Designers who grew up in identity and interfaces bring something PM-track product people rarely have: the ability to make quality *visible* fast. High-fidelity thinking earns trust in rooms where abstract strategy struggles. Don't abandon the craft — aim it at bigger questions.

## The transition plan that works

- Sit in on support calls and sales demos; the roadmap hides there.
- Write one-page briefs before opening the design tool: problem, evidence, bet, metric.
- Present decisions as trade-offs ("faster onboarding costs feature discovery — here's why it's worth it").

Titles follow scope. Take responsibility for an outcome and the role becomes yours before the org chart notices.`,
    bodyAr: `## السؤال يتغير

مصمم الواجهات يسأل: *كيف يجب أن تبدو هذه الشاشة؟* مصمم المنتج يسأل: **هل يجب أن توجد هذه الشاشة أصلًا؟**

يبدو التحول فلسفيًا لكنه عملي تمامًا. في تطبيق خدمات عملت عليه، كان الطلب «صممي صفحة حاسبة الأسعار». سؤال المنتج — *لماذا ينسحب المستخدمون قبل الوصول للسعر؟* — قاد إلى إظهار تقدير مبكر قبل خطوة كاملة. واجهات أقل، نتيجة أكبر.

## امتلك الأرقام بلطف

لا تحتاج شهادة في علم البيانات. تحتاج ثلاث عادات:

1. اربط كل تصميم بنيّة قابلة للقياس: «هذا المسار يجب أن يخفض تسرب التسجيل»، لا «هذا المسار أنظف».
2. راقب خمسة مستخدمين حقيقيين قبل الدفاع عن أي رأي. خمس جلسات تقتل نقاشات أكثر من خمسين تعليقًا.
3. أطلق وقِس وكرر — نسخة حية «جيدة كفاية» تعلّم أكثر من موكاب مثالي في اجتماع مراجعة.

## حِرفتك البصرية ميزتك غير العادلة

المصممون القادمون من الهوية والواجهات يحملون ما يندر عند أهل المنتج القادمين من الإدارة: القدرة على جعل الجودة *مرئية* بسرعة. التفكير عالي الدقة يكسب الثقة في غرف تتعثر فيها الاستراتيجية المجردة. لا تهجر الحِرفة — صوّبها نحو أسئلة أكبر.

## خطة الانتقال التي تنجح

- احضر مكالمات الدعم وعروض المبيعات؛ خارطة الطريق مختبئة هناك.
- اكتب بريفًا من صفحة قبل فتح أداة التصميم: المشكلة، الدليل، الرهان، المقياس.
- قدّم قراراتك كمقايضات («تسجيل أسرع يكلفنا اكتشاف الميزات — وهذا سبب استحقاقه»).

الألقاب تتبع النطاق. تحمّل مسؤولية نتيجةٍ ما، وسيصبح الدور دورك قبل أن يلاحظ الهيكل التنظيمي.`,
  },
  {
    slug: "design-engineering-handoff-is-dead",
    cat: "product",
    titleEn: "The Handoff Is Dead: Design Engineering in 2026",
    titleAr: "التسليم التقليدي انتهى: هندسة التصميم في 2026",
    excerptEn:
      "Red-line specs and 'final' mockups produced broken products for a decade. The teams shipping the best UI merged the roles instead.",
    excerptAr:
      "مواصفات القياسات والموكابات «النهائية» أنتجت منتجات مكسورة لعقد كامل. الفرق التي تشحن أفضل الواجهات دمجت الدورين.",
    tags: ["Product Design", "Design Engineering", "Workflow"],
    readTime: 6,
    bodyEn: `## Where handoff always broke

The classic pipeline — design finishes, engineering receives — fails at exactly the places users live: loading states, error copy, keyboard focus, an Arabic string twice the English length, a name that wraps to three lines. None of those exist in a static mockup. They surface in code, at which point "the design" and "the product" quietly diverge.

## What replaced it

**Design engineering**: one person (or one tightly-paired duo) owning the pixel *and* the component.

- The design system lives in code; Figma mirrors it, not the reverse.
- Tokens sync automatically — a color changed in the source changes everywhere.
- Prototypes are built in the real stack, with real data, in the real browser. The prototype *is* the first draft of production.

My own workflow: rough exploration in the design tool, then straight to components. Typography rhythm, spacing, motion — tuned where they'll actually render, against real content, in both directions (RTL included from commit one, not sprint twelve).

## Why 2026 tipped it

AI made the translation layer pointless. Generating a first-pass component from a design costs minutes — so the value moved entirely to *judgment*: does this feel right at 60fps, on a cheap phone, with real Arabic strings? Someone who can see and ship is faster than a see-er handing to a shipper.

## If your team can't merge roles

Minimum viable version: designers review built UI (not screenshots) before anything merges, engineers get tokens instead of hex codes, and every spec includes empty, loading, error, and overflow states. Handoff dies as a moment and becomes a conversation.`,
    bodyAr: `## أين كان التسليم ينكسر دائمًا

خط الأنابيب الكلاسيكي — التصميم ينتهي والهندسة تستلم — يفشل تحديدًا حيث يعيش المستخدمون: حالات التحميل، نصوص الأخطاء، تركيز لوحة المفاتيح، نص عربي بضعف طول الإنجليزي، واسم يلتف على ثلاثة أسطر. لا شيء من هذا موجود في الموكاب الثابت. تظهر كلها في الكود، وحينها يفترق «التصميم» و«المنتج» بصمت.

## ما الذي حل محله

**هندسة التصميم**: شخص واحد (أو ثنائي متلاصق) يمتلك البكسل *و* المكوّن معًا.

- نظام التصميم يعيش في الكود؛ وفيغما تعكسه لا العكس.
- التوكنز تتزامن آليًا — لون يتغير في المصدر يتغير في كل مكان.
- النماذج تُبنى في الحزمة الحقيقية، ببيانات حقيقية، في المتصفح الحقيقي. النموذج *هو* المسودة الأولى للإنتاج.

منهجيتي: استكشاف سريع في أداة التصميم، ثم مباشرة إلى المكونات. إيقاع الخطوط والمسافات والحركة تُضبط حيث ستُعرض فعلًا، على محتوى حقيقي، وبالاتجاهين (RTL من أول كوميت لا من السبرنت الثاني عشر).

## لماذا حسمت 2026 الأمر

جعل الذكاء الاصطناعي طبقة الترجمة بلا معنى. توليد مكوّن أولي من تصميم يكلف دقائق — فانتقلت القيمة كلها إلى *الحُكم*: هل يبدو هذا صحيحًا عند 60 إطارًا، على هاتف رخيص، بنصوص عربية حقيقية؟ من يرى ويشحن أسرع ممن يرى ثم يسلّم لمن يشحن.

## إن لم يستطع فريقك دمج الأدوار

الحد الأدنى القابل للتطبيق: المصممون يراجعون الواجهة المبنية (لا لقطات الشاشة) قبل أي دمج، والمهندسون يستلمون توكنز لا أكواد ألوان، وكل مواصفة تشمل حالات الفراغ والتحميل والخطأ والفيض. يموت التسليم كلحظة ويصبح حوارًا.`,
  },
  {
    slug: "ux-research-on-a-budget",
    cat: "product",
    titleEn: "UX Research on a Budget: Evidence Without a Lab",
    titleAr: "أبحاث تجربة المستخدم بميزانية محدودة: أدلة بلا مختبر",
    excerptEn:
      "No research team? You still can't afford to guess. Five lightweight methods that fit real deadlines — and the traps that make cheap research worthless.",
    excerptAr:
      "لا يوجد فريق أبحاث؟ ما زلت لا تملك ترف التخمين. خمس طرق خفيفة تناسب المواعيد الحقيقية — والفخاخ التي تجعل البحث الرخيص بلا قيمة.",
    tags: ["Product Design", "UX Research", "Process"],
    readTime: 5,
    bodyEn: `## Guessing is the expensive option

Teams skip research to "save time," then spend three sprints building the wrong thing. The math never works. The good news: 80% of the value comes from methods that cost hours, not budgets.

## Five methods that fit real life

1. **Five-user tests.** Five people attempting real tasks on a prototype expose the majority of usability failures. Watch silently; count where they hesitate.
2. **Hallway + WhatsApp tests.** For MENA audiences especially, a screen recording sent to ten users in a voice-note culture returns brutally honest feedback within a day.
3. **First-click tests.** Show a screen for five seconds, ask "where would you tap to X?" If first clicks scatter, the hierarchy failed — no lab needed.
4. **Support-ticket mining.** Your existing complaints are a free, continuous usability study. Tag them monthly; the top three tags are your roadmap.
5. **Fake-door tests.** A button for the unbuilt feature measures demand before you invest a sprint. Use honestly ("coming soon — want it?").

## The traps that ruin cheap research

- Asking "do you like it?" — people are polite. Ask them to *do*, then watch.
- Testing on colleagues who share your context.
- Treating one loud user as a pattern. Patterns need three independent occurrences.
- Researching to confirm a decision already made — that's theater, not research.

## Make it a habit, not a phase

One hour of user contact per week beats a quarterly study. Evidence compounds — and so does the confidence to say "no" to loud opinions, including your own.`,
    bodyAr: `## التخمين هو الخيار الباهظ

تتخطى الفرق البحث «لتوفير الوقت»، ثم تقضي ثلاثة سبرنتات في بناء الشيء الخاطئ. الحسبة لا تنجح أبدًا. والخبر الجيد: 80% من القيمة تأتي من طرق تكلف ساعات لا ميزانيات.

## خمس طرق تناسب الحياة الحقيقية

1. **اختبارات الخمسة مستخدمين.** خمسة أشخاص يحاولون مهام حقيقية على نموذج يكشفون أغلب إخفاقات الاستخدام. راقب بصمت وعُدّ مواضع التردد.
2. **اختبارات الممر والواتساب.** لجمهور منطقتنا خصوصًا، تسجيل شاشة يُرسل لعشرة مستخدمين في ثقافة الرسائل الصوتية يعيد صراحة قاسية خلال يوم.
3. **اختبار النقرة الأولى.** اعرض شاشة خمس ثوانٍ واسأل «أين تنقر لتفعل كذا؟». إن تشتتت النقرات الأولى فقد فشل التسلسل — بلا مختبر.
4. **تنقيب تذاكر الدعم.** شكاواك الحالية دراسة استخدام مجانية مستمرة. وسمها شهريًا؛ أعلى ثلاثة وسوم هي خارطة طريقك.
5. **اختبار الباب الوهمي.** زر لميزة لم تُبنَ بعد يقيس الطلب قبل استثمار سبرنت. استخدمه بصدق («قريبًا — أتريدها؟»).

## الفخاخ التي تفسد البحث الرخيص

- سؤال «هل أعجبك؟» — الناس مهذبون. اطلب منهم أن *يفعلوا* ثم راقب.
- الاختبار على زملاء يشاركونك السياق.
- معاملة مستخدم واحد صاخب كنمط. النمط يحتاج ثلاث حالات مستقلة.
- البحث لتأكيد قرار متخذ سلفًا — هذا مسرح لا بحث.

## اجعلها عادة لا مرحلة

ساعة تواصل مع المستخدمين أسبوعيًا تتفوق على دراسة فصلية. الأدلة تتراكم — ومعها الثقة لقول «لا» للآراء الصاخبة، بما فيها رأيك أنت.`,
  },
  {
    slug: "designing-ai-native-product-experiences",
    cat: "product",
    titleEn: "Designing AI-Native Products: Trust Is the Interface",
    titleAr: "تصميم منتجات الذكاء الاصطناعي: الثقة هي الواجهة",
    excerptEn:
      "Chat boxes are not a strategy. Patterns for AI features people actually adopt — visible confidence, graceful failure, and control that feels real.",
    excerptAr:
      "صناديق الدردشة ليست استراتيجية. أنماط لميزات ذكاء اصطناعي يتبناها الناس فعلًا — ثقة مرئية وفشل رشيق وتحكم حقيقي.",
    tags: ["Product Design", "AI", "UX"],
    readTime: 6,
    bodyEn: `## Beyond the chat box

The first AI wave bolted a chat window onto every product and called it innovation. Users disagreed: a blank text box is the *hardest* interface ever shipped — infinite options, zero guidance.

AI-native design starts elsewhere: **where in the existing flow does intelligence remove work?** Autofilled drafts, suggested next steps, summaries where walls of text used to be. The best AI features don't look like AI; they look like the product got smarter.

## Trust patterns that work

- **Show confidence honestly.** "I found 3 matching invoices" beats a fabricated certain answer. Hedging where the model hedges builds long-term trust.
- **Sources or it didn't happen.** Every claim that matters links to where it came from.
- **Preview before commit.** AI proposes; the user disposes. Nothing irreversible happens without a human glance — deletion, sending, publishing stay behind a confirm.
- **Escape hatches everywhere.** Edit the draft, regenerate, or ignore entirely. Adoption grows when refusing the AI is effortless.

## Design the failure first

An AI feature is defined by its worst response, not its demo. Write the empty state, the wrong-answer state, and the "I can't do that" state before the happy path. Users forgive limits; they don't forgive confident nonsense.

## The metric that matters

Not "AI engagement" — **task completion with less effort**. If the feature can't beat the manual path on real tasks within two weeks of instrumentation, it's a demo, not a product. Trust compounds slowly and burns instantly; design like it.`,
    bodyAr: `## ما بعد صندوق الدردشة

الموجة الأولى من الذكاء الاصطناعي ألصقت نافذة دردشة بكل منتج وسمّتها ابتكارًا. المستخدمون لم يوافقوا: مربع نص فارغ هو أصعب واجهة شُحنت يومًا — خيارات لا نهائية وإرشاد صفري.

التصميم الأصيل للذكاء الاصطناعي يبدأ من مكان آخر: **أين في المسار الحالي تُزيل الذكاءُ عملًا؟** مسودات معبأة تلقائيًا، خطوات تالية مقترحة، وملخصات حيث كانت جدران النصوص. أفضل ميزات الذكاء الاصطناعي لا تبدو ذكاءً اصطناعيًا؛ تبدو وكأن المنتج صار أذكى.

## أنماط الثقة التي تنجح

- **أظهر الثقة بصدق.** «وجدت 3 فواتير مطابقة» تتفوق على إجابة واثقة مختلقة. التحفظ حيث يتحفظ النموذج يبني ثقة طويلة الأمد.
- **مصادر وإلا لم يحدث.** كل ادعاء مهم يرتبط بمصدره.
- **معاينة قبل الالتزام.** الذكاء يقترح والمستخدم يقرر. لا شيء لا رجعة فيه يحدث دون نظرة بشرية — الحذف والإرسال والنشر خلف تأكيد دائمًا.
- **مخارج طوارئ في كل مكان.** عدّل المسودة أو أعد التوليد أو تجاهل كليًا. التبني ينمو حين يكون رفض الذكاء بلا مجهود.

## صمم الفشل أولًا

ميزة الذكاء الاصطناعي يعرّفها أسوأ ردودها لا عرضها التسويقي. اكتب حالة الفراغ وحالة الجواب الخاطئ وحالة «لا أستطيع» قبل المسار السعيد. يغفر المستخدمون الحدود؛ ولا يغفرون الهراء الواثق.

## المقياس الذي يهم

ليس «تفاعل الذكاء الاصطناعي» — بل **إنجاز المهمة بجهد أقل**. إن لم تتفوق الميزة على المسار اليدوي في مهام حقيقية خلال أسبوعين من القياس، فهي عرض تجريبي لا منتج. الثقة تتراكم ببطء وتحترق فورًا؛ صمم على هذا الأساس.`,
  },
];
