/**
 * Rewrites article bodies in data/articles.json.
 *
 * The originals were built on visible scaffolding — "Layer 1 / Layer 2",
 * setup-and-reversal openers, triads, an em-dash before every summary — and
 * the Arabic followed the English heading for heading. These are rewritten
 * with her own projects as the evidence, and the Arabic is written in Arabic:
 * different structure, different examples where a local one reads better.
 *
 * Usage: node scripts/rewrite-articles.mjs
 */
import fs from "node:fs";

const FILE = "data/articles.json";
const articles = JSON.parse(fs.readFileSync(FILE, "utf8"));
const bySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));

const rewrites = {
  "ai-assisted-design-workflow-2026": {
    excerptEn:
      "A year of running AI inside paid client work taught me where it helps and where it quietly costs you. Here is what I let it touch, and what I never do.",
    excerptAr:
      "سنة كاملة من استخدام الذكاء الاصطناعي داخل مشاريع مدفوعة علّمتني أين يفيد وأين يكلّفك من حيث لا تشعر. هذا ما أسمح له بلمسه، وما لا أفعله أبدًا.",
    bodyEn: `I stopped asking whether AI will replace designers about a year ago. It is not a useful question, and it is not the one clients ask. What they ask is why the second round of revisions took as long as the first.

So here is the more practical version: which parts of my process actually got faster, and which parts got worse when I handed them over.

## Where it earned its place

Exploration. When I opened the Jadarat consulting site, I needed to see a services page in six different structures before I could tell which one matched how the company actually sells. Producing six by hand is half a day. Producing six to react to is twenty minutes, and reacting is the part I am paid for.

The same goes for the states everyone forgets. Empty states, error states, the screen a user sees when their filter returns nothing. I now ask for those first, before the happy path, because that is when a flow's holes show up.

And placeholder copy, as long as everyone knows it is placeholder. Lorem ipsum lies about length. Rough real-sounding text tells you immediately that your card is too short for an Arabic product name.

## Where it cost me

Three places, all of them expensive.

The first is anything to do with brand. I let a generated mark into a moodboard once, early on, and spent the next meeting explaining to a client why we could not use something that looked so finished. Logos, colours and voice come from the brand, not from a prompt.

The second is Arabic. Generated Arabic layouts are consistently wrong in the same ways — line height too tight, letterforms broken by the wrong font stack, and text that reads like it was written in English first. I have written elsewhere about what RTL actually requires; the short version is that you cannot check this by eye if you do not read Arabic.

The third is the thing that nearly caught me. Generated screens are internally consistent and confidently wrong. They look resolved, so you stop interrogating them. On a delivery app I was designing, I nearly shipped a checkout that quietly assumed one address per account, because the draft looked so settled that nobody questioned the assumption underneath it.

## The rule I work by now

AI produces material. It does not produce decisions.

Information hierarchy, flow logic, what happens on failure, whether a screen is honest about what it is asking — none of that comes out of a prompt, because none of it is a formatting problem. It is judgement about a specific product and a specific user, and judgement is the whole job.

The designers I see struggling with this are not the ones refusing to use the tools. They are the ones who let the tools decide, then discover in usability testing that nobody could find the button.`,
    bodyAr: `توقّفت قبل نحو سنة عن السؤال إن كان الذكاء الاصطناعي سيحلّ محل المصممين. ليس سؤالًا مفيدًا، وليس السؤال الذي يطرحه العميل أصلًا. العميل يسأل لماذا استغرقت الجولة الثانية من التعديلات وقت الأولى نفسه.

والصيغة العملية للسؤال: أي أجزاء من عملي صارت أسرع فعلًا، وأيها ساءت حين سلّمتها للأداة.

## أين استحقّ مكانه

الاستكشاف. حين بدأت موقع جدارات للاستشارات، احتجت أن أرى صفحة الخدمات بستّ بِنى مختلفة قبل أن أعرف أيها يشبه طريقة الشركة في البيع فعلًا. إنتاج ستّ بنى يدويًا نصف يوم عمل. إنتاج ستّ لأتفاعل معها عشرون دقيقة، والتفاعل هو ما أتقاضى أجري عليه.

وكذلك الحالات التي ينساها الجميع: الشاشة الفارغة، وشاشة الخطأ، والشاشة التي يراها المستخدم حين لا يعيد فلتره أي نتيجة. صرت أطلبها أولًا قبل المسار المثالي، لأن ثغرات التدفّق تظهر عندها تحديدًا.

والنصوص المؤقتة كذلك، ما دام الجميع يعرف أنها مؤقتة. نصّ «لوريم إيبسوم» يكذب عليك في الطول. أما نصّ خام يشبه الحقيقي فيخبرك فورًا أن بطاقتك أضيق من أن تحمل اسم منتج عربي.

## وأين كلّفني

ثلاثة مواضع، وكلها باهظة.

الأول كل ما يخصّ الهوية. أدخلت مرة، في البداية، شعارًا مولّدًا إلى لوحة إلهام، وقضيت الاجتماع التالي أشرح للعميل لماذا لا يمكننا استخدام شيء يبدو مكتملًا إلى هذا الحد. الشعار واللون والصوت تأتي من العلامة، لا من أمر نصّي.

والثاني العربية. التخطيطات العربية المولّدة تخطئ الأخطاء نفسها دائمًا: تباعد أسطر خانق، وحروف تتكسّر لأن الخط المختار لا يدعمها، ونصّ يُقرأ وكأنه كُتب بالإنجليزية أولًا. وقد كتبت في مكان آخر عمّا يتطلبه RTL فعلًا، والخلاصة أنك لا تستطيع الحكم على هذا بعينك إن كنت لا تقرأ العربية.

والثالث هو ما كاد يوقعني. الشاشات المولّدة متّسقة داخليًا وخاطئة بثقة. تبدو محسومة، فتتوقف عن مساءلتها. في تطبيق توصيل كنت أصمّمه، كدت أُسلّم مسار دفع يفترض ضمنًا عنوانًا واحدًا لكل حساب، لأن المسودة بدت مستقرة إلى حدّ أن أحدًا لم يسأل عن الافتراض تحتها.

## القاعدة التي أعمل بها الآن

الذكاء الاصطناعي ينتج مادة. ولا ينتج قرارات.

التسلسل البصري، ومنطق التدفّق، وما يحدث عند الفشل، وهل الشاشة صادقة فيما تطلبه — لا شيء من هذا يخرج من أمر نصّي، لأن لا شيء منه مسألة تنسيق. كلها أحكام تخصّ منتجًا بعينه ومستخدمًا بعينه، والحكم هو المهنة كلها.

والمصممون الذين أراهم يتعثّرون هنا ليسوا من يرفضون الأدوات، بل من تركوا الأداة تقرّر، ثم اكتشفوا في اختبار الاستخدام أن أحدًا لم يجد الزر.`,
  },

  "arabic-rtl-ux-design-guide": {
    excerptEn:
      "Mirroring an English layout is not Arabic design. After seven years building Arabic-first products, these are the decisions that actually decide whether it works.",
    excerptAr:
      "عكس التخطيط الإنجليزي ليس تصميمًا عربيًا. بعد سبع سنوات في بناء منتجات عربية أولًا، هذه هي القرارات التي تحسم فعلًا نجاح الواجهة.",
    bodyEn: `Most Arabic interfaces I am asked to fix were designed in English and flipped. The flip is the easy part. What breaks is everything the flip does not touch.

## The font decision comes first, not last

Choosing an Arabic typeface is not a styling step you do at the end. It determines your line height, your minimum tap target, how much text fits in a card, and whether your headings hold together at all.

Arabic letterforms connect, and they sit taller and lower than Latin ones. A line height that looks generous in English will feel cramped the moment you switch. I default to 1.8 for Arabic body text and I have never regretted it.

Then there is the trap: letter-spacing. Tracking that tightens a Latin heading nicely will break the joins between Arabic letters. \`tracking-tight\` has no business in an Arabic layout. I reset it explicitly rather than trusting myself to remember.

## What mirrors and what does not

Layout mirrors. Navigation, sidebars, progress, the direction a card slides in — all of it.

Numbers do not. Phone numbers, prices, dates, version numbers, code — these stay left-to-right inside a right-to-left sentence, and if you let the browser guess it will sometimes guess wrong. I mark them explicitly. On the Crenny roadside app, prices in Iraqi dinars sat inside Arabic sentences on nearly every screen, and every one of them needed that treatment.

Icons mostly do not mirror either. An arrow does. A clock does not. A shopping cart does not. The test is whether the icon depicts direction or depicts an object.

## Build it in Arabic, then port it

This is the one that changes outcomes.

If you design in English and translate, the layout is sized for English. Arabic runs longer for the same meaning — often twenty to thirty per cent — and you find out at the worst moment, when the client is reading the deck and a button label has wrapped to two lines.

On the Turki meat store I laid out all twenty-eight screens in Arabic first and derived the English afterwards. Nothing wrapped unexpectedly, because the tightest case was the one I designed against.

## Use logical properties

\`margin-left\` is a bug waiting for a language change. \`margin-inline-start\` is the same instruction that survives it.

Modern CSS gives you the whole set — inline-start, inline-end, padding-inline, border-inline — and once you switch, a single \`dir="rtl"\` on the html element flips your entire layout correctly with no duplicated stylesheet. I have not written a directional margin in two years.

## The part no tooling catches

Arabic is not one register. The tone that suits a Gulf e-commerce brand is not the tone for a Syrian education platform, and neither is the tone for a logistics company at Lattakia Port. Translation software will give you a grammatically correct sentence in the wrong voice every time.

That judgement has to come from someone who reads the language. It is the same reason I do not accept generated Arabic copy without rewriting it.`,
    bodyAr: `معظم الواجهات العربية التي يُطلب مني إصلاحها صُمّمت بالإنجليزية ثم عُكست. العكس هو الجزء السهل، والذي ينكسر هو كل ما لا يطاله العكس.

## قرار الخط أولًا لا أخيرًا

اختيار خط عربي ليس خطوة تجميل في النهاية. هو ما يحدّد ارتفاع السطر، وأصغر مساحة لمس، وكم نصًّا تتّسع له البطاقة، وهل تتماسك عناوينك أصلًا.

الحرف العربي متّصل، ويمتدّ أعلى وأسفل من اللاتيني. وارتفاع سطر يبدو مريحًا بالإنجليزية سيبدو خانقًا لحظة التبديل. أعتمد 1.8 لنصّ المتن العربي ولم أندم على ذلك.

ثم يأتي الفخّ: تباعد الأحرف. التضييق الذي يحسّن عنوانًا لاتينيًا يكسر وصلات الحروف العربية. لا مكان لـ\`tracking-tight\` في تخطيط عربي، وأنا أُعيد ضبطه صراحةً بدل أن أعتمد على ذاكرتي.

## ما ينعكس وما لا ينعكس

التخطيط ينعكس: القوائم، والأشرطة الجانبية، وأشرطة التقدّم، والاتجاه الذي تدخل منه البطاقة.

الأرقام لا تنعكس. أرقام الهواتف والأسعار والتواريخ وأرقام الإصدارات والشيفرة تبقى من اليسار إلى اليمين داخل جملة عربية، وإن تركت المتصفح يخمّن فسيخطئ أحيانًا. أنا أحدّدها صراحةً. في تطبيق كريني للمساعدة على الطريق كانت الأسعار بالدينار العراقي داخل جمل عربية في كل شاشة تقريبًا، وكلها احتاجت هذه المعالجة.

والأيقونات في معظمها لا تنعكس. السهم ينعكس. الساعة لا. عربة التسوّق لا. والمعيار: هل تصوّر الأيقونة اتجاهًا أم تصوّر شيئًا.

## ابنِ بالعربية ثم اشتقّ الإنجليزية

هذه هي النقطة التي تغيّر النتيجة فعلًا.

إن صمّمت بالإنجليزية ثم ترجمت، فالتخطيط مقاس على الإنجليزية. والعربية أطول للمعنى نفسه، بنسبة عشرين إلى ثلاثين بالمئة غالبًا، وتكتشف ذلك في أسوأ لحظة: حين يقرأ العميل العرض ويكون نصّ الزر قد نزل إلى سطرين.

في متجر تركي للحوم رسمت الشاشات الثماني والعشرين بالعربية أولًا واشتققت الإنجليزية بعدها. لم ينكسر شيء، لأن الحالة الأضيق هي التي صمّمت عليها.

## استخدم الخصائص المنطقية

\`margin-left\` عطل ينتظر تغيير اللغة. أما \`margin-inline-start\` فالتعليمة نفسها لكنها تنجو منه.

توفّر لك CSS الحديثة المجموعة كاملة، وحين تنتقل إليها يكفي \`dir="rtl"\` واحد على عنصر html ليُقلب تخطيطك كله بشكل صحيح بلا ملف أنماط مكرّر. لم أكتب هامشًا اتجاهيًا منذ سنتين.

## وما لا تلتقطه أي أداة

العربية ليست مستوى لغويًا واحدًا. النبرة التي تناسب متجرًا خليجيًا ليست نبرة منصة تعليمية سورية، ولا نبرة شركة شحن في مرفأ اللاذقية. وبرامج الترجمة ستعطيك جملة سليمة نحويًا بالنبرة الخاطئة في كل مرة.

هذا الحكم لا يصدر إلا عمّن يقرأ اللغة. وللسبب نفسه لا أقبل نصًّا عربيًا مولَّدًا من دون إعادة كتابته.`,
  },

  "design-engineering-handoff-is-dead": {
    excerptEn:
      "The handoff meeting was always a symptom. When the person who designs the screen also builds it, a whole category of argument disappears.",
    excerptAr:
      "اجتماع التسليم كان دائمًا عَرَضًا لا مرضًا. حين يبني الشاشةَ من صمّمها، يختفي صنف كامل من الجدال.",
    bodyEn: `I have been on both sides of the handoff. I have prepared the file with every state annotated, and I have received one and discovered on day two that the spacing scale was decorative.

The thing nobody says out loud is that the handoff is where intent goes to die. Not through anyone's fault. It dies because a static file cannot express a decision, only its result.

## What actually gets lost

A spec says the card has 24px of padding. It does not say that 24 was chosen because at 16 the Arabic product names collided with the price, and the number is therefore not negotiable.

So a developer with a good reason of their own changes it to 16, the designer sees it in staging, and the two of them have a conversation that is really about a decision neither wrote down.

Multiply that by every value in a system.

## Closing the gap

I started writing front-end properly during Zanqa, where I was the designer and one of the developers at the same time. What I noticed was not that I worked faster. It was that a whole category of argument stopped happening.

When I own the component, the reason lives in the component. If a token cannot go below a certain value, that is expressed in the token, not in a comment on a Figma frame that nobody opens after week one.

## You do not have to become an engineer

This is where designers get scared off, so let me be exact about the bar.

You need enough React to read a component and see where your design lives. Enough CSS to know why your layout broke — and modern CSS makes this much easier than it was, because grid and logical properties map closely to how designers already think. Enough TypeScript to understand why a prop is required. Enough git to open a branch without fear.

That is a few months of deliberate practice, not a career change. And it changes what you can promise a client, because you stop saying "the developer will implement it" and start saying "this is what it does."

## What it does not fix

Design engineering does not remove the need for research, and it does not make you right. I have shipped things I built myself that users could not use.

What it removes is the translation layer — the gap where a good decision becomes an approximate one because it had to survive being written down, read by someone else, and rebuilt from scratch.

That gap was always the expensive part.`,
    bodyAr: `عملت على طرفَي التسليم. أعددت ملفًا موثّقة فيه كل حالة، واستلمت ملفًا واكتشفت في اليوم الثاني أن سلّم المسافات فيه كان زينة لا نظامًا.

وما لا يقوله أحد بصوت عالٍ أن التسليم هو المكان الذي يموت فيه القصد. لا بخطأ أحد، بل لأن ملفًا ثابتًا لا يستطيع التعبير عن قرار، بل عن نتيجته فقط.

## ما الذي يضيع بالضبط

يقول المستند إن حشوة البطاقة 24 بكسل. ولا يقول إن الرقم اختير لأن أسماء المنتجات العربية كانت تصطدم بالسعر عند 16، وإنه لذلك غير قابل للتفاوض.

فيغيّره مطوّر لديه سببه الوجيه إلى 16، ويراه المصمم على بيئة الاختبار، ويدور بينهما نقاش هو في حقيقته عن قرار لم يدوّنه أحد.

ثم اضرب ذلك بعدد القيم في النظام كله.

## سدّ الفجوة

بدأت أكتب واجهات أمامية بجدّية في زنقة، حيث كنت المصمّمة وأحد المطوّرين في آن. وما لاحظته لم يكن أنني أنجزت أسرع، بل أن صنفًا كاملًا من الجدال توقّف عن الحدوث.

حين أملك المكوّن، يسكن السبب داخل المكوّن. وإن كان لا يجوز لقيمة أن تنزل تحت حدّ معيّن، فهذا يُعبَّر عنه في التوكن نفسه، لا في تعليق على إطار في فيغما لا يفتحه أحد بعد الأسبوع الأول.

## ولستِ مضطرة لتصبحي مهندسة

هنا يتراجع كثير من المصممين، فدعوني أحدّد السقف بدقة.

تحتاجين من React ما يكفي لقراءة مكوّن ومعرفة أين يسكن تصميمك فيه. ومن CSS ما يكفي لتعرفي لماذا انكسر تخطيطك — وCSS الحديثة سهّلت هذا كثيرًا، لأن الشبكة والخصائص المنطقية قريبة أصلًا من طريقة تفكير المصمّم. ومن TypeScript ما يكفي لفهم سبب كون خاصية إلزامية. ومن git ما يكفي لفتح فرع بلا خوف.

هذه أشهر قليلة من التمرين المقصود، لا تغيير مسار مهني. وهي تغيّر ما يمكنك وعد العميل به، لأنك تكفّين عن قول «المطوّر سينفّذها» وتبدئين بقول «هذا ما تفعله».

## وما لا تحلّه

هندسة التصميم لا تلغي الحاجة إلى البحث، ولا تجعلك على صواب. أنا نفسي أطلقت أشياء بنيتها بيدي وعجز المستخدمون عن استخدامها.

ما تلغيه هو طبقة الترجمة: تلك الفجوة التي يتحوّل فيها قرار جيّد إلى قرار تقريبي، لأنه اضطُرّ أن ينجو من التدوين، ثم من قراءة شخص آخر له، ثم من إعادة بنائه من الصفر.

تلك الفجوة كانت دائمًا الجزء الباهظ.`,
  },

  "brand-board-process-brief-to-delivery": {
    excerptEn:
      "Most identity projects go wrong in the first meeting, not the design phase. This is the process I use to make sure the brief is real before I draw anything.",
    excerptAr:
      "معظم مشاريع الهوية تنحرف في الاجتماع الأول لا في مرحلة التصميم. هذه المنهجية التي أستخدمها للتأكد من أن البريف حقيقي قبل أن أرسم شيئًا.",
    bodyEn: `A client once told me they wanted something "modern and trustworthy". I asked which of their competitors looked trustworthy to them. They named one I would have called dated, and one I would have called cold — and that single answer reshaped the whole project.

That is why my process front-loads the conversation. The design part is fast when the brief is real.

## The brief is a set of constraints, not adjectives

Adjectives are where projects go to be misunderstood. "Modern" means eight different things to eight people. So I convert them.

Who buys from you, and what are they nervous about? Which competitor do you not want to resemble? Where will this actually appear — is it a shopfront, a delivery van, a phone screen, a printed invoice? Does it have to work in Arabic and English, and which one leads?

That last question changes everything, and it is the one most briefs skip. An identity built Latin-first and then given an Arabic version is usually two identities pretending to be one.

## Directions, not options

I present three directions, and I say plainly which one I would choose and why.

Presenting three neutral options is a way of avoiding responsibility. The client hired judgement; withholding it to seem accommodating just moves the decision to the person with the least information.

Each direction gets a mark, a palette, a type pairing, and one real application — not a grid of mockups. One thing, rendered properly.

## Then the board, then the proof

Once a direction is chosen, the brand board fixes the decisions: logo construction and clear space, the full palette with the roles each colour plays, the type scale, and what is not allowed. That last section saves more brand consistency than the rest combined.

Then I apply it somewhere real. For SolaReva, the Dubai solar company, that meant the van livery, the storefront signage and the website hero — because a mark that only exists on a white artboard has not been tested. You learn things about a logo the first time it has to survive being wrapped around a vehicle.

For Cadeau Boutique it meant the physical pieces: bilingual cards, letterhead, and QR hang tags in kraft, white and marble. A gift brand is judged by touch.

## Deliver the reasoning with the files

I hand over the board and a short document explaining the decisions — why this colour carries the primary role, why the mark has that clear space, what breaks if you ignore it.

Clients change agencies. Marketing managers leave. The identity survives if the reasoning is written down; if it is not, the brand drifts within a year and nobody can say exactly when it started.`,
    bodyAr: `قال لي عميل مرة إنه يريد شيئًا «عصريًا وموثوقًا». سألته أيّ منافسيه يبدو له موثوقًا. فسمّى واحدًا كنت سأصفه بالقديم، وآخر كنت سأصفه بالبارد — وهذه الإجابة وحدها أعادت تشكيل المشروع كله.

لهذا تضع منهجيتي ثقلها في المحادثة الأولى. مرحلة التصميم سريعة حين يكون البريف حقيقيًا.

## البريف قيود لا صفات

الصفات هي المكان الذي يُساء فيه فهم المشاريع. «عصري» تعني ثمانية أشياء مختلفة لثمانية أشخاص. لذلك أحوّلها.

من يشتري منك، وما الذي يقلقه؟ وأي منافس لا تريد أن تشبهه؟ وأين ستظهر الهوية فعلًا: على واجهة محل، أم سيارة توصيل، أم شاشة هاتف، أم فاتورة مطبوعة؟ وهل يجب أن تعمل بالعربية والإنجليزية، وأيّهما الأساس؟

السؤال الأخير يغيّر كل شيء، وهو الذي تتجاوزه معظم البريفات. الهوية المبنية باللاتينية أولًا ثم تُعطى نسخة عربية هي غالبًا هويتان تتظاهران بأنهما واحدة.

## اتجاهات لا خيارات

أقدّم ثلاثة اتجاهات، وأقول صراحةً أيها كنت سأختار ولماذا.

تقديم ثلاثة خيارات محايدة تهرّب من المسؤولية. العميل استأجر حكمًا مهنيًا، وحجبه تلطّفًا ينقل القرار إلى صاحب أقل المعلومات.

ولكل اتجاه علامة، ولوحة ألوان، وثنائي خطوط، وتطبيق واحد حقيقي — لا شبكة من الموكاباتش. شيء واحد، منفَّذ كما يجب.

## ثم اللوحة، ثم الإثبات

بعد اختيار الاتجاه، تثبّت لوحة الهوية القرارات: بناء الشعار ومساحته الآمنة، واللوحة اللونية كاملة مع دور كل لون، وسلّم الخطوط، وما هو ممنوع. القسم الأخير يحمي اتساق الهوية أكثر من بقية الأقسام مجتمعة.

ثم أطبّقها في مكان حقيقي. مع سولاريفا، شركة الطاقة الشمسية في دبي، كان ذلك على تغليف السيارات ولوحة الواجهة وواجهة الموقع، لأن علامة لا تعيش إلا على خلفية بيضاء لم تُختبر بعد. وتتعلّم عن الشعار أشياء لا تعرفها إلا أول مرة يُلَفّ فيها حول سيارة.

ومع كادو بوتيك كان الإثبات في القطع الملموسة: بطاقات ثنائية اللغة، وأوراق رسمية، وبطاقات تعليق بكود QR بتشطيبات الكرافت والأبيض والرخام. فعلامة الهدايا يحكم عليها باللمس.

## سلّم المنطق مع الملفات

أسلّم اللوحة ومعها مستندًا قصيرًا يشرح القرارات: لماذا يحمل هذا اللون الدور الأساسي، ولماذا للشعار هذه المساحة الآمنة، وما الذي ينكسر إن تجاهلتها.

العملاء يغيّرون الوكالات. ومديرو التسويق يرحلون. والهوية تنجو إن كان منطقها مكتوبًا؛ وإن لم يكن، انحرفت العلامة خلال سنة ولم يعد أحد يعرف متى بدأ الانحراف.`,
  },
};

let done = 0;
const missing = [];
for (const [slug, copy] of Object.entries(rewrites)) {
  const a = bySlug[slug];
  if (!a) {
    missing.push(slug);
    continue;
  }
  a.excerptEn = copy.excerptEn;
  a.excerptAr = copy.excerptAr;
  a.bodyEn = copy.bodyEn;
  a.bodyAr = copy.bodyAr;
  done++;
}

fs.writeFileSync(FILE, JSON.stringify(articles, null, 1));
console.log(`rewritten ${done} of ${Object.keys(rewrites).length} articles`);
if (missing.length) console.log("slug not found:", missing.join(", "));
