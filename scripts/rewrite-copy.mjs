/**
 * Rewrites project descriptions in data/projects.json.
 *
 * The originals all followed one template — "X design for Y: feature, feature,
 * feature — closing clause" — and the Arabic was a word-order copy of the
 * English. Both read as machine output. These are written in first person,
 * each with its own shape, and the Arabic is composed in Arabic rather than
 * translated. Every fact (screen counts, cities, tools, figures) is carried
 * over unchanged.
 *
 * Usage: node scripts/rewrite-copy.mjs
 */
import fs from "node:fs";

const FILE = "data/projects.json";
const projects = JSON.parse(fs.readFileSync(FILE, "utf8"));
const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));

const rewrites = {
  "crenny-app": {
    en: "Nobody opens a roadside assistance app calmly. Crenny serves drivers in Iraq who are stranded and want help booked in under a minute, so I kept the flow to four decisions: drop a pin on the map, pick your vehicle class, see the price range in Iraqi dinars, confirm. Battery jumpstart, tyre change, towing and vehicle release, fuel delivery — all Arabic-first, with live payment status once the order is placed.",
    ar: "لا أحد يفتح تطبيق مساعدة على الطريق وهو هادئ. كريني يخدم سائقين في العراق تعطّلت سياراتهم ويريدون طلب المساعدة في أقل من دقيقة، لذلك اختصرت المسار إلى أربعة قرارات: حدّد موقعك على الخريطة، اختر فئة سيارتك، اطّلع على السعر التقديري بالدينار العراقي، ثم أكّد. الخدمات تشمل شحن البطارية وتبديل الإطار والقطر وفكّ الحجز وتوصيل الوقود، بواجهة عربية أولًا، مع متابعة حالة الدفع مباشرة بعد الطلب.",
  },
  "border-ports-app": {
    en: "Companies working the Iraqi border ports track money across several sites at once, and the manager checking on it is usually on a phone, not a desk. I designed an Arabic reporting app around that: switch between companies, read the daily snapshot first, then drill into revenue by port with date filtering across Umm Qasr and the rest. Sales, funds and banks, expenses and full profit each get their own report, kept legible with plain charts.",
    ar: "الشركات العاملة في المنافذ الحدودية العراقية تتابع أموالها في عدة مواقع في وقت واحد، والمدير الذي يراجعها غالبًا يفعل ذلك من هاتفه لا من مكتبه. صمّمت تطبيق تقارير عربيًا على هذا الأساس: تنقّل بين الشركات، واقرأ ملخّص اليوم أولًا، ثم ادخل إلى الإيرادات حسب المنفذ مع فلترة بالتاريخ بين أم قصر وغيرها. ولكل من المبيعات والصناديق والمصارف والمصاريف والأرباح تقريره الخاص، بمخططات بسيطة تبقى مقروءة.",
  },
  "akhdar-agri-app": {
    en: "Akhdar (أخضر) is a multi-vendor marketplace for people who farm: seeds and seedlings, fertilisers, pesticides, veterinary medicine, and equipment. Because buyers here trust the supplier as much as the product, I gave vendor profiles as much weight as the listings themselves, alongside category browsing, featured products and cart. Fresh green identity, with a wheat-spike logomark.",
    ar: "أخضر سوق إلكتروني متعدد البائعين موجّه لمن يعملون في الزراعة: بذور وشتول، وأسمدة، ومبيدات، وأدوية بيطرية، ومعدات. ولأن المشتري هنا يثق بالمورّد بقدر ثقته بالمنتج، أعطيت صفحات البائعين وزنًا يوازي وزن المنتجات نفسها، إلى جانب التصفّح حسب الفئة والمنتجات المميزة والسلة. هوية خضراء منعشة، بعلامة على شكل سنبلة قمح.",
  },
  "tawseel-food-delivery": {
    en: "Tawseel (توصيل) promises to reach you wherever you are, and the design had to hold up at the two moments that decide a food app: choosing the dish, and waiting for it. So dish pages carry sizes, add-ons and a note field, checkout stays short, and the wait is filled with live driver tracking and a call button. Arabic-first, priced in Iraqi dinars.",
    ar: "يَعِد تطبيق توصيل بأن يصلك أينما كنت، وكان على التصميم أن يصمد في اللحظتين اللتين تحسمان أي تطبيق طعام: لحظة اختيار الطبق، ولحظة الانتظار. لذلك تحمل صفحة الطبق الأحجام والإضافات وحقل الملاحظات، ويبقى إتمام الطلب قصيرًا، ويُملأ الانتظار بتتبّع السائق مباشرة وزر اتصال به. واجهة عربية أولًا، والأسعار بالدينار العراقي.",
  },
  "lamasat-furniture-app": {
    en: "The LAMASAT app had to feel like the same brand as the website without simply shrinking it. Shopping runs by category — furniture, lighting, home accessories, kitchen, bathroom — with featured products and recent orders on the way in, then search and sorting for people who already know what they want. The brand's light editorial style carries over intact.",
    ar: "كان على تطبيق لمسات أن يبدو من العلامة نفسها التي يقدّمها الموقع، من دون أن يكون مجرد نسخة مصغّرة عنه. التسوّق يجري حسب الفئة — أثاث، وإنارة، ومستلزمات منزل، ومطبخ، وحمّام — مع المنتجات المميزة وآخر الطلبات في الواجهة الأولى، ثم البحث والفرز لمن يعرف مسبقًا ما يريد. وانتقل أسلوب العلامة التحريري الفاتح كما هو.",
  },
  "nana-gelato-packaging": {
    en: "Packaging a gelato range means solving the same problem several times: each flavour has to look like itself and like the family. For nana | نعناع I built one bilingual Arabic/English label system, then let colour and fruit do the differentiating across strawberry, mango and the rest — so a shelf of them reads as one brand from a distance and as separate flavours up close.",
    ar: "تصميم عبوات لخط جيلاتو يعني حلّ المسألة نفسها عدة مرات: على كل نكهة أن تبدو نفسها وأن تبدو من العائلة في آنٍ واحد. بنيت لـ«نعناع» نظام ملصقات واحدًا ثنائي اللغة، ثم تركت اللون والفاكهة يقومان بالتمييز بين الفراولة والمانغا وبقية النكهات، حتى يُقرأ الرف من بعيد علامةً واحدة، ومن قريب نكهاتٍ منفصلة.",
  },
  "believe-in-syria-campaign": {
    en: "I was Media Director for JCI Syria's Believe in Syria campaign between 2018 and 2019, which meant owning everything the campaign put in front of people: one-pagers, formal invitations, table cards, business cards, T-shirts, and the campaign book. Leading print and digital production together kept the identity consistent across a large outreach effort.",
    ar: "كنت المديرة الإعلامية لحملة Believe in Syria التابعة لـ JCI سوريا بين 2018 و2019، وهذا يعني مسؤوليتي عن كل ما وضعته الحملة أمام الناس: المطويات التعريفية، والدعوات الرسمية، وبطاقات الطاولات، وبطاقات العمل، والقمصان، وكتاب الحملة. وقيادة الإنتاج المطبوع والرقمي معًا هي ما حافظ على اتساق الهوية في حملة تواصل واسعة.",
  },
  "bw-company-profile": {
    en: "A holding-group profile has to answer 'who are you' for a reader who will skim it in five minutes. I designed the BW Holding document page by page so the answer builds: cover, about, vision and mission, structure and geographical reach, the subsidiaries, the service lines, contact. Dark tech blue with glowing brand visuals holds it together.",
    ar: "بروفايل مجموعة قابضة عليه أن يجيب عن سؤال «من أنتم» لقارئ سيتصفّحه في خمس دقائق. صمّمت وثيقة BW القابضة صفحةً صفحة كي تُبنى الإجابة تدريجيًا: الغلاف، ثم التعريف، ثم الرؤية والرسالة، ثم الهيكل والانتشار الجغرافي، ثم الشركات التابعة، ثم خطوط الخدمات، ثم التواصل. ويجمعها كلها أزرق تقني داكن ببصريات متوهّجة.",
  },
  "solareva-brand-identity": {
    en: "SolaReva is a Dubai solar-energy company whose promise is 'Boundless Impact', and the mark had to say energy and environment at once — so it brings together a bulb, leaves and a lightning bolt. Black, red, orange and amber carry it across business cards and letterhead, then out into van livery, storefront signage and the website hero, where an identity actually gets tested.",
    ar: "سولاريفا شركة طاقة شمسية في دبي، ووعدها «أثر بلا حدود»، فكان على العلامة أن تقول الطاقة والبيئة معًا: جمعت فيها المصباح والأوراق والبرق. ويحمل الأسود والأحمر والبرتقالي والكهرماني الهوية عبر بطاقات العمل والأوراق الرسمية، ثم يخرج بها إلى تغليف السيارات ولوحة الواجهة وواجهة الموقع، وهناك تُختبر أي هوية فعلًا.",
  },
  "cadeau-boutique-brand": {
    en: "Cadeau Boutique in Riyadh sells the feeling more than the object — 'Express how you feel' — so the identity had to look like something you would be happy to receive. The GB monogram is drawn as a gift ribbon in gold, set against charcoal, mauve and cream, and applied to bilingual business cards, letterhead and QR hang tags finished in kraft, white and marble.",
    ar: "تبيع كادو بوتيك في الرياض الشعور أكثر مما تبيع الغرض، وشعارها «عبّر عمّا تشعر به»، فكان على الهوية أن تبدو شيئًا يسعدك أن تتلقّاه. رسمت حرفَي GB على هيئة شريطة هدية بالذهبي، على خلفية من الفحمي والموف والكريمي، وطبّقتها على بطاقات عمل ثنائية اللغة وأوراق رسمية وبطاقات تعليق بكود QR بتشطيبات الكرافت والأبيض والرخام.",
  },
  "travel-agency-branding": {
    en: "A travel agency lives on printed material as much as on screens, so this identity was built to survive both. The set covers the logo in use, ID cards, brochure covers front and back, a social cover, and the interior page layouts that keep the brochure consistent once someone opens it.",
    ar: "وكالة السفر تعيش على المطبوعات بقدر ما تعيش على الشاشات، لذلك بُنيت هذه الهوية لتصمد في الاثنين. تشمل المجموعة الشعار في الاستخدام، وبطاقات التعريف، وأغلفة البروشور من الأمام والخلف، وغلافًا للسوشال ميديا، وتخطيط الصفحات الداخلية الذي يحافظ على اتساق البروشور بعد فتحه.",
  },
  "motion-showreel": {
    en: "A reel is an editing problem more than an animation one — the work already exists, and the job is deciding what earns three seconds. I cut logo animations, app promos and event visuals into a single piece, built in After Effects and Premiere Pro from concept through to the final edit.",
    ar: "الشوريل مسألة مونتاج أكثر مما هو مسألة تحريك: العمل موجود أصلًا، والمهمة أن تقرّر ما الذي يستحق ثلاث ثوانٍ. جمعت فيه أنيميشن الشعارات وإعلانات التطبيقات وبصريات الفعاليات في قطعة واحدة، أنجزتها على After Effects وPremiere Pro من الفكرة حتى المونتاج النهائي.",
  },
  "zanqa-app-promo": {
    en: "Two videos for the Zanqa education platform, each with a different job. The promo introduces the app and its content categories to someone who has never heard of it; the 2.2.1 release video walks existing users through what changed — automated tests, extra publisher tools, and the rest.",
    ar: "فيديوهان لمنصة زنقة التعليمية، لكل منهما مهمة مختلفة. الأول ترويجي يعرّف بالتطبيق وفئات محتواه لمن لم يسمع به من قبل، والثاني فيديو إصدار 2.2.1 يشرح للمستخدمين الحاليين ما الذي تغيّر: اختبارات آلية، وأدوات إضافية للناشرين، وغيرها.",
  },
  "albroker-promo": {
    en: "Albroker is a maritime shipment-brokerage app, and the promo animates its real screens rather than mock-ups — vessel feeds, freight offers, the points system. Keeping it short and fast was the point: the audience is brokers who already know the domain and do not need it explained. Cut to the brand's navy identity.",
    ar: "البروكر تطبيق وساطة شحن بحري، والإعلان يحرّك شاشاته الحقيقية لا نماذج تجريبية: قوائم السفن، وعروض الشحن، ونظام النقاط. وكان القِصر والإيقاع السريع مقصودَين، فالجمهور وسطاء يعرفون المجال ولا يحتاجون شرحه. نُفّذ بهوية العلامة الكحلية.",
  },
  "piaget-presentation": {
    en: "Produced at BW Group, this is a vision-and-plan presentation for a PIAGET brand event — venue proposal, decoration and entertainment concepts, and a social-media influencer plan. Over two minutes of fully animated slides, made because a static deck would not have carried the event's tone.",
    ar: "أنتجته في BW Group: عرض رؤية وخطة لفعالية علامة PIAGET، يشمل اقتراح المكان، ومفاهيم الديكور والفقرات الترفيهية، وخطة المؤثرين على السوشال ميديا. أكثر من دقيقتين من شرائح متحركة بالكامل، صُنعت لأن عرضًا ثابتًا ما كان لينقل روح الفعالية.",
  },
};

let done = 0;
const missing = [];
for (const [slug, copy] of Object.entries(rewrites)) {
  const p = bySlug[slug];
  if (!p) {
    missing.push(slug);
    continue;
  }
  p.descEn = copy.en;
  p.descAr = copy.ar;
  done++;
}

fs.writeFileSync(FILE, JSON.stringify(projects, null, 1));
console.log(`rewritten ${done} of ${Object.keys(rewrites).length}`);
if (missing.length) console.log("slug not found:", missing.join(", "));
