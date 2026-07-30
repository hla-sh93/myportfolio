/**
 * Fills in the case-study body for each project.
 *
 * Every project in the gallery used to render the same way: a cover, one
 * paragraph, a grid of screenshots. A visitor opened the maritime portals
 * and said he could not tell that the work involved ship registration or
 * document verification at all — which was fair, because nothing on the page
 * said so. `bodyEn`/`bodyAr` were null on all 33 entries, so the detail
 * section never rendered.
 *
 * The bodies are markdown and follow the same three beats — the situation,
 * a concrete list of what the thing actually does, and the design decision
 * behind it. Nothing here is invented: the lists come from the delivered
 * screens and from the descriptions already approved for each project.
 *
 * Run per batch: node scripts/write-project-bodies.mjs <batch>
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DATA = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "projects.json"
);

const BATCHES = {};

/* ── Batch 1 — the work a visitor is most likely to misread ─────────────── */

BATCHES["1"] = {
  "maritime-flag-administrations": {
    en: `## A flag state is a registry before it is a website

When a shipowner registers a vessel under a foreign flag, the administration behind that flag becomes their regulator: it issues the certificates the ship sails on, authorises the organisations that survey it, and answers the port inspector who asks whether a document is genuine. That work is procedural, high-stakes and mostly invisible — and it has to be legible online to people in four different situations at once.

The ten administrations came to me as ten separate clients with the same brief and no shared template. Zimbabwe regulates inland waterways from Lake Kariba to the Zambezi. Haiti registers vessels and certifies crew. Alliance is an independent classification and inspection body operating on delegated flag authorisations. Different mandates, one recurring information problem.

## What the portals had to carry

- **Ship registration** — how a vessel joins the register, and what the owner has to produce to do it
- **Certification** — the maritime certificates the administration issues, and crew certification alongside them
- **Document verification** — a public route for a port officer or a broker to check that a certificate is real, which is the single most consequential thing on any of these sites
- **Approved organisations** — the recognised bodies and surveyors the flag has authorised to act for it
- **Surveys and inspections** — carried out against international conventions and class rules
- **Safety, security and environmental oversight** — including compliance with IMO standards
- **Port-state support** — guidance for owners dealing with an inspection abroad
- **National overview** — the country's waters, fleet and maritime standing

## One skeleton, ten identities

The temptation with a family like this is to ship the same site ten times in different colours. That fails the client, because a flag administration's credibility rests partly on looking like a national institution rather than a franchise.

So the information architecture is shared — the same routes to registration, certification, verification and approved organisations, because those are the four things every visitor arrives for — while the surface is rebuilt each time. Zimbabwe runs deep green and gold against inland water. Nicaragua is cream and navy. Haiti opens on four plain statements of mandate instead of a hero slogan. Verification is never buried more than one click from the header on any of them.

I designed and built each front end in Next.js and React, for clients in the UAE.`,
    ar: `## دولة العَلَم سجلٌّ قبل أن تكون موقعًا

حين يسجّل مالك سفينة سفينته تحت علم دولة أخرى، تصبح الإدارة البحرية لتلك الدولة جهته التنظيمية: هي التي تُصدر الشهادات التي تُبحر السفينة بموجبها، وتفوّض المؤسسات التي تعاينها، وتردّ على مفتّش الميناء حين يسأل إن كانت وثيقةٌ ما صحيحة. عملٌ إجرائي، عالي المسؤولية، وغير مرئي في معظمه — وعليه أن يكون واضحًا على الإنترنت أمام أربع فئات مختلفة في آن واحد.

وصلتني الإدارات العشر بوصفها عشرة عملاء منفصلين، بالمطلب نفسه ودون قالب مشترك. زيمبابوي تنظّم الملاحة في المياه الداخلية من بحيرة كاريبا إلى نهر الزامبيزي. هايتي تسجّل السفن وتمنح شهادات الطواقم. وألاينس هيئة تصنيف ومعاينة مستقلة تعمل بتفويضات عَلَم. ولايات مختلفة، ومسألة معلوماتية واحدة تتكرّر.

## ما كان على البوّابات أن تحمله

- **تسجيل السفن** — كيف تنضمّ السفينة إلى السجلّ، وما الذي على المالك تقديمه
- **إصدار الشهادات** — الشهادات البحرية التي تصدرها الإدارة، وشهادات الطواقم إلى جانبها
- **التحقّق من الوثائق** — مسار عام يتيح لضابط ميناء أو وسيط أن يتأكّد من صحّة شهادة، وهو أكثر ما يترتّب عليه أثر في هذه المواقع كلّها
- **المؤسسات المعتمدة** — الهيئات والمعاينون المعترف بهم الذين فوّضتهم الدولة للعمل باسمها
- **المسوحات والمعاينات** — وفق الاتفاقيات الدولية وقواعد التصنيف
- **الرقابة على السلامة والأمن والبيئة** — بما يشمل الالتزام بمعايير المنظمة البحرية الدولية
- **دعم دولة الميناء** — إرشاد المالكين في التعامل مع تفتيش خارج بلدهم
- **اللمحة الوطنية** — مياه الدولة وأسطولها ومكانتها البحرية

## هيكل واحد، وعشر هويات

الإغراء في عائلة كهذه أن تُسلَّم البوّابة نفسها عشر مرات بألوان مختلفة. وهذا يخذل العميل، لأن جزءًا من مصداقية الإدارة البحرية قائم على أن تبدو مؤسسة وطنية لا فرعًا في سلسلة.

لذلك بقيت بنية المعلومات مشتركة — المسارات نفسها إلى التسجيل والشهادات والتحقّق والمؤسسات المعتمدة، لأنها الأربعة التي يأتي كل زائر من أجلها — بينما أُعيد بناء السطح في كل مرة. زيمبابوي بالأخضر الغامق والذهبي على خلفية مياه داخلية. نيكاراغوا بالكريمي والكحلي. وهايتي تفتتح بأربع عبارات مباشرة عن ولايتها بدل شعار ترويجي. والتحقّق من الوثائق لا يبتعد في أيٍّ منها أكثر من نقرة واحدة عن الشريط العلوي.

صمّمت كل واجهة وبنيتها بـ Next.js وReact، لعملاء في الإمارات.`,
  },

  "saab-logistics": {
    en: `## The lead arrives on WhatsApp, not through a form

SAAB Logistics moves cargo through Lattakia Port. Its customers are exporters, importers and freight forwarders who need an answer about a shipment today, and who — in this market — send that question on WhatsApp because it is where business is already conducted. A contact form that promises a reply within two working days is, for them, the same as no reply.

So the site was designed to accept that rather than fight it. The whole structure funnels toward a conversation.

## What the nine pages cover

- **Freight forwarding** — sea, land and the combinations a shipment usually needs
- **Customs clearance** — the part clients are most anxious about and least able to do themselves
- **Inland transport** — moving cargo on from the port
- **Project cargo** — oversized and non-standard loads, which are quoted case by case
- **Logistics consulting** — for companies setting up a route rather than booking one
- **Company and contact** — credentials, coverage and the direct line

## Serious without going cold

Logistics sites tend to reach for either stock photography of container yards or a wall of grey text. I used an industrial blue and kept the typography plain, because the client's advantage is competence and the design should not undercut that by looking either decorative or cheap.

Every service page ends where it should: a single, obvious way to start the conversation.`,
    ar: `## العميل يصل عبر واتساب، لا عبر نموذج

تعمل «صعب للخدمات اللوجستية» من مرفأ اللاذقية. عملاؤها مصدّرون ومستوردون ووكلاء شحن يحتاجون جوابًا عن شحنة اليوم، ويرسلون سؤالهم — في هذه السوق — عبر واتساب لأنه المكان الذي يُدار فيه العمل أصلًا. أما نموذج تواصل يَعِد بالردّ خلال يومَي عمل فهو عندهم بمنزلة لا ردّ.

فصُمّم الموقع على قبول هذا الواقع لا مقاومته، وبُنيت البنية كلّها لتصبّ في محادثة.

## ما تغطّيه الصفحات التسع

- **الشحن والتخليص البحري والبري** — والتركيبات التي تحتاجها الشحنة عادة
- **التخليص الجمركي** — أكثر ما يقلق العميل وأقلّ ما يستطيع إنجازه بنفسه
- **النقل الداخلي** — نقل البضاعة من المرفأ إلى وجهتها
- **الشحنات المشروعية** — الأحمال الضخمة وغير النمطية التي تُسعَّر حالةً بحالة
- **الاستشارات اللوجستية** — للشركات التي تؤسّس خطًّا لا التي تحجز شحنة
- **التعريف والتواصل** — الاعتمادات ونطاق التغطية والخط المباشر

## جدّية بلا برود

مواقع القطاع اللوجستي تميل إلى أحد خيارين: صور جاهزة لساحات حاويات، أو جدار من النصّ الرمادي. اعتمدت أزرق صناعيًّا وأبقيت الطباعة مباشرة، لأن ميزة العميل هي الكفاءة، ولا ينبغي للتصميم أن يقوّضها بمظهر زخرفي أو رخيص.

وكل صفحة خدمة تنتهي حيث يجب: طريق واحد واضح لبدء المحادثة.`,
  },

  "fast-express-shipping": {
    en: `## The customer already knows how the cargo travels

Fast Express ships out of Dubai to Saudi Arabia, Iraq, Syria and beyond. By the time someone reaches the site, they have usually already decided the constraint — this consignment has to fly, or it can go by road and save money, or it is a container going by sea. What they want is confirmation that this company handles that route.

Most freight sites open with a company introduction and make the visitor hunt for the mode. This one inverts that.

## What the site puts first

- **Land freight** — trucking across the Gulf and Levant corridors
- **Air freight** — for cargo where the deadline outranks the cost
- **Sea freight** — container and consolidated shipments
- **Customs clearance** — placed beside the three modes rather than buried under services, because it is part of the same decision
- **Why Fast Express** — the reassurance layer: coverage, handling, tracking
- **Destinations** — the corridors actually served, named

## Three doors instead of one corridor

The home page is built as three tracks — road, air, sea — each a full entry point with its own page. A visitor self-selects in the first screen and never reads about the other two.

The teal and orange identity is deliberately industrial: high contrast, readable on a phone in a warehouse, and distinct from the navy every other forwarder in the region uses.`,
    ar: `## العميل يعرف مسبقًا كيف ستسافر بضاعته

تشحن «فاست إكسبرس» من دبي إلى السعودية والعراق وسوريا وما بعدها. وحين يصل أحدهم إلى الموقع يكون قد حسم القيد غالبًا: هذه الشحنة لا بدّ أن تطير، أو يمكنها أن تسلك البرّ فتوفّر، أو هي حاوية تمضي بحرًا. وما يريده هو تأكيد أن هذه الشركة تخدم ذلك المسار.

معظم مواقع الشحن تفتتح بتعريف عن الشركة وتترك الزائر يبحث عن وسيلة النقل. هنا انعكس الترتيب.

## ما يقدّمه الموقع أوّلًا

- **الشحن البري** — النقل بالشاحنات عبر ممرّات الخليج وبلاد الشام
- **الشحن الجوّي** — للبضائع التي يتقدّم فيها الموعد على الكلفة
- **الشحن البحري** — الحاويات والشحنات المجمّعة
- **التخليص الجمركي** — موضوع إلى جانب الوسائل الثلاث لا مدفونًا تحت «الخدمات»، لأنه جزء من القرار نفسه
- **لماذا فاست إكسبرس** — طبقة الطمأنة: التغطية والمناولة والتتبّع
- **الوجهات** — الممرّات المخدومة فعلًا، مذكورة بالاسم

## ثلاثة أبواب بدل ممرّ واحد

بُنيت الصفحة الرئيسية على ثلاثة مسارات — برّ وجوّ وبحر — كلٌّ منها مدخل كامل بصفحته الخاصة. يختار الزائر مساره في الشاشة الأولى ولا يقرأ شيئًا عن المسارين الآخرين.

وهوية الفيروزي والبرتقالي صناعية بقصد: تباين عالٍ، مقروءة على هاتف داخل مستودع، ومتمايزة عن الكحلي الذي يستخدمه سائر وكلاء الشحن في المنطقة.`,
  },

  "border-ports-app": {
    en: `## The person who needs this number is not at a desk

A company operating across the Iraqi border ports has money moving through several sites at once — Umm Qasr and the rest — and the person who has to know where it stands is usually a manager holding a phone, between meetings, wanting one figure before deciding something.

Desktop financial software answers that badly. It assumes you have arrived to study the data. This app assumes you have thirty seconds.

## What the app reports

- **Company switching** — one manager, several companies, without logging out
- **The daily snapshot** — today's position first, before any drill-down
- **Revenue by port** — with date filtering, so a week or a month can be compared
- **Sales reports** — broken out on their own
- **Funds and banks** — where the money actually sits
- **Expenses** — against the same periods
- **Full profit** — the figure the whole app exists to produce

## Ordered by urgency, not by hierarchy

The design decision that mattered was sequence. The snapshot comes first and everything else is a deliberate step downward into detail — so the common case ends in one screen and the rare case is still reachable.

Charts are kept plain on purpose: this is a reading tool, and a chart that has to be decoded is slower than a number. Arabic-first throughout, laid out right-to-left from the start rather than mirrored afterwards.`,
    ar: `## من يحتاج هذا الرقم ليس جالسًا إلى مكتب

الشركة العاملة على المنافذ الحدودية العراقية لديها أموال تتحرّك في عدّة مواقع في وقت واحد — أمّ قصر وغيرها — ومن يلزمه أن يعرف أين وصلت هو مديرٌ ممسك بهاتفه، بين اجتماعين، يريد رقمًا واحدًا قبل أن يقرّر شيئًا.

برامج المحاسبة المكتبية تجيب عن هذا إجابة سيّئة، لأنها تفترض أنك جئت لتدرس البيانات. أما هذا التطبيق فيفترض أن أمامك ثلاثين ثانية.

## ما يعرضه التطبيق

- **التنقّل بين الشركات** — مدير واحد وعدّة شركات دون تسجيل خروج
- **الملخّص اليومي** — وضع اليوم أوّلًا، قبل أي تفصيل
- **الإيرادات حسب المنفذ** — مع ترشيح بالتاريخ لمقارنة أسبوع بأسبوع أو شهر بشهر
- **تقارير المبيعات** — مفصولة على حدة
- **الصناديق والبنوك** — أين يستقرّ المال فعلًا
- **المصروفات** — على المدد نفسها
- **الربح الكامل** — الرقم الذي وُجد التطبيق كلّه لإنتاجه

## ترتيبٌ بحسب الإلحاح لا بحسب الهيكل

القرار التصميمي الحاسم كان التسلسل. يتقدّم الملخّص، وكل ما بعده نزولٌ مقصود نحو التفصيل — فتنتهي الحالة الشائعة في شاشة واحدة، وتبقى الحالة النادرة في المتناول.

والرسوم البيانية بسيطة عن عمد: هذه أداة قراءة، والرسم الذي يحتاج فكّ شيفرة أبطأ من رقم مكتوب. والتطبيق عربي أوّلًا، مبنيّ من اليمين إلى اليسار منذ البداية لا معكوسًا بعد الإنجاز.`,
  },

  "rasael-messaging-platform": {
    en: `## Explaining a platform that lives in four places at once

Rasael puts WhatsApp, SMS, Telegram and email into a single Arabic-first workspace. The difficulty is not the product, it is the pitch: a multi-channel platform sounds abstract until someone sees what it replaces, which is a support team with four browser tabs open and no shared history between them.

A product page for something like this usually collapses into a feature grid — twenty icons, none of which explain the shape of the thing. The job here was to keep the story intact while still naming what is in the box.

## What the platform does

- **Shared inbox** — every channel landing in one thread per customer, so the conversation survives the channel switch
- **Campaigns** — outbound messaging across the same four channels
- **Templates** — pre-approved message formats, which is what makes WhatsApp business messaging workable at all
- **Bots** — automated first responses and routing
- **Arabic-first** — the interface designed in Arabic rather than translated into it

## Hand-built, dark, and moving

There is no framework under this page. I wrote the front end by hand in HTML, CSS and JavaScript, with GSAP driving the motion and Lenis smoothing the scroll — because the page's argument is made through sequence, and a section that arrives at the right moment does more persuading than a paragraph.

The dark palette was a positioning choice: it puts the product in the category of tools sold to teams, not to consumers. Built for a client in Iraq.`,
    ar: `## كيف تشرح منصّة تسكن أربعة أماكن في وقت واحد

تجمع «رسائل» واتساب والرسائل القصيرة وتيليغرام والبريد في مساحة عمل واحدة عربية أوّلًا. والصعوبة ليست في المنتج بل في تقديمه: عبارة «منصّة متعدّدة القنوات» تبقى مجرّدة حتى يرى المرء ما الذي تستبدله، وهو فريق دعم يفتح أربع نوافذ متفرّقة بلا سجلّ مشترك بينها.

صفحة منتج كهذه تنهار عادة إلى شبكة ميزات: عشرون أيقونة لا تشرح إحداها شكل الشيء. والمهمّة هنا كانت الحفاظ على الحكاية مع تسمية ما في الصندوق.

## ما تقوم به المنصّة

- **صندوق وارد مشترك** — كل القنوات تصبّ في محادثة واحدة لكل عميل، فينجو السياق حين تتبدّل القناة
- **الحملات** — إرسال جماعي عبر القنوات الأربع نفسها
- **القوالب** — صيغ رسائل معتمدة مسبقًا، وهي ما يجعل المراسلة التجارية عبر واتساب ممكنة أصلًا
- **البوتات** — ردود أولى آلية وتوجيه للمحادثات
- **العربية أوّلًا** — واجهة مصمَّمة بالعربية لا مترجَمة إليها

## مبنيّة يدويًا، داكنة، ومتحرّكة

لا إطار عمل تحت هذه الصفحة. كتبت الواجهة يدويًا بـ HTML وCSS وJavaScript، وأدرت الحركة بـ GSAP والتمرير بـ Lenis — لأن الصفحة تبني حجّتها بالتسلسل، والقسم الذي يصل في لحظته يقنع أكثر ممّا تقنع فقرة.

واللوحة الداكنة كانت قرار تموضع: تضع المنتج في خانة الأدوات التي تُباع للفرق لا للأفراد. أُنجزت لعميل في العراق.`,
  },

  "asset-security-systems": {
    en: `## Written for the buyer, not for the engineer

ASSET represents high-tech security and safety manufacturers out of Dubai. The catalogue is genuinely technical — screening detectors, X-ray inspection systems, perimeter protection, rescue medicine, optical communication — and the manufacturers supply their material the way manufacturers do: specification sheets first.

But the person browsing is usually a procurement officer, a facilities manager or a security consultant putting together a tender. They are qualified to buy this equipment and not qualified to read a datasheet cold. If the site opens on specifications it loses them, and if it hides the specifications entirely it fails the one person who does need them.

## What the site organises

- **Screening and detection** — walk-through and handheld detection equipment
- **X-ray inspection** — baggage and cargo screening systems
- **Perimeter protection** — securing a site's outer boundary
- **Rescue and emergency medicine** — the response side of safety
- **Optical communication** — transmission equipment
- **Manufacturer representation** — who ASSET acts for, since in this trade the brand behind the product is half the decision

## Range first, specifications on request

The structure follows how the decision is actually made: the visitor identifies the family of equipment that matches their problem, then narrows, and only then reaches numbers. Specifications are one level down — present, complete, and never in the way.

I designed and built the front end in Next.js and React.`,
    ar: `## مكتوب للمشتري لا للمهندس

تمثّل «أسِت» في دبي مصنّعي أنظمة الأمن والسلامة عالية التقنية. والكتالوج تقني بحقّ — أجهزة الكشف والتفتيش، وأنظمة التفتيش بالأشعة السينية، وحماية المحيط، وطبّ الإنقاذ، والاتصالات الضوئية — والمصنّعون يزوّدون موادّهم كما يفعل المصنّعون دائمًا: جداول المواصفات أوّلًا.

لكن من يتصفّح عادةً موظّف مشتريات أو مدير مرافق أو مستشار أمني يُعدّ عطاءً. هؤلاء مؤهّلون لشراء هذه المعدّات وغير مؤهّلين لقراءة جدول مواصفات على البارد. فإن افتُتح الموقع بالمواصفات خسرهم، وإن أخفاها كلّيًّا خذل الشخص الوحيد الذي يحتاجها.

## ما ينظّمه الموقع

- **الكشف والتفتيش** — أجهزة الكشف العبورية والمحمولة
- **التفتيش بالأشعة السينية** — أنظمة فحص الحقائب والبضائع
- **حماية المحيط** — تأمين الحدود الخارجية للموقع
- **الإنقاذ وطبّ الطوارئ** — الوجه الاستجابي للسلامة
- **الاتصالات الضوئية** — معدّات النقل والإرسال
- **تمثيل المصنّعين** — عمّن تنوب «أسِت»، لأن العلامة خلف المنتج في هذه التجارة نصف القرار

## العائلات أوّلًا، والمواصفات عند الطلب

تتبع البنية الطريقة التي يُتَّخذ بها القرار فعلًا: يحدّد الزائر عائلة المعدّات التي تناسب مشكلته، ثم يضيّق، ثم يبلغ الأرقام أخيرًا. والمواصفات على مستوى أدنى بدرجة واحدة: حاضرة كاملة، وغير معترضة للطريق.

صمّمت الواجهة وبنيتها بـ Next.js وReact.`,
  },

  "zanqa-education-platform": {
    en: `## Four years, not one handover

Zanqa is the project I am closest to, and the reason is duration. I joined as a partner and front-end developer in 2019 and stayed until 2023 — which meant I was not designing screens for someone else to interpret, I was living with the consequences of my own decisions and correcting them.

It is an education platform serving students, and around them a network of publishers supplying the material. Two audiences with opposite needs: a student wants to find one thing quickly, a publisher wants to manage many things carefully.

## What I worked on

- **Web and mobile interfaces** — designed for both, since students overwhelmingly arrive on a phone
- **Front-end build** — Next.js with MUI, from component library through to shipped pages
- **Publisher tooling** — the side of the product that keeps the content supply running
- **Product decisions** — as a partner rather than a contractor, including what not to build
- **Release communication** — the interface changes that had to be explained to existing users

## What it reached

More than 94,000 users, over 50,000 app downloads, and a network of 3,000+ publishers.

Those numbers are the argument for staying with something. Nothing about the first version predicted them; they came from four years of watching where people stalled and rebuilding those parts — which is a kind of design work that a three-month engagement structurally cannot do.`,
    ar: `## أربع سنوات، لا تسليمة واحدة

«زنقة» أقرب المشاريع إليّ، والسبب هو المدّة. انضممت شريكةً ومطوّرة واجهات عام 2019 وبقيت حتى 2023 — وهذا يعني أنني لم أكن أصمّم شاشات ليفسّرها غيري، بل كنت أعيش مع نتائج قراراتي وأصحّحها.

هي منصّة تعليمية تخدم الطلاب، وحولهم شبكة ناشرين يزوّدونها بالمحتوى. جمهوران بحاجتين متعاكستين: الطالب يريد أن يجد شيئًا واحدًا بسرعة، والناشر يريد أن يدير أشياء كثيرة بعناية.

## ما عملت عليه

- **واجهات الويب والموبايل** — مصمَّمة للاثنين، لأن الطلاب يصلون من الهاتف في الأغلب الساحق
- **بناء الواجهة الأمامية** — بـ Next.js وMUI، من مكتبة المكوّنات إلى الصفحات المنشورة
- **أدوات الناشرين** — الجانب الذي يُبقي تدفّق المحتوى مستمرًّا
- **قرارات المنتج** — بصفتي شريكة لا متعاقدة، بما في ذلك ما لا يُبنى
- **التواصل حول الإصدارات** — تغييرات الواجهة التي كان لا بدّ من شرحها للمستخدمين الحاليين

## ما بلغته

أكثر من 94 ألف مستخدم، وما يزيد على 50 ألف تنزيل للتطبيق، وشبكة تضمّ أكثر من 3000 ناشر.

هذه الأرقام هي الحجّة على البقاء مع مشروع طويلًا. لم تكن النسخة الأولى تنبئ بشيء منها؛ جاءت من أربع سنوات من مراقبة المواضع التي يتعثّر عندها الناس وإعادة بنائها — وهو نوع من التصميم لا تستطيعه بنيويًّا مشاركةٌ من ثلاثة أشهر.`,
  },
};

/* ── Batch 2 — apps, where the flow is the product ─────────────────────── */

BATCHES["2"] = {
  "crenny-app": {
    en: `## Nobody opens this app calmly

Crenny is roadside assistance for drivers in Iraq. Every single session begins with a person standing next to a car that will not move, often on a shoulder, often at night, sometimes with passengers waiting. Whatever the interface does, it has to work for someone whose attention is already spent.

That rules out most of what a services app normally does. No account creation before help. No browsing. No comparing providers. The design target was a booking finished in under a minute.

## Four decisions, then help is coming

- **Drop a pin** — location on a map, because a stranded driver often cannot name where they are
- **Pick the vehicle class** — which determines who gets dispatched and what it costs
- **See the price range** — in Iraqi dinars, before committing, because a surprise price is its own emergency
- **Confirm** — and then live payment status, so the driver knows the order is real

The services behind those four steps: battery jumpstart, tyre change, towing and vehicle release, and fuel delivery.

## Arabic-first, and calm on purpose

The interface is Arabic from the ground up. Type sizes run larger than a services app usually needs, contrast is high, and each screen asks exactly one question — because reading a dense screen is the first thing that goes when someone is stressed.`,
    ar: `## لا أحد يفتح هذا التطبيق وهو هادئ

«كريني» تطبيق مساعدة على الطريق للسائقين في العراق. كل جلسة فيه تبدأ بشخص واقف إلى جانب سيارة لا تتحرّك، على كتف الطريق غالبًا، وفي الليل غالبًا، وأحيانًا مع ركّاب ينتظرون. ومهما فعلت الواجهة فعليها أن تعمل مع شخص استُنفد انتباهه أصلًا.

هذا يُسقط معظم ما تفعله تطبيقات الخدمات عادة. لا إنشاء حساب قبل المساعدة، ولا تصفّح، ولا مقارنة بين مزوّدين. كان الهدف التصميمي طلبًا يكتمل في أقل من دقيقة.

## أربعة قرارات، ثم تكون المساعدة في الطريق

- **تحديد الموقع على الخريطة** — لأن السائق العالق كثيرًا ما يعجز عن تسمية مكانه
- **اختيار فئة المركبة** — وهي التي تحدّد من يُرسَل وكم تبلغ الكلفة
- **رؤية نطاق السعر** — بالدينار العراقي وقبل الالتزام، لأن سعرًا مفاجئًا طارئٌ آخر بحدّ ذاته
- **التأكيد** — ثم حالة الدفع لحظةً بلحظة، ليطمئنّ السائق أن الطلب قائم فعلًا

والخدمات خلف هذه الخطوات الأربع: شحن البطارية، وتبديل الإطار، والسحب وتحرير المركبة، وتوصيل الوقود.

## العربية أوّلًا، والهدوء عن قصد

الواجهة عربية من الأساس. أحجام الخطّ أكبر ممّا يحتاجه تطبيق خدمات عادةً، والتباين عالٍ، وكل شاشة تطرح سؤالًا واحدًا فقط — لأن قراءة شاشة مزدحمة أوّل ما يسقط حين يكون المرء تحت الضغط.`,
  },

  "tawseel-food-delivery": {
    en: `## Two moments decide a food app

Everything else in a delivery app is plumbing. What actually determines whether someone orders again is how well it handles two specific moments: choosing the dish, and waiting for it.

Choosing goes wrong when the app hides the thing the customer wants to change — the size, the extras, the "no onions". Waiting goes wrong when the app goes quiet. Tawseel (توصيل) was designed around fixing both.

## What the app handles

- **Dish pages with real options** — sizes, add-ons, and a free-text note for the request the options do not cover
- **Short checkout** — address, payment, done, with nothing optional in the way
- **Live driver tracking** — the map that answers the question the customer would otherwise ask by phone
- **A call button** — kept visible, because sometimes the map is not the answer
- **Order history** — reordering the usual without rebuilding it
- **Pricing in Iraqi dinars** — local from the ground up, not converted

## Arabic-first and built for the wait

The interface is Arabic and right-to-left by construction. The tracking screen carries more design attention than the menu does, which is the opposite of how these apps are usually built — but the menu is looked at for two minutes and the tracking screen for twenty.`,
    ar: `## لحظتان تحسمان مصير تطبيق طعام

كل ما عدا ذلك في تطبيق التوصيل تمديدات. أما ما يحدّد فعلًا إن كان الزبون سيطلب مرّة أخرى فهو حسن التعامل مع لحظتين بعينهما: اختيار الطبق، وانتظاره.

يفسد الاختيار حين يخفي التطبيق ما يريد الزبون تغييره — الحجم، والإضافات، و«بدون بصل». ويفسد الانتظار حين يصمت التطبيق. وقد صُمّم «توصيل» حول معالجة الأمرين.

## ما يتولّاه التطبيق

- **صفحات أطباق بخيارات حقيقية** — الأحجام والإضافات، وحقل ملاحظة حرّ للطلب الذي لا تغطّيه الخيارات
- **إتمام طلب قصير** — العنوان، والدفع، وانتهى، بلا خطوة اختيارية تعترض الطريق
- **تتبّع السائق مباشرة** — الخريطة التي تجيب عن السؤال الذي كان الزبون سيتّصل ليسأله
- **زرّ اتصال** — ظاهر دائمًا، لأن الخريطة ليست الجواب أحيانًا
- **سجلّ الطلبات** — لإعادة طلب المعتاد دون إعادة تركيبه
- **التسعير بالدينار العراقي** — محليّ من الأساس، لا محوَّلًا

## عربيّ أوّلًا، ومبنيّ لأجل الانتظار

الواجهة عربية ومن اليمين إلى اليسار بحكم البناء. وشاشة التتبّع نالت عناية تصميمية أكبر من قائمة الطعام، وهو عكس ما يُبنى في هذه التطبيقات عادةً — غير أن القائمة يُنظر إليها دقيقتين، وشاشة التتبّع عشرين.`,
  },

  "akhdar-agri-app": {
    en: `## In this market, you buy the supplier

Akhdar (أخضر) is a multi-vendor marketplace for people who farm. It carries seeds and seedlings, fertilisers, pesticides, veterinary medicine and equipment — categories where a bad purchase is not a returned parcel, it is a lost season.

Which changes the design problem. In most marketplaces the product listing is the unit of trust and the seller is a line of small print. Here it is closer to the reverse: a farmer buying pesticide wants to know who is selling it before they read the label.

## What the app carries

- **Vendor profiles** — given the same weight as listings, because that is where the decision is actually made
- **Category browsing** — seeds and seedlings, fertilisers, pesticides, veterinary medicine, equipment
- **Product detail** — with the specifics this trade needs stated plainly
- **Featured products** — surfacing what is in season
- **Cart and ordering** — across vendors
- **Arabic-first interface** — for an audience that will not tolerate a translated one

## A green that means agriculture, not eco-branding

The identity uses a fresh green with a wheat-spike logomark — deliberately agricultural rather than the pale environmental green that has become the default for anything with "green" in the name. The audience here farms for a living, and the brand had to look like it belongs to their trade.`,
    ar: `## في هذه السوق، أنت تشتري المورّد

«أخضر» سوق متعدّد البائعين موجّه لمن يعملون في الزراعة. يضمّ البذور والشتلات والأسمدة والمبيدات والأدوية البيطرية والمعدّات — أصناف تكون فيها الصفقة السيّئة موسمًا ضائعًا لا طردًا مُعادًا.

وهذا يغيّر المسألة التصميمية. في معظم الأسواق الإلكترونية تكون بطاقة المنتج وحدة الثقة، ويكون البائع سطرًا صغيرًا. أما هنا فالأمر أقرب إلى العكس: المزارع الذي يشتري مبيدًا يريد أن يعرف مَن يبيعه قبل أن يقرأ النشرة.

## ما يحمله التطبيق

- **ملفّات البائعين** — بالوزن نفسه الذي تناله بطاقات المنتجات، لأن القرار يُتَّخذ هناك فعلًا
- **التصفّح حسب الفئة** — بذور وشتلات، وأسمدة، ومبيدات، وأدوية بيطرية، ومعدّات
- **تفاصيل المنتج** — بالمعلومات التي تحتاجها هذه التجارة، مذكورة بوضوح
- **المنتجات المميّزة** — لإبراز ما هو في موسمه
- **السلّة والطلب** — عبر أكثر من بائع
- **واجهة عربية أوّلًا** — لجمهور لا يحتمل واجهة مترجمة

## أخضرُ يعني الزراعة، لا التسويق البيئي

تعتمد الهوية أخضر نضِرًا مع علامة على شكل سنبلة قمح — زراعيّة بقصد، بدل الأخضر البيئي الباهت الذي صار الخيار التلقائي لكل ما في اسمه «أخضر». وجمهور هذا التطبيق يزرع ليعيش، وكان على العلامة أن تبدو من صميم مهنته.`,
  },

  "lamasat-furniture-app": {
    en: `## The same brand, not a shrunken website

LAMASAT already had a website with a settled editorial character — navy and blush, generous spacing, closer to a design magazine than a catalogue. The app had to be recognisably the same company without simply compressing that layout onto a phone, which never works: what reads as confident restraint on a wide screen reads as empty on a narrow one.

## How the app is organised

- **Category shopping** — furniture, lighting, home accessories, kitchen, bathroom
- **Featured products** — on the way in, for the visitor who is browsing rather than searching
- **Recent orders** — also on the way in, for the one who is not
- **Search** — for the customer who already knows the piece
- **Sorting and filtering** — the tools that make a furniture catalogue usable at all
- **Product detail** — with the material and dimension information a furniture buyer will not order without

## Two entry points, one screen

The home screen serves browsing and returning at the same time — featured pieces for discovery, recent orders for continuation — so neither type of visitor has to navigate to get started.

The editorial style carries over intact: the same restraint, rebuilt at phone scale rather than scaled down to it.`,
    ar: `## العلامة نفسها، لا موقعًا مصغَّرًا

كان لدى «لمسات» موقعٌ بشخصية تحريرية مستقرّة — كحليّ ووردي باهت، ومساحات سخيّة، أقرب إلى مجلّة تصميم منه إلى كتالوج. وكان على التطبيق أن يبدو الشركة نفسها دون أن يضغط ذلك التخطيط على شاشة هاتف، وهو ما لا ينجح أبدًا: فما يُقرأ على شاشة عريضة تحفّظًا واثقًا يُقرأ على شاشة ضيّقة فراغًا.

## كيف نُظّم التطبيق

- **التسوّق حسب الفئة** — أثاث، وإنارة، ومستلزمات منزل، ومطبخ، وحمّام
- **المنتجات المميّزة** — عند الدخول، لمن يتصفّح لا لمن يبحث
- **الطلبات الأخيرة** — عند الدخول أيضًا، لمن ليس كذلك
- **البحث** — للزبون الذي يعرف القطعة سلفًا
- **الترتيب والترشيح** — الأدوات التي تجعل كتالوج أثاث قابلًا للاستخدام أصلًا
- **تفاصيل المنتج** — بمعلومات الخامة والأبعاد التي لا يطلب مشتري الأثاث بدونها

## مدخلان في شاشة واحدة

تخدم الشاشة الرئيسية التصفّح والعودة في آن — قطعٌ مميّزة للاكتشاف، وطلباتٌ أخيرة للمتابعة — فلا يضطرّ أيٌّ من الزائرَين إلى التنقّل ليبدأ.

والأسلوب التحريري انتقل كما هو: التحفّظ نفسه، معادَ بناؤه على مقاس الهاتف لا مصغَّرًا إليه.`,
  },

  "living-app-ui": {
    en: `## A resident's whole building life in one place

Living gathers everything a person deals with because of where they live: the unit itself, the things that break, the moving in and out, and whatever the building has decided to announce. Separately, each of those is trivial. Together they are a sequencing problem.

Because the frequencies are wildly different. A resident reports a fault a few times a year, checks announcements weekly, and reads their floor plan twice — once when they move in and once when they leave. Sort that menu alphabetically and the app is useless.

## What a resident can do

- **See their unit** — details and floor plan
- **Request a repair** — the most common reason the app gets opened
- **Request a service** — the building's other offerings
- **Report a problem** — separate from a repair request, because a complaint is not a work order
- **Handle move-in and move-out** — the logistics that only matter twice, but matter enormously then
- **Read announcements** — whatever the community has posted

## Ordered by how often it is needed

The hierarchy follows frequency, not category logic. Weekly needs sit above yearly ones, and the move-in and move-out flows — dense, procedural, rarely used — are placed where they can be found without cluttering the daily view.

Designed in Figma.`,
    ar: `## حياة الساكن في مبناه، في مكان واحد

يجمع «ليفينغ» كل ما يتعامل معه المرء بحكم مكان سكنه: الوحدة نفسها، وما يتعطّل فيها، والانتقال إليها ومنها، وما يقرّر المبنى إعلانه. كلٌّ من هذه على حدة بسيط. أما مجتمعةً فمسألة ترتيب.

لأن تواتر الحاجة إليها متفاوت تفاوتًا شديدًا. الساكن يبلّغ عن عطل بضع مرات في السنة، ويطالع الإعلانات أسبوعيًّا، ويقرأ مخطّط وحدته مرّتين: مرّة حين ينتقل ومرّة حين يغادر. ولو رُتّبت القائمة أبجديًّا لصار التطبيق بلا فائدة.

## ما يستطيع الساكن فعله

- **الاطّلاع على وحدته** — التفاصيل والمخطّط الطابقي
- **طلب صيانة** — أكثر الأسباب التي يُفتح التطبيق من أجلها
- **طلب خدمة** — سائر ما يقدّمه المبنى
- **الإبلاغ عن مشكلة** — منفصلًا عن طلب الصيانة، لأن الشكوى ليست أمر عمل
- **إجراءات الدخول والمغادرة** — لوجستيّات لا تَهمّ إلا مرّتين، لكنها تَهمّ حينها كثيرًا
- **قراءة الإعلانات** — ما نشره المجتمع السكني

## مرتَّبٌ بحسب تواتر الحاجة

يتبع التسلسل الهرمي التواتر لا منطق التصنيف. فالحاجات الأسبوعية فوق السنوية، ومساران الدخول والمغادرة — الكثيفان الإجرائيان النادران — وُضعا حيث يمكن العثور عليهما دون أن يزحما العرض اليومي.

صُمّم في Figma.`,
  },

  "e-liefer-delivery-platform": {
    en: `## People still shop by neighbourhood

E-Liefer connects local German stores to customers nearby. The distinction that shaped the whole design is that its users are not shopping for a product in the abstract — they are shopping at a shop. They know the bakery on their street. They want that one.

A conventional marketplace flattens that: search a product, get the cheapest seller, done. Here the store is the unit, not the item.

## What the journey covers

- **Onboarding and registration** — kept short, since the value is visible before an account is needed
- **Discovering stores by district** — the primary way in, because proximity is the point
- **Store profiles** — a shop presented as itself, with its own range
- **Browsing products and their details** — inside a store rather than across all of them
- **Favourites** — for the shops someone returns to, which in this model is most of them
- **English and German** — both, from the start

## Designed end to end in Adobe XD

I designed the full journey — every screen from first open to repeat order — in Adobe XD, which meant the flow could be walked and corrected as a whole rather than assembled from screens designed in isolation.`,
    ar: `## الناس ما زالوا يتسوّقون من حيّهم

يربط «إي-ليفر» المتاجر المحلية في ألمانيا بالزبائن القريبين منها. والفارق الذي شكّل التصميم كلّه أن مستخدميه لا يتسوّقون منتجًا مجرّدًا، بل يتسوّقون من متجر بعينه. هم يعرفون المخبز في شارعهم، ويريدون ذاك تحديدًا.

السوق الإلكتروني التقليدي يسطّح هذا: ابحث عن منتج، احصل على أرخص بائع، انتهى الأمر. أما هنا فالمتجر هو الوحدة، لا السلعة.

## ما يغطّيه المسار

- **التسجيل والانضمام** — قصير، لأن القيمة تظهر قبل الحاجة إلى حساب
- **اكتشاف المتاجر حسب المنطقة** — المدخل الأساسي، لأن القرب هو الفكرة كلّها
- **ملفّات المتاجر** — المتجر معروضًا بصفته هو، بتشكيلته الخاصة
- **تصفّح المنتجات وتفاصيلها** — داخل المتجر لا عبر المتاجر كلّها
- **المفضّلة** — للمتاجر التي يعود إليها المرء، وهي في هذا النموذج معظمها
- **الإنجليزية والألمانية** — كلتاهما، منذ البداية

## مصمَّم من طرفه إلى طرفه في Adobe XD

صمّمت المسار كاملًا — كل شاشة من أول فتح إلى الطلب المتكرّر — في Adobe XD، وهذا أتاح المرور بالمسار كوحدة واحدة وتصحيحه، بدل تجميعه من شاشات صُمّمت كلٌّ منها بمعزل عن الأخرى.`,
  },
};

/* ── Batch 3 — commerce, product and web ───────────────────────────────── */

BATCHES["3"] = {
  "turki-butchery": {
    en: `## Buying meat online is a trust problem first

Everything difficult about this project comes from one fact: the customer cannot see, touch or smell what they are buying, in a category where those three things are how people have always decided. Design cannot replace them. What it can do is remove every ambiguity about what is actually being ordered.

So the 28 screens I mapped for this Saudi butcher are built around one rule — the customer should never be uncertain about what will arrive.

## What the customer can order

- **Whole carcasses** — with the cutting specified rather than assumed
- **Cuts by the kilo** — priced and described individually
- **Ready-to-cook boxes** — prepared selections for people who do not want to choose
- **Poultry** — its own range
- **Sacrificial animals** — for Eid and other occasions, which is a booking rather than a purchase
- **Custom cutting on request** — the instruction a butcher's customer has always given at the counter
- **Donation basket** — sacrificial meat given rather than delivered
- **Home delivery** — the end of every path

## Right-to-left, with no dead ends

The whole journey is Arabic and RTL by construction. I traced every route from browsing to confirmation to make sure none of them stops: every screen either completes the order or offers the next step, including the ones — like the donation basket — that leave the normal shopping path entirely.`,
    ar: `## شراء اللحم عبر الإنترنت مسألة ثقة قبل كل شيء

كل ما هو صعب في هذا المشروع نابعٌ من حقيقة واحدة: الزبون لا يرى ما يشتريه ولا يلمسه ولا يشمّه، في صنفٍ ظلّ الناس يقرّرون فيه بهذه الحواسّ الثلاث. والتصميم لا يعوّضها، لكنه يستطيع أن يزيل كل التباس حول ما يُطلَب فعلًا.

لذلك بُنيت الشاشات الثماني والعشرون التي رسمتها لهذه الملحمة السعودية على قاعدة واحدة: ألّا يبقى الزبون في شكّ ممّا سيصله.

## ما يمكن للزبون طلبه

- **ذبائح كاملة** — بتقطيع محدَّد لا مفترَض
- **قطعيّات بالكيلو** — مسعَّرة وموصوفة كلٌّ على حدة
- **صناديق جاهزة للطهي** — تشكيلات معدّة لمن لا يريد أن يختار
- **الدواجن** — بتشكيلتها الخاصة
- **الأضاحي** — للعيد وسواه، وهي حجزٌ لا شراء
- **التقطيع حسب الطلب** — التعليمة التي ظلّ زبون الملحمة يعطيها عند الطاولة
- **سلّة التبرّع** — أضحيةٌ تُهدى لا تُستلَم
- **التوصيل إلى المنزل** — نهاية كل مسار

## من اليمين إلى اليسار، وبلا طريق مسدود

المسار كلّه عربي ومن اليمين إلى اليسار بحكم البناء. وتتبّعت كل طريق من التصفّح إلى التأكيد للتأكّد من أن أيًّا منها لا يتوقّف: كل شاشة إمّا تُتمّ الطلب أو تعرض الخطوة التالية، بما فيها المسارات التي تغادر طريق الشراء المعتاد كلّيًّا مثل سلّة التبرّع.`,
  },

  "emirates-sands": {
    en: `## Two visitors who should never meet

Emirates Sands Technology sells in Dubai to two audiences that want opposite things from the same site. One is comparing laptop specifications and price, the way anyone shops for hardware. The other is an IT manager sizing up a managed-print or cloud contract — a months-long decision that begins with a conversation, not a cart.

Most vendors in this position build one site and disappoint both: the shopper wades through enterprise language, and the IT manager scrolls past deals to find out whether the company is serious.

## How the store is split

- **Deal zones** — for the visitor who arrived to buy something today
- **Faceted filtering** — specification-level narrowing across the hardware range
- **Detailed spec pages** — complete enough to be compared against a competitor's
- **A separate solutions layer** — cloud, managed print and the contract-scale services
- **Enquiry routes** — for decisions that do not end in a checkout
- **Brand and range navigation** — since hardware buyers often start from a manufacturer

## One site, two doors

The split happens at the top level rather than inside the catalogue, so each audience picks its own path in the first screen and never has to read the other's content. It is a structural decision more than a visual one — and it is the reason the retail side can stay fast and promotional while the solutions side stays measured.`,
    ar: `## زائران يجب ألّا يلتقيا

تبيع «إمارات ساندز للتقنية» في دبي لجمهورَين يريدان من الموقع نفسه شيئين متعاكسين. أحدهما يقارن مواصفات حاسوب محمول وسعره، كما يتسوّق أيّ أحد عتادًا. والآخر مدير تقنية معلومات يدرس عقد طباعة مُدارة أو خدمة سحابية — قرارٌ يمتدّ أشهرًا ويبدأ بمحادثة لا بسلّة شراء.

معظم الموزّعين في هذا الموضع يبنون موقعًا واحدًا فيخذلون الاثنين: المتسوّق يخوض في لغة مؤسسية، ومدير التقنية يمرّ على العروض بحثًا عمّا يثبت أن الشركة جادّة.

## كيف قُسّم المتجر

- **مناطق العروض** — للزائر الذي جاء ليشتري اليوم
- **الترشيح التفصيلي** — تضييق على مستوى المواصفة عبر تشكيلة العتاد
- **صفحات مواصفات مفصّلة** — كاملة بما يكفي لتُقارَن بصفحة منافس
- **طبقة حلول منفصلة** — السحابة، والطباعة المُدارة، وخدمات حجم العقود
- **مسارات الاستفسار** — للقرارات التي لا تنتهي عند إتمام شراء
- **التنقّل حسب العلامة والفئة** — لأن مشتري العتاد يبدأ من المصنّع غالبًا

## موقع واحد ببابين

يحدث الفصل على المستوى الأعلى لا داخل الكتالوج، فيختار كل جمهور مساره في الشاشة الأولى ولا يضطرّ لقراءة محتوى الآخر. قرارٌ بنيويّ أكثر منه بصريًّا، وهو سبب قدرة الجانب البيعي على البقاء سريعًا وترويجيًّا مع بقاء جانب الحلول متأنّيًا.`,
  },

  "bigboss-web": {
    en: `## Six departments, one risk

BigBoss sells across electronics, fashion, home, beauty, sports and toys. The failure mode for a marketplace this wide is well documented and rarely avoided: the more it carries, the less any of it feels findable, until the whole site reads as a warehouse with no front door.

The fix is not better search. It is giving each department a front door of its own while keeping the buying mechanics identical everywhere.

## How the site is built

- **Promotional hero carousels** — the seasonal and campaign-led entry points
- **Top-category rails** — each department surfacing its own bestsellers rather than competing in one global list
- **Six department landings** — electronics, fashion, home, beauty, sports, toys
- **Consistent product pages** — the same layout whatever the department
- **Wishlist** — identical everywhere
- **Cart and checkout** — identical everywhere

## Vary the entrance, never the habit

The design rule was simple: the way into each department can differ as much as the merchandise demands, but the moment a customer picks something up, everything must behave exactly as it did in the last department they shopped.

That is what lets a buying habit form across a catalogue this wide — the customer only has to learn the mechanics once.`,
    ar: `## ستة أقسام، وخطرٌ واحد

يبيع «بيغ بوس» في الإلكترونيات والأزياء والمنزل والتجميل والرياضة والألعاب. ونمط الفشل في سوقٍ بهذا الاتّساع موثّق ونادرًا ما يُتفادى: كلّما حمل أكثر، قلّ إحساس الزبون بأن شيئًا فيه قابل للعثور عليه، حتى يصير الموقع كلّه مستودعًا بلا باب.

والعلاج ليس بحثًا أفضل، بل منح كل قسم بابًا خاصًّا به مع إبقاء آليّات الشراء متطابقة في كل مكان.

## كيف بُني الموقع

- **شرائح عرض ترويجية** — مداخل موسمية وحملات
- **أشرطة الفئات الأولى** — كل قسم يُبرز أفضل مبيعاته بدل التنافس في قائمة واحدة عامة
- **ستّ صفحات أقسام** — إلكترونيات، وأزياء، ومنزل، وتجميل، ورياضة، وألعاب
- **صفحات منتجات متّسقة** — التخطيط نفسه مهما اختلف القسم
- **قائمة الأمنيات** — متطابقة في كل مكان
- **السلّة وإتمام الشراء** — متطابقان في كل مكان

## نوّع المدخل، ولا تنوّع العادة

كانت القاعدة التصميمية بسيطة: للمدخل إلى كل قسم أن يختلف بقدر ما تقتضيه البضاعة، لكن ما إن يلتقط الزبون شيئًا حتى يجب أن يتصرّف كل شيء تمامًا كما تصرّف في القسم الذي تسوّق منه قبل قليل.

بهذا تتكوّن عادة شرائية عبر كتالوج بهذا الاتّساع — إذ لا يتعلّم الزبون الآليّة إلا مرّة واحدة.`,
  },

  "menu-web": {
    en: `## The design work was deciding what owners cannot change

A digital menu for one restaurant is an afternoon's work. This one had to be a product: something any restaurant can brand, configure and run without a designer standing behind them.

That turns the whole thing into a governance question. Give an owner too little control and the menu will not fit their business. Give them too much and the first thing many of them will do is make it unreadable — because the person configuring it is a restaurateur, not a typographer, and every option offered is an option that can be set badly.

## What the product supports

- **Language switching** — for menus serving more than one audience
- **Currency switching** — for the same reason
- **Multiple branches** — one menu, several locations, with items that differ between them
- **Category browsing** — the structural backbone of any menu
- **Offers and highlights** — the promotional layer every restaurant asks for
- **Share a dish to a phone** — sending a single item directly to a customer
- **Per-restaurant branding** — within a system that holds

## Fixed where it counts

Layout, type scale, spacing and hierarchy are fixed. Colour, logo, imagery, content and structure belong to the owner. The result stays legible however it is configured, which is the only way a white-label product survives contact with a hundred different owners.`,
    ar: `## العمل التصميمي كان في تحديد ما لا يستطيع المالك تغييره

قائمة طعام رقمية لمطعم واحد شغل بعد ظهر. أما هذه فكان عليها أن تكون منتجًا: شيئًا يستطيع أيّ مطعم أن يضع عليه علامته ويضبطه ويشغّله دون مصمّم يقف خلفه.

وهذا يحوّل المسألة كلّها إلى مسألة صلاحيات. امنح المالك تحكّمًا أقلّ من اللازم فلن تناسب القائمة عمله، وامنحه أكثر من اللازم فأوّل ما سيفعله كثيرون هو جعلها غير مقروءة — لأن من يضبطها صاحب مطعم لا مصمّم حروف، وكل خيار يُتاح خيارٌ يمكن ضبطه ضبطًا سيّئًا.

## ما يدعمه المنتج

- **تبديل اللغة** — لقوائم تخدم أكثر من جمهور
- **تبديل العملة** — للسبب نفسه
- **تعدّد الفروع** — قائمة واحدة وعدّة مواقع، بأصناف تختلف بينها
- **التصفّح حسب الفئة** — العمود الفقري لأي قائمة
- **العروض والمميّز** — الطبقة الترويجية التي يطلبها كل مطعم
- **مشاركة طبق إلى هاتف** — إرسال صنف واحد مباشرة إلى الزبون
- **علامة خاصة بكل مطعم** — ضمن نظام متماسك

## ثابتٌ حيث يجب

التخطيط ومقاس الخطّ والتباعد والتسلسل الهرمي ثوابت. أما اللون والشعار والصور والمحتوى والترتيب فمن حقّ المالك. والنتيجة أن القائمة تبقى مقروءة مهما ضُبطت، وهذا وحده ما يُبقي منتجًا بعلامة بيضاء صامدًا أمام مئة مالك مختلف.`,
  },

  "kafoo-web": {
    en: `## An unusual proposition has to be explained before it can be sold

Kafoo offers guaranteed investment opportunities in used car spare parts. That sentence raises more questions than it answers, which is exactly the problem the site had to solve. An investor who does not understand the mechanism will not put money into it however well the page is designed.

So the page is not built as a pitch. It is built as an answer to four questions asked in sequence.

## The four questions

- **What is the principle** — how the model works, before anything is asked of the reader
- **What do I get** — the return, stated plainly
- **What are the opportunities** — the specific offerings currently open
- **What guarantees them** — the part that determines whether anyone proceeds

Around those: bilingual Arabic and English throughout, and direct enquiry routes at each stage rather than only at the end.

## Green that signals growth without shouting

The identity uses a measured green — growth is the right association for an investment product, but the saturated version of it reads as a promise the page cannot keep. Restraint is doing persuasive work here: in this category, a site that looks eager is a site that gets distrusted.`,
    ar: `## الطرح غير المألوف يحتاج شرحًا قبل أن يُباع

تعرض «كفو» فرص استثمار مضمونة في قطع غيار السيارات المستعملة. وهذه الجملة تثير من الأسئلة أكثر ممّا تجيب، وهذا بالضبط ما كان على الموقع حلّه. فالمستثمر الذي لا يفهم الآليّة لن يضع فيها مالًا مهما أُتقن تصميم الصفحة.

لذلك لم تُبنَ الصفحة عرضًا ترويجيًّا، بل جوابًا عن أربعة أسئلة مرتّبة.

## الأسئلة الأربعة

- **ما المبدأ** — كيف يعمل النموذج، قبل أن يُطلب من القارئ شيء
- **ما الذي أحصل عليه** — العائد، مذكورًا بوضوح
- **ما الفرص المتاحة** — العروض المفتوحة حاليًا تحديدًا
- **ما الذي يضمنها** — الجزء الذي يحدّد إن كان أحدٌ سيمضي قدمًا

وحول ذلك: عربية وإنجليزية في كل الصفحة، ومسارات استفسار مباشرة عند كل مرحلة لا في النهاية وحدها.

## أخضرُ يوحي بالنموّ دون صياح

تعتمد الهوية أخضر متزنًا — فالنموّ هو الإيحاء الصحيح لمنتج استثماري، لكن نسخته المشبعة تُقرأ وعدًا لا تستطيع الصفحة الوفاء به. والتحفّظ هنا يؤدّي عملًا إقناعيًّا: في هذا الصنف، الموقع الذي يبدو متلهّفًا موقعٌ يُشَكّ فيه.`,
  },

  "krsy-web": {
    en: `## A fast decision with a low trust bar

KRSY sells social-media growth services across the Middle East. The category has a specific problem: buyers decide in minutes, and they have usually been burned before. Any friction reads as evasion, and any excess reassurance reads as a scam.

The design answer was to shorten the path until there is almost nothing to distrust, and to put the credibility signals early rather than in a testimonials section nobody scrolls to.

## The path, start to finish

- **Pick a platform** — the first and only broad decision
- **Pick a category** — the service type within it
- **Request the service** — a short form, not an account
- **Pay through PayPal** — a payment name the buyer already trusts, which does more for credibility than any badge
- **24/7 support** — stated early, because availability is the main thing buyers in this category worry about

## Dark neon, because that is how the category reads

The visual language — dark backgrounds, vivid gradients — is not a stylistic preference. It is how this audience already recognises the category, and a site that arrives looking like a corporate consultancy would be read as unfamiliar rather than as trustworthy.

Meeting the audience's existing expectations is the point; the trust is earned by the short path underneath.`,
    ar: `## قرارٌ سريع وسقف ثقة منخفض

تبيع «كرسي» خدمات نموّ حسابات التواصل الاجتماعي في الشرق الأوسط. وللصنف مشكلة خاصة: المشترون يقرّرون في دقائق، وقد سبق أن خُدعوا في الغالب. فأيّ احتكاك يُقرأ تهرّبًا، وأيّ إفراط في الطمأنة يُقرأ احتيالًا.

كان الجواب التصميمي تقصير الطريق حتى لا يبقى فيه ما يُشَكّ فيه تقريبًا، وتقديم إشارات المصداقية مبكّرًا لا في قسم شهادات لا يصل إليه أحد.

## الطريق من أوّله إلى آخره

- **اختيار المنصّة** — القرار العريض الأول والأخير
- **اختيار الفئة** — نوع الخدمة ضمنها
- **طلب الخدمة** — نموذج قصير لا حساب
- **الدفع عبر PayPal** — اسمٌ يثق به المشتري أصلًا، وهو يفعل للمصداقية أكثر ممّا يفعل أيّ شعار ضمان
- **دعم على مدار الساعة** — مذكور مبكّرًا، لأن التوافر أكثر ما يقلق مشتري هذا الصنف

## نيون داكن، لأن هكذا يُقرأ الصنف

اللغة البصرية — خلفيات داكنة وتدرّجات صارخة — ليست تفضيلًا أسلوبيًّا. هكذا يتعرّف هذا الجمهور على الصنف أصلًا، والموقع الذي يأتي بمظهر شركة استشارات مؤسسية سيُقرأ غريبًا لا موثوقًا.

المقصود مقابلة توقّعات الجمهور القائمة؛ أما الثقة فيكسبها الطريق القصير تحتها.`,
  },

  "codxeon-website": {
    en: `## The claim worth building the site around

Codxeon promises to turn ideas into digital excellence — which is what every agency promises, and therefore persuades nobody. Going through their material, the one claim that was actually specific was the 24-hour process: how quickly a brief becomes a plan.

That is a real differentiator, and it is checkable, so the site is built around walking a visitor through it rather than around the slogan.

## What the site covers

- **The 24-hour process** — the sequence from brief to plan, laid out step by step
- **Web development** — sites and platforms
- **Mobile apps** — iOS and Android work
- **UI/UX design** — the design practice on its own
- **Digital marketing** — the growth side
- **Consultancy** — for clients who need direction before delivery
- **A data-driven strategy layer** — how decisions get made rather than guessed

## Purple gradients, held in check

The identity runs on purple gradients throughout. The discipline was keeping them to backgrounds and accents rather than letting them wash across content — a gradient behind body text is the fastest way to make an agency site look like a template, and the whole argument here rests on the company looking deliberate.`,
    ar: `## الادّعاء الجدير ببناء الموقع حوله

تَعِد «كودكسيون» بتحويل الأفكار إلى تميّز رقمي — وهو ما تَعِد به كل وكالة، ولذلك لا يقنع أحدًا. وبمراجعة موادّها، كان الادّعاء الوحيد المحدَّد فعلًا هو دورة الأربع والعشرين ساعة: كم يستغرق تحوّل الطلب إلى خطة.

هذا فارقٌ حقيقي وقابل للتحقّق، فبُني الموقع على اصطحاب الزائر خلاله بدل البناء على الشعار.

## ما يغطّيه الموقع

- **دورة الأربع والعشرين ساعة** — التسلسل من الطلب إلى الخطة، خطوةً خطوة
- **تطوير الويب** — المواقع والمنصّات
- **تطبيقات الجوال** — أعمال iOS وأندرويد
- **تصميم واجهات وتجربة المستخدم** — الممارسة التصميمية بذاتها
- **التسويق الرقمي** — جانب النموّ
- **الاستشارات** — لعملاء يحتاجون توجيهًا قبل التنفيذ
- **طبقة استراتيجية قائمة على البيانات** — كيف تُتَّخذ القرارات بدل أن تُخمَّن

## تدرّجات بنفسجية، ممسوكة

تسري الهوية على تدرّجات بنفسجية في كل الموقع. والانضباط كان في حصرها بالخلفيات واللمسات بدل تركها تجتاح المحتوى — فالتدرّج خلف نصّ الفقرات أسرع طريق لجعل موقع وكالة يبدو قالبًا جاهزًا، والحجّة كلّها هنا قائمة على أن تبدو الشركة متعمّدة في اختياراتها.`,
  },

  "jadarat-platform": {
    en: `## A consultancy is judged on whether it looks established

Jadarat is a consulting and training firm in Lattakia offering performance analysis, institutional assessment, administrative systems and internationally accredited ISO certification. Its clients are organisations, and organisations hire consultants partly on the evidence that other organisations already have.

A site for this kind of firm has a narrow failure mode: look new, and the credentials stop being believed.

## What the thirty pages carry

- **Performance analysis** — the diagnostic side of the practice
- **Institutional assessment** — evaluating how an organisation actually works
- **Administrative systems** — the systems the firm designs and installs
- **ISO certification** — internationally accredited, and the reason many clients arrive
- **Training programmes** — with their own routes and detail
- **Careers** — a consultancy recruits publicly and continuously
- **Articles** — the credibility layer, kept as a real section rather than a blog afterthought

## Gold on brown, built to look settled

Thirty pages of Arabic RTL, structured so that services, training, careers and articles each have a clear route rather than sharing one crowded menu.

The gold-on-brown palette was chosen against the current preference for bright, light consultancy branding. This client's advantage is accumulated expertise, and the design had to read as a firm that has been doing this for a while — because that is, in this category, the thing being bought.`,
    ar: `## بيت الاستشارات يُحكَم عليه بمدى بدوّه راسخًا

«جدارات» شركة استشارات وتدريب في اللاذقية تقدّم تحليل الأداء، والتقييم المؤسسي، والأنظمة الإدارية، وشهادات الأيزو المعتمدة دوليًّا. وعملاؤها مؤسسات، والمؤسسات توظّف الاستشاريين استنادًا في جانب منه إلى أن مؤسسات أخرى وظّفتهم قبلها.

ولموقع شركة كهذه نمط فشل ضيّق: إن بدا جديدًا، توقّف الناس عن تصديق الاعتمادات.

## ما تحمله الصفحات الثلاثون

- **تحليل الأداء** — الوجه التشخيصي للممارسة
- **التقييم المؤسسي** — دراسة كيف تعمل المؤسسة فعلًا
- **الأنظمة الإدارية** — الأنظمة التي تصمّمها الشركة وتُرسيها
- **شهادات الأيزو** — معتمدة دوليًّا، وهي سبب وصول كثير من العملاء
- **البرامج التدريبية** — بمساراتها وتفاصيلها الخاصة
- **الوظائف** — بيت الاستشارات يوظّف علنًا وباستمرار
- **المقالات** — طبقة المصداقية، مُبقاةً قسمًا حقيقيًّا لا مدوّنة على الهامش

## ذهبيّ على بنّي، مبنيّ ليبدو مستقرًّا

ثلاثون صفحة عربية من اليمين إلى اليسار، مُنظَّمة بحيث تحظى الخدمات والتدريب والوظائف والمقالات بمسار واضح لكلٍّ منها بدل ازدحامها في قائمة واحدة.

واختيار الذهبي على البنّي جاء على خلاف الميل السائد إلى هويّات استشارية فاتحة ومشرقة. فميزة هذا العميل خبرةٌ متراكمة، وكان على التصميم أن يُقرأ بيتًا يمارس هذا العمل منذ زمن — لأن هذا تحديدًا، في هذا الصنف، هو ما يُشترى.`,
  },

  "phoenitech-website": {
    en: `## Reading as a partner, not as a vendor list

PhoeniTech positions itself as "your partner to success". A company that says that and then presents five services as five bullet points has contradicted itself on the first screen — a vendor lists what it sells; a partner explains what it will do with you.

So each of the five lines gets room to make its own case rather than a slot in a grid.

## The five service lines

- **App development** — mobile and platform work
- **Tech consulting** — advisory before delivery
- **Server management** — the operational side clients rarely see and always need
- **UI/UX design** — the design practice
- **Brand building** — identity work, which is how many clients first arrive

## Bilingual, and finally a mark

The site runs in Arabic and English throughout, structured so neither reads as the translated one.

The teal phoenix identity was part of the same job. The company had no mark people remembered, which is a specific commercial problem: a technology firm that cannot be pictured cannot be recommended by name. The phoenix gave them something to be recognised by, and the site is built around it rather than decorated with it.`,
    ar: `## أن تُقرأ شريكًا لا قائمة خدمات

تقدّم «فينيتك» نفسها بوصفها «شريكك نحو النجاح». والشركة التي تقول هذا ثم تعرض خمس خدمات في خمس نقاط تكون قد ناقضت نفسها في الشاشة الأولى — فالبائع يعدّد ما يبيع، والشريك يشرح ما سيفعله معك.

لذلك نال كلٌّ من خطوط الخدمة الخمسة مساحةً ليعرض حجّته، بدل خانة في شبكة.

## خطوط الخدمة الخمسة

- **تطوير التطبيقات** — أعمال الجوال والمنصّات
- **الاستشارات التقنية** — المشورة قبل التنفيذ
- **إدارة الخوادم** — الجانب التشغيلي الذي نادرًا ما يراه العميل ويحتاجه دائمًا
- **تصميم واجهات وتجربة المستخدم** — الممارسة التصميمية
- **بناء العلامة** — أعمال الهوية، وهي مدخل كثير من العملاء

## ثنائيّ اللغة، وأخيرًا علامة

يعمل الموقع بالعربية والإنجليزية كاملتين، مبنيًّا بحيث لا تُقرأ إحداهما بوصفها المترجَمة.

وهوية العنقاء الفيروزية كانت جزءًا من العمل نفسه. لم يكن للشركة علامة يتذكّرها الناس، وهذه مشكلة تجارية محدّدة: شركةُ تقنيةٍ لا يمكن تخيّلها لا يمكن ترشيحها بالاسم. أعطتهم العنقاء ما يُعرَفون به، والموقع مبنيّ حولها لا مزيَّن بها.`,
  },

  "lamasat-website": {
    en: `## The promise only works if you show the whole chain

"Design your space, define your story" is a strong line and an easy one to fail. LAMASAT does not just design interiors — it engineers and executes them, and it manufactures the furniture that goes in. A site that shows only beautiful rooms proves the first part and leaves the client wondering who actually builds it.

So the pages follow the chain in order, from the first drawing to the final site visit.

## What the site covers

- **Architectural design** — where a project begins
- **Interior design** — the discipline the brand is known for
- **Custom furniture manufacturing** — made rather than sourced, which is the differentiator
- **Project supervision** — the execution stage clients worry about most
- **A digital showroom** — furniture and lighting, browsable as a range
- **Philosophy and vision** — given their own space, because in this trade the client is choosing a sensibility

## Navy and blush, editorial rather than commercial

The palette and the pacing are drawn from design publishing rather than retail: generous white space, restrained type, images allowed to be large and quiet.

That is a commercial decision, not an aesthetic indulgence. Interior clients are buying taste, and a site that looks like a catalogue argues against the exact thing being sold.`,
    ar: `## الوعد لا ينفع إلا إذا أظهرتَ السلسلة كاملة

«صمّم مساحتك، وعرِّف حكايتك» جملة قوية ويسهل الإخفاق في تحقيقها. فـ«لمسات» لا تصمّم الديكورات وحسب، بل تهندسها وتنفّذها، وتصنّع الأثاث الذي يدخلها. والموقع الذي يعرض غرفًا جميلة فقط يثبت الجزء الأول ويترك العميل يتساءل عمّن ينفّذ فعلًا.

لذلك تتبع الصفحات السلسلة بترتيبها، من أول مخطّط إلى آخر زيارة موقع.

## ما يغطّيه الموقع

- **التصميم المعماري** — حيث يبدأ المشروع
- **التصميم الداخلي** — الاختصاص الذي تُعرَف به العلامة
- **تصنيع الأثاث المخصّص** — مصنوعٌ لا مورَّد، وهذا هو الفارق
- **الإشراف على التنفيذ** — المرحلة التي تقلق العميل أكثر من سواها
- **صالة عرض رقمية** — الأثاث والإنارة، قابلين للتصفّح كتشكيلة
- **الفلسفة والرؤية** — بمساحة خاصة، لأن العميل في هذه المهنة يختار ذائقة

## كحليّ ووردي باهت، بأسلوب تحريري لا تجاري

اللوحة اللونية والإيقاع مستمدّان من مجلات التصميم لا من التجزئة: فراغ أبيض سخيّ، وطباعة متحفّظة، وصور يُسمح لها أن تكون كبيرة وهادئة.

وهذا قرار تجاري لا ترفٌ جمالي. فعميل التصميم الداخلي يشتري ذائقة، والموقع الذي يبدو كتالوجًا يجادل ضدّ الشيء نفسه الذي يُباع.`,
  },
};

/* ── Batch 4 — identity, print and motion ──────────────────────────────── */

BATCHES["4"] = {
  "solareva-brand-identity": {
    en: `## Two ideas in one mark

SolaReva is a Dubai solar-energy company whose promise is "Boundless Impact". The mark had to carry energy and environment simultaneously — and those two ideas usually fight, because the visual vocabulary for energy is sharp and electric while the vocabulary for environment is soft and organic.

The solution was to combine rather than choose: a bulb, leaves and a lightning bolt resolved into a single form, so neither idea is an add-on to the other.

## Where the identity had to hold

- **The logo system** — the primary mark and its variations
- **Business cards** — the smallest reproduction the mark has to survive
- **Letterhead** — where an identity meets formal correspondence
- **Van livery** — the mark moving at speed, seen for two seconds
- **Storefront signage** — read from across a street
- **The website hero** — the mark at the largest scale it will ever appear

## Black, red, orange and amber

The palette runs warm against black, which does the energy work without borrowing the saturated yellow every solar company uses.

An identity is not finished when the logo is drawn — it is finished when it survives the places it will actually be seen. Van livery and storefront signage are the honest tests here: both are viewed badly, briefly and from a distance, and a mark that holds up in those two situations will hold up anywhere.`,
    ar: `## فكرتان في علامة واحدة

«سولاريفا» شركة طاقة شمسية في دبي، ووعدها «أثرٌ بلا حدود». وكان على العلامة أن تحمل الطاقة والبيئة في آن — وهما فكرتان تتنازعان عادة، لأن المفردات البصرية للطاقة حادّة كهربائية، ومفردات البيئة ليّنة عضوية.

وكان الحلّ في الجمع لا الاختيار: مصباح وأوراق وصاعقة تنحلّ في شكل واحد، فلا تكون إحدى الفكرتين إضافةً على الأخرى.

## أين كان على الهوية أن تصمد

- **نظام الشعار** — العلامة الأساسية وتنويعاتها
- **بطاقات العمل** — أصغر مقاس يجب أن تنجو فيه العلامة
- **الأوراق الرسمية** — حيث تلتقي الهوية بالمراسلات الرسمية
- **تغليف السيارات** — العلامة وهي تتحرّك بسرعة، تُرى في ثانيتين
- **لافتة الواجهة** — تُقرأ من الرصيف المقابل
- **واجهة الموقع** — العلامة بأكبر مقاس ستظهر به يومًا

## أسود وأحمر وبرتقالي وكهرماني

تسري اللوحة دافئةً على الأسود، فتؤدّي وظيفة الطاقة دون استعارة الأصفر المشبع الذي تستخدمه كل شركة شمسية.

الهوية لا تكتمل حين يُرسَم الشعار، بل حين تصمد في الأماكن التي ستُرى فيها فعلًا. وتغليف السيارات ولافتة الواجهة هما الاختباران الصادقان هنا: كلاهما يُرى في ظروف سيّئة ولمدّة قصيرة ومن بعيد، والعلامة التي تصمد في هذين الموضعين تصمد في أي موضع.`,
  },

  "cadeau-boutique-brand": {
    en: `## The identity is part of the gift

Cadeau Boutique in Riyadh sells the feeling more than the object — "Express how you feel". Which sets an unusual standard for the branding: it is not packaging that protects a product and gets thrown away, it is material the recipient sees at the moment of receiving. It has to look like something you would be pleased to be handed.

## The system

- **The GB monogram** — drawn as a gift ribbon, in gold
- **The palette** — charcoal, mauve and cream behind it
- **Bilingual business cards** — Arabic and English given equal treatment
- **Letterhead** — the formal layer
- **QR hang tags** — the piece that actually travels with the gift
- **Material finishes** — kraft, white and marble, each changing how the same mark reads

## Why the finishes matter as much as the mark

The same gold monogram on kraft, on white and on marble is three different products: the kraft reads warm and handmade, the white reads clean and modern, the marble reads expensive. Specifying all three gave the boutique a range to match the occasion — a birthday and a corporate gift are not the same purchase — without needing three separate identities.

That is the whole design decision here: one mark, several registers, chosen by material rather than by redrawing.`,
    ar: `## الهوية جزء من الهديّة

تبيع «كادو بوتيك» في الرياض الشعور أكثر ممّا تبيع الشيء — «عبّر عمّا تشعر به». وهذا يضع للهوية معيارًا غير معتاد: فهي ليست تغليفًا يحمي منتجًا ثم يُرمى، بل مادّةً يراها المُهدى إليه في لحظة التسلّم. وعليها أن تبدو شيئًا يسرّك أن يُناوَل إليك.

## النظام

- **حرفا GB** — مرسومان على هيئة شريط هديّة، بالذهبي
- **اللوحة اللونية** — الفحمي والموف والكريمي خلفهما
- **بطاقات عمل ثنائية اللغة** — العربية والإنجليزية بمعاملة متكافئة
- **الأوراق الرسمية** — الطبقة الرسمية
- **بطاقات معلّقة برمز QR** — القطعة التي تسافر مع الهديّة فعلًا
- **تشطيبات الخامات** — الكرافت والأبيض والرخام، وكلٌّ منها يغيّر كيف تُقرأ العلامة نفسها

## لماذا تعادل التشطيبات العلامة أهميّة

الحرفان الذهبيّان نفساهما على الكرافت وعلى الأبيض وعلى الرخام ثلاثة منتجات مختلفة: الكرافت يُقرأ دافئًا يدويًّا، والأبيض نظيفًا حديثًا، والرخام ثمينًا. وتحديد الثلاثة أعطى المتجر مدًى يوائم المناسبة — فهديّة عيد ميلاد ليست هديّة مؤسسية — دون الحاجة إلى ثلاث هويّات منفصلة.

وهذا هو القرار التصميمي كلّه هنا: علامة واحدة، وعدّة مقامات، تُختار بالخامة لا بإعادة الرسم.`,
  },

  "nana-gelato-packaging": {
    en: `## One family that still separates on the shelf

Packaging a gelato range means solving the same problem repeatedly under a contradiction. From a distance, the shelf has to read as one brand — that is what shelf presence is. Up close, a customer reaching for mango must not pick up strawberry — that is what a label is for.

Solve only the first and the flavours become indistinguishable. Solve only the second and you have a shelf of unrelated products.

## The system

- **One bilingual label structure** — Arabic and English in a fixed relationship, held across every flavour
- **Colour as the differentiator** — carrying the flavour identity
- **Fruit imagery** — the second, faster signal, readable before any text
- **A consistent brand block** — the part that never moves, which is what makes the range read as a family
- **Strawberry, mango and the rest of the range** — each distinct within the same frame

## Fixed frame, variable content

Everything structural stays put: logo placement, type hierarchy, the proportions of the label. Only colour and fruit change.

That is what lets the range grow. A new flavour is a colour and an image, not a new design — which matters commercially, because a system that requires a designer for every addition is a system the client will eventually abandon.`,
    ar: `## عائلة واحدة تتمايز مع ذلك على الرفّ

تغليف تشكيلة جيلاتو معناه حلّ المسألة نفسها مرارًا تحت تناقض. فمن بعيد يجب أن يُقرأ الرفّ علامةً واحدة — وهذا هو الحضور على الرفّ. ومن قريب يجب ألّا يلتقط الزبون الممدّ يده إلى المانغو عبوةَ الفراولة — وهذا ما وُجد الملصق لأجله.

فإن حُلّ الأول وحده تعذّر تمييز النكهات، وإن حُلّ الثاني وحده صار الرفّ منتجات لا صلة بينها.

## النظام

- **بنية ملصق واحدة ثنائية اللغة** — العربية والإنجليزية في علاقة ثابتة، محفوظة عبر كل نكهة
- **اللون بوصفه أداة التمييز** — يحمل هوية النكهة
- **صور الفاكهة** — الإشارة الثانية الأسرع، تُقرأ قبل أي نصّ
- **كتلة العلامة الثابتة** — الجزء الذي لا يتحرّك، وهو ما يجعل التشكيلة تُقرأ عائلةً واحدة
- **الفراولة والمانغو وبقية التشكيلة** — كلٌّ متمايزة داخل الإطار نفسه

## إطارٌ ثابت ومحتوًى متغيّر

كل ما هو بنيوي يبقى مكانه: موضع الشعار، وتسلسل الخطوط، ونِسَب الملصق. ولا يتغيّر سوى اللون والفاكهة.

وبهذا تستطيع التشكيلة أن تنمو. فالنكهة الجديدة لونٌ وصورة، لا تصميم جديد — وهذا مهمّ تجاريًّا، لأن النظام الذي يستدعي مصمّمًا مع كل إضافة نظامٌ سيهجره العميل في النهاية.`,
  },

  "travel-agency-branding": {
    en: `## Built to survive print

A travel agency still lives on paper. Brochures are handed across a counter, ID cards are worn, covers are folded and carried around for days. So this identity was specified for print first and screens second, which is the reverse of the current default and the right way round for this client.

## What the set covers

- **The logo in use** — not presented in isolation but shown applied, which is the only honest way to judge a mark
- **ID cards** — worn by staff, seen at close range every day
- **Brochure covers** — front and back, designed as a pair
- **Interior page layouts** — the templates that keep the brochure consistent once it is opened
- **A social cover** — the one digital piece, matched to the print

## The inside pages are the real work

Most identity sets stop at the cover, and then the brochure's interior is laid out by whoever is free, and the brand quietly falls apart on page three.

Specifying the interior templates is what stops that: a grid, a type hierarchy and image rules that hold for as many pages as the agency needs. It is unglamorous, and it is the difference between an identity that survives one print run and one that survives the year.`,
    ar: `## مصمَّمة لتصمد في المطبوع

وكالة السفر ما زالت تعيش على الورق. الكتيّبات تُناوَل عبر طاولة، والبطاقات التعريفية تُعلَّق، والأغلفة تُطوى وتُحمَل أيامًا. لذلك حُدِّدت هذه الهوية للمطبوع أوّلًا وللشاشة ثانيًا، وهو عكس الخيار السائد اليوم والترتيب الصحيح لهذا العميل.

## ما تشمله المجموعة

- **الشعار في الاستخدام** — لا معروضًا بمعزل بل مطبَّقًا، وهي الطريقة الصادقة الوحيدة للحكم على علامة
- **البطاقات التعريفية** — يحملها الموظفون، وتُرى عن قرب كل يوم
- **أغلفة الكتيّب** — الأمامي والخلفي، مصمَّمان معًا
- **تخطيطات الصفحات الداخلية** — القوالب التي تُبقي الكتيّب متّسقًا بعد فتحه
- **غلاف لمنصّات التواصل** — القطعة الرقمية الوحيدة، موائمة للمطبوع

## الصفحات الداخلية هي العمل الحقيقي

معظم مجموعات الهوية تتوقّف عند الغلاف، ثم يخرج الكتيّب من الداخل بترتيب من كان متفرّغًا، فتتفكّك العلامة بهدوء في الصفحة الثالثة.

وتحديد قوالب الداخل هو ما يوقف ذلك: شبكة، وتسلسل خطوط، وقواعد للصور تصمد لأيّ عدد من الصفحات تحتاجه الوكالة. عملٌ غير برّاق، وهو الفارق بين هوية تنجو من طبعة واحدة وهوية تنجو من السنة.`,
  },

  "bw-company-profile": {
    en: `## Written for a reader who will skim it in five minutes

A holding-group profile has one job: answer "who are you" for someone who will not read it properly. Board members, prospective partners and clients open a document like this, turn pages quickly, and stop only where something catches them.

Designing for careful reading is therefore a mistake. The answer has to build page by page, so that a reader who stops anywhere has still understood something complete.

## How the document is sequenced

- **Cover** — establishing the register before a word is read
- **About** — who the group is
- **Vision and mission** — what it is for
- **Structure and geographical reach** — the scale question, answered with a map rather than a claim
- **The subsidiaries** — the companies under the group
- **The service lines** — what is actually sold
- **Contact** — the close

## Dark tech blue, page after page

The palette is a dark technology blue with glowing brand visuals — chosen to hold the document together across a sequence long enough that consistency does more work than any single spread.

Each page is designed to be self-contained: a reader who opens to the subsidiaries and reads nothing else still leaves with an accurate idea of the group's size and shape.`,
    ar: `## مكتوب لقارئ سيتصفّحه في خمس دقائق

لبروفايل المجموعة القابضة مهمّة واحدة: الإجابة عن سؤال «من أنتم» لشخص لن يقرأه قراءةً حقيقية. أعضاء مجالس، وشركاء محتملون، وعملاء، يفتحون وثيقة كهذه ويقلّبون صفحاتها سريعًا ولا يتوقّفون إلا حيث يستوقفهم شيء.

ولذلك فالتصميم من أجل القراءة المتأنّية خطأ. على الجواب أن يتراكم صفحةً صفحة، بحيث يخرج القارئ الذي توقّف عند أي موضع وقد فهم شيئًا كاملًا.

## كيف رُتّبت الوثيقة

- **الغلاف** — يُرسي المقام قبل أن تُقرأ كلمة
- **من نحن** — من هي المجموعة
- **الرؤية والرسالة** — لماذا وُجدت
- **الهيكل والانتشار الجغرافي** — سؤال الحجم، مُجابًا بخريطة لا بادّعاء
- **الشركات التابعة** — الشركات تحت المجموعة
- **خطوط الخدمات** — ما يُباع فعلًا
- **التواصل** — الخاتمة

## أزرق تقني داكن، صفحةً بعد صفحة

اللوحة أزرق تقني داكن مع عناصر بصرية متوهّجة — اختيرت لتمسك الوثيقة عبر تسلسل طويل بما يكفي ليؤدّي الاتّساق فيه عملًا أكبر ممّا تؤدّيه أي صفحة مفردة.

وكل صفحة مصمَّمة لتكون قائمة بذاتها: القارئ الذي يفتح على الشركات التابعة ولا يقرأ سواها يخرج مع ذلك بتصوّر صحيح عن حجم المجموعة وشكلها.`,
  },

  "believe-in-syria-campaign": {
    en: `## Media Director means owning everything people see

I was Media Director for JCI Syria's Believe in Syria campaign between 2018 and 2019. The title sounds abstract; in practice it meant that every piece of material the campaign put in front of a person was my responsibility, and that they all had to look like one campaign despite being produced at different times, at different scales, by different printers.

## What the campaign produced

- **One-pagers** — the working document of any campaign
- **Formal invitations** — where the campaign had to look institutional
- **Table cards** — event material, produced fast and in volume
- **Business cards** — for the team representing the campaign
- **T-shirts** — the identity applied to a surface that distorts it
- **The campaign book** — the long-form piece everything else pointed toward

## Leading print and digital together

The reason to run both under one direction is consistency, and consistency is harder than it sounds across a large outreach effort: printers substitute stock, sizes change to fit a budget, an urgent piece gets made by someone else the night before an event.

Holding an identity together through all of that is mostly decision-making rather than designing — which specification bends, which never does. What survived is a campaign that looked like one thing across two years and a lot of hands.`,
    ar: `## أن تكون مديرة إعلام يعني أن تملك كل ما يراه الناس

كنت مديرة الإعلام في حملة «آمن بسوريا» التابعة لـ JCI سوريا بين عامَي 2018 و2019. اللقب يبدو مجرّدًا؛ أما عمليًّا فقد كان يعني أن كل مادّة تضعها الحملة أمام إنسان مسؤوليّتي، وأن عليها جميعًا أن تبدو حملةً واحدة رغم إنتاجها في أوقات مختلفة وبمقاسات مختلفة وعند مطابع مختلفة.

## ما أنتجته الحملة

- **الأوراق التعريفية** — الوثيقة اليومية لأي حملة
- **الدعوات الرسمية** — حيث كان على الحملة أن تبدو مؤسسية
- **بطاقات الطاولات** — مادّة الفعاليات، تُنتَج بسرعة وبكميّات
- **بطاقات العمل** — للفريق الذي يمثّل الحملة
- **القمصان** — الهوية مطبَّقة على سطح يشوّهها
- **كتاب الحملة** — القطعة المطوّلة التي كان كل ما عداها يشير إليها

## قيادة المطبوع والرقمي معًا

سبب إدارة الاثنين تحت توجيه واحد هو الاتّساق، والاتّساق أصعب ممّا يبدو في جهد توعوي واسع: المطابع تستبدل الخامات، والمقاسات تتغيّر لتناسب ميزانية، وقطعة عاجلة يصنعها شخص آخر ليلة الفعالية.

والإمساك بالهوية خلال ذلك كلّه اتّخاذُ قراراتٍ أكثر منه تصميمًا: أيّ مواصفة تلين، وأيّها لا تلين أبدًا. والذي نجا حملةٌ بدت شيئًا واحدًا على مدى سنتين وبين أيادٍ كثيرة.`,
  },

  "motion-showreel": {
    en: `## A reel is an editing problem

The animation already exists. Nothing in a showreel is made for the reel — every shot in it was produced for a client, for a purpose, at a length that suited that purpose. The work of assembling one is entirely subtractive: deciding what earns three seconds.

Which is harder than it sounds, because the instinct is to include the pieces you are proudest of, and pride is a bad editor. What belongs in a reel is what reads instantly.

## What the reel is cut from

- **Logo animations** — brand marks resolving, the shortest and most quotable pieces
- **App promos** — product motion, where the interface is the subject
- **Event visuals** — larger-format work
- **Built in After Effects** — animation and compositing
- **Cut in Premiere Pro** — the assembly, pacing and final edit
- **Concept through to final edit** — the whole chain, not just the animation

## Pacing is the argument

A reel persuades through rhythm more than through any individual shot. The cut has to keep moving before a viewer decides they have seen enough — which usually happens faster than the person who made the work expects.

So the sequencing was built around momentum: strong opening, no shot outstaying its usefulness, and an end that arrives while attention is still there.`,
    ar: `## الريل مسألة مونتاج

الأنيميشن موجود سلفًا. ولا شيء في ريل الأعمال صُنع من أجل الريل — كل لقطة فيه أُنتجت لعميل، ولغرض، وبطول يناسب ذلك الغرض. وتجميعه عملٌ طرحيّ بالكامل: أن تقرّر ما الذي يستحقّ ثلاث ثوانٍ.

وهذا أصعب ممّا يبدو، لأن الغريزة تدفع إلى إدراج ما تفخر به، والفخر محرّرٌ سيّئ. أما ما ينتمي إلى الريل فهو ما يُقرأ فورًا.

## ممّ رُكِّب الريل

- **أنيميشن الشعارات** — علامات تتشكّل، وهي أقصر القطع وأكثرها قابليةً للاقتباس
- **إعلانات التطبيقات** — حركة المنتج، حيث تكون الواجهة هي الموضوع
- **بصريّات الفعاليات** — أعمال بمقاسات أكبر
- **مبنيّ في After Effects** — الأنيميشن والتركيب
- **ممنتَج في Premiere Pro** — التجميع والإيقاع والمونتاج النهائي
- **من الفكرة إلى المونتاج الأخير** — السلسلة كاملة لا الأنيميشن وحده

## الإيقاع هو الحجّة

الريل يقنع بالإيقاع أكثر ممّا يقنع بأي لقطة مفردة. وعلى المونتاج أن يبقى متحرّكًا قبل أن يقرّر المشاهد أنه رأى ما يكفي — وهي لحظة تأتي أسرع ممّا يتوقّع صانع العمل عادةً.

لذلك بُني التسلسل حول الاندفاع: افتتاحية قوية، ولا لقطة تمكث بعد أن تؤدّي دورها، ونهاية تصل والانتباه ما زال حاضرًا.`,
  },

  "zanqa-app-promo": {
    en: `## Two videos with opposite jobs

Both are for the Zanqa education platform, and treating them as one task would have failed both. A promo and a release video share a brand and nothing else — they address different people who already know different amounts.

## The promo

Made for someone who has never heard of Zanqa. It introduces the app and its content categories, and its whole burden is establishing what the thing is before attention runs out. Nothing can be assumed; every term has to be shown rather than named.

## The 2.2.1 release video

Made for people already using the app. They do not need the product explained — they need to know what changed:

- **Automated tests** — the significant addition in this release
- **Extra publisher tools** — the supply side of the platform
- **The rest of the release** — the smaller changes, covered without inflating them

A release video that re-explains the product insults the viewer, and one that assumes too much loses them. The line between those is the whole design problem.

## Built in After Effects and Premiere Pro

Same toolchain, same brand, deliberately different pacing: the promo has room to build, the release video does not and should not.`,
    ar: `## فيديوهان بمهمّتين متعاكستين

كلاهما لمنصّة «زنقة» التعليمية، ومعاملتهما بوصفهما مهمّة واحدة كانت ستُخفق فيهما معًا. فالفيديو التعريفي وفيديو الإصدار لا يشتركان إلا في العلامة — إذ يخاطبان أشخاصًا يعرفون قدرًا مختلفًا أصلًا.

## الفيديو التعريفي

صُنع لمن لم يسمع بـ«زنقة» قطّ. يعرّف بالتطبيق وبفئات محتواه، وعبؤه كلّه أن يُثبت ما هو هذا الشيء قبل أن ينفد الانتباه. لا يمكن افتراض شيء؛ وكل مصطلح يجب أن يُعرَض لا أن يُسمّى.

## فيديو الإصدار 2.2.1

صُنع لمن يستخدمون التطبيق أصلًا. هؤلاء لا يحتاجون شرحًا للمنتج، بل يحتاجون معرفة ما تغيّر:

- **الاختبارات الآلية** — الإضافة الأبرز في هذا الإصدار
- **أدوات إضافية للناشرين** — الجانب التزويدي في المنصّة
- **بقية الإصدار** — التغييرات الأصغر، مغطّاة دون تضخيم

فيديو إصدار يعيد شرح المنتج يهين المشاهد، وآخر يفترض أكثر ممّا ينبغي يفقده. والخطّ بين الاثنين هو المسألة التصميمية كلّها.

## مبنيّان في After Effects وPremiere Pro

الأدوات نفسها، والعلامة نفسها، وإيقاع مختلف عن قصد: للتعريفي متّسع ليتراكم، وفيديو الإصدار لا متّسع لديه ولا ينبغي أن يكون.`,
  },

  "albroker-promo": {
    en: `## The audience already knows the domain

Albroker is a maritime shipment-brokerage app, and its promo is aimed at brokers — people who arrange cargo between shippers and vessel operators for a living. They do not need freight explained to them, and a video that starts by explaining it has already lost them.

That single fact set the length, the pacing and what could be cut.

## What the promo shows

- **Vessel feeds** — the live picture of what is available
- **Freight offers** — the actual transactions the app exists for
- **The points system** — the incentive layer built into the platform
- **Real screens** — the app's own interface, not mock-ups drawn for the video

## Real screens, on purpose

Animating invented screens is easier and looks better, and it is why so many app promos feel weightless — a broker recognises immediately that they are being shown something that does not exist yet.

Using the product's own interface constrains the animation, because real screens have real density and will not compose neatly. It also makes the video evidence rather than illustration, which for this audience is worth more than a cleaner frame.

Cut fast, to the brand's navy identity, in After Effects.`,
    ar: `## الجمهور يعرف المجال أصلًا

«البروكر» تطبيق وساطة شحن بحري، وفيديوه التعريفي موجّه إلى الوسطاء — أشخاصٍ يرتّبون البضائع بين الشاحنين ومشغّلي السفن كسبًا لعيشهم. هؤلاء لا يحتاجون شرحًا لمعنى الشحن، والفيديو الذي يبدأ بشرحه يكون قد خسرهم سلفًا.

هذه الحقيقة وحدها حدّدت الطول والإيقاع وما يمكن حذفه.

## ما يعرضه الفيديو

- **تدفّق السفن** — الصورة الحيّة لما هو متاح
- **عروض الشحن** — المعاملات التي وُجد التطبيق من أجلها
- **نظام النقاط** — طبقة التحفيز المبنيّة في المنصّة
- **شاشات حقيقية** — واجهة التطبيق نفسها، لا نماذج رُسمت للفيديو

## شاشات حقيقية، عن قصد

تحريك شاشات مُختلَقة أسهل ويبدو أجمل، وهذا سبب إحساس كثير من إعلانات التطبيقات بالخفّة — فالوسيط يدرك فورًا أنه يُعرَض عليه شيء لم يوجد بعد.

واستخدام واجهة المنتج نفسها يقيّد الأنيميشن، لأن الشاشات الحقيقية ذات كثافة حقيقية ولا تنتظم في تكوين أنيق. لكنه يجعل الفيديو دليلًا لا رسمًا توضيحيًّا، وهذا عند هذا الجمهور أثمن من كادر أنظف.

مونتاج سريع، على هوية العلامة الكحلية، في After Effects.`,
  },

  "piaget-presentation": {
    en: `## A static deck would have contradicted the pitch

Produced at BW Group, this is a vision-and-plan presentation for a PIAGET brand event. The content is a proposal: a venue, decoration and entertainment concepts, and a social-media influencer plan.

The decision to animate the whole thing was not decoration. You cannot pitch an event experience on slides that sit still — the deck is itself a sample of the production values being proposed, and a flat one argues against the plan it contains.

## What the presentation covers

- **Venue proposal** — the space and how it would be used
- **Decoration concepts** — the visual treatment of the event
- **Entertainment concepts** — the programme
- **Influencer plan** — the social-media side of the launch
- **Over two minutes** — of fully animated slides, start to finish

## Animated so the proposal demonstrates itself

Every slide moves, which at this length is a real production rather than a few transitions added at the end. The pacing follows a spoken pitch: each idea arrives, holds long enough to land, and clears before the next.

Built in After Effects.`,
    ar: `## عرضٌ ساكن كان سينقض الطرح نفسه

أُنتج في BW Group، وهو عرض رؤية وخطة لفعالية علامة PIAGET. ومحتواه اقتراح: مكان، ومفاهيم ديكور وترفيه، وخطّة للتعاون مع صنّاع المحتوى.

وقرار تحريكه كاملًا لم يكن زخرفة. لا يمكنك أن تطرح تجربة فعالية على شرائح ساكنة — فالعرض نفسه عيّنةٌ من مستوى الإنتاج المقترح، والعرض المسطّح يجادل ضد الخطة التي يحملها.

## ما يغطّيه العرض

- **اقتراح المكان** — الفراغ وكيف سيُستخدم
- **مفاهيم الديكور** — المعالجة البصرية للفعالية
- **مفاهيم الترفيه** — البرنامج
- **خطة صنّاع المحتوى** — الجانب الاجتماعي في الإطلاق
- **أكثر من دقيقتين** — من شرائح متحرّكة بالكامل، من أوّلها إلى آخرها

## متحرّك ليُثبت الاقتراح نفسه بنفسه

كل شريحة تتحرّك، وهذا عند هذا الطول إنتاجٌ حقيقي لا انتقالاتٌ أُضيفت في النهاية. والإيقاع يتبع طرحًا منطوقًا: تصل الفكرة، وتمكث بما يكفي لتستقرّ، وتنسحب قبل التي تليها.

مبنيّ في After Effects.`,
  },
};

async function main() {
  const key = process.argv[2] ?? "1";
  const batch = BATCHES[key];
  if (!batch) {
    console.error(`no batch "${key}" — available: ${Object.keys(BATCHES).join(", ")}`);
    process.exitCode = 1;
    return;
  }

  const projects = JSON.parse(await fs.readFile(DATA, "utf8"));
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

  let written = 0;
  for (const [slug, body] of Object.entries(batch)) {
    const project = bySlug[slug];
    if (!project) {
      console.log(`  ! no project ${slug}`);
      continue;
    }
    project.bodyEn = body.en.trim();
    project.bodyAr = body.ar.trim();
    const words = body.en.trim().split(/\s+/).length;
    console.log(`  ${slug.padEnd(32)} ${String(words).padStart(4)} words`);
    written++;
  }

  await fs.writeFile(DATA, JSON.stringify(projects, null, 1));
  console.log(`\nbatch ${key}: ${written} bodies written`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
