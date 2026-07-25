/**
 * Rewrites article bodies in data/articles.json.
 *
 * Run once per batch: edit the rewrites map, run, then move to the next set.
 * Inline code inside the template literals must escape its backticks.
 *
 * Usage: node scripts/rewrite-articles.mjs
 */
import fs from "node:fs";

const FILE = "data/articles.json";
const articles = JSON.parse(fs.readFileSync(FILE, "utf8"));
const bySlug = Object.fromEntries(articles.map((a) => [a.slug, a]));

const rewrites = {
  "brand-identity-ai-era": {
    excerptEn:
      "Anyone can generate a logo now. That did not devalue identity work — it moved the value to the part that was always harder to copy.",
    excerptAr:
      "صار بإمكان أي شخص توليد شعار. وهذا لم يُفقد عمل الهوية قيمته، بل نقل القيمة إلى الجزء الذي كان دائمًا أصعب في التقليد.",
    bodyEn: `A client came to me last year with forty generated logo options and asked which one was best. None of them were, and explaining why took the whole meeting.

They were all competent. Balanced, clean, technically fine. And every one of them could have belonged to any company in any sector, because none of them had been asked to mean anything.

## What a mark is for

A logo is not a picture of your company. It is a compression of an argument about what your company is.

SolaReva is a Dubai solar-energy company whose promise is boundless impact. The mark brings together a bulb, leaves and a lightning bolt — energy, environment, and the moment they meet. That combination is not aesthetically superior to forty generated alternatives. It is right because it argues for something, and you can defend it in a room.

Generated marks cannot be defended, because there is no reasoning underneath. There is only output.

## Where identity actually lives now

Not in the logo file. In the system around it.

The palette and what each colour is allowed to do. The type pairing and how it behaves in two languages. The photography direction. The tone of voice. What is forbidden — the section clients skip and that saves more consistency than everything else combined.

That system is what keeps a brand recognisable when a marketing manager leaves and a new agency arrives. A logo alone survives about a year of that.

## Test it where it will actually live

A mark on a white artboard has not been tested.

I apply every identity to something physical or environmental before signing it off. For SolaReva, van livery, storefront signage, and the website hero. For Cadeau Boutique in Riyadh, bilingual business cards, letterhead, and hang tags in kraft, white and marble — three substrates that each took the gold differently, and only one of them behaved the way the screen predicted.

You learn things about a logo the first time it has to survive being wrapped around a vehicle that you will never learn from a presentation deck.

## Where I do use the tools

Exploration, early, privately. Moodboards, colour studies, sense-checking a direction I am unsure about.

What I do not do is let generated work into a client meeting, because a finished-looking artefact ends the conversation about meaning before it starts. And I never let a generated mark near a brand — the logo is the one thing that has to be genuinely, defensibly yours.`,
    bodyAr: `جاءني عميل العام الماضي بأربعين خيار شعار مولَّدًا وسألني أيها أفضل. لم يكن أيٌّ منها أفضل، وشرح السبب استغرق الاجتماع كله.

كانت كلها متقنة: متوازنة، ونظيفة، وسليمة تقنيًا. وكل واحد منها كان يصلح لأي شركة في أي قطاع، لأن أحدًا لم يطلب من أيٍّ منها أن يعني شيئًا.

## ما الغرض من العلامة

الشعار ليس صورة لشركتك، بل ضغطٌ لحجّة عمّا تكونه شركتك.

سولاريفا شركة طاقة شمسية في دبي، ووعدها أثر بلا حدود. تجمع علامتها المصباح والأوراق والبرق: الطاقة، والبيئة، ولحظة التقائهما. وهذا التركيب ليس متفوّقًا جماليًا على أربعين بديلًا مولَّدًا، لكنه صحيح لأنه يحاجّ عن شيء، ولأنك تستطيع الدفاع عنه في غرفة اجتماع.

أما العلامات المولَّدة فلا يمكن الدفاع عنها، لأن لا منطق تحتها. هناك مُخرَج فقط.

## وأين تسكن الهوية اليوم

ليس في ملف الشعار، بل في النظام المحيط به.

اللوحة اللونية وما يُسمح لكل لون بفعله. وثنائي الخطوط وكيف يتصرّف بلغتين. واتجاه التصوير. ونبرة الصوت. وما هو ممنوع — وهو القسم الذي يتجاوزه العملاء، ويحمي من الاتساق أكثر مما تحميه بقية الأقسام مجتمعة.

هذا النظام هو ما يُبقي العلامة معروفة حين يرحل مدير التسويق وتصل وكالة جديدة. أما الشعار وحده فينجو من ذلك سنة تقريبًا.

## واختبرها حيث ستعيش فعلًا

العلامة على خلفية بيضاء لم تُختبر بعد.

أطبّق كل هوية على شيء ملموس أو بيئي قبل اعتمادها. مع سولاريفا كان ذلك تغليف السيارات ولوحة الواجهة وواجهة الموقع. ومع كادو بوتيك في الرياض بطاقات ثنائية اللغة وأوراقًا رسمية وبطاقات تعليق بالكرافت والأبيض والرخام: ثلاث خامات أخذت الذهبي كلٌّ بطريقتها، وواحدة فقط تصرّفت كما توقّعت الشاشة.

وتتعلّم عن الشعار في أول مرة يُلَفّ فيها حول سيارة ما لن تتعلّمه من أي عرض تقديمي.

## وأين أستخدم الأدوات فعلًا

في الاستكشاف، مبكرًا، وبيني وبين نفسي: لوحات الإلهام، ودراسات اللون، واختبار اتجاه لست واثقة منه.

وما لا أفعله هو إدخال عمل مولَّد إلى اجتماع مع عميل، لأن قطعة تبدو مكتملة تُنهي النقاش حول المعنى قبل أن يبدأ. ولا أدع علامة مولَّدة تقترب من هوية أبدًا — فالشعار هو الشيء الوحيد الذي يجب أن يكون لك حقًّا، وبما يمكن الدفاع عنه.`,
  },

  "ui-designer-to-product-designer": {
    excerptEn:
      "The shift is not learning more tools. It is being able to answer what happens to the business if this screen works, and noticing when the answer is nothing.",
    excerptAr:
      "التحوّل ليس تعلّم أدوات أكثر، بل القدرة على الإجابة عمّا يحدث للعمل إن نجحت هذه الشاشة، وملاحظة الحالات التي تكون فيها الإجابة: لا شيء.",
    bodyEn: `For my first few years I judged my work by whether it looked right. That is a real skill and it is not the job.

The change came on Zanqa, where I was a partner rather than a hired designer. When you are in the room for the strategy conversation, you stop being handed screens to make and start being handed problems to solve — and you discover that some of the screens you were about to design should not exist.

## Start from the outcome

A UI brief says: design a checkout. A product brief asks: why do people abandon at this step, and what would we have to change for them not to?

Sometimes the answer is a screen. Often it is a policy — a delivery fee shown too late, a required field nobody has, a payment method the market actually uses that you do not support. On a delivery app, no amount of visual polish fixes an address form that assumes one address per account.

The designer who can name that is doing product work. The one who redesigns the button is doing decoration on top of a broken decision.

## Learn to read the numbers

You do not need to be an analyst. You need to know what your product's success actually is and where you would see it move.

Zanqa reached 94,000 users, 50,000 downloads and 3,000 publishers, and those numbers were not vanity — they told us which parts of the product were working and which were being abandoned. Designing without ever seeing that is designing with your eyes closed, no matter how good the screens look.

Ask for access. Most teams will give it to you and are quietly relieved that a designer asked.

## Say no with a reason

The most useful sentence I learned is a version of: we can build that, and here is what it will cost us elsewhere.

Not refusal. Trade-off. Every feature costs complexity, and a product designer's real contribution is often the thing that did not get built, because the version that shipped stayed comprehensible.

## Constraints are the job

Budget, timeline, the team you have, the market you are in, the language the product is read in — these are not obstacles to good design. They are the shape of the problem.

I have worked with clients in Syria, Saudi Arabia, Iraq, Dubai, Germany and France, and the same feature is a different design in each of them. Payment habits differ. Trust signals differ. Whether the interface reads right-to-left changes the layout before you draw a single box.

Designing without those constraints is not freedom. It is designing for nobody.`,
    bodyAr: `في سنواتي الأولى كنت أحكم على عملي بمقياس واحد: هل يبدو صحيحًا. وتلك مهارة حقيقية، لكنها ليست المهنة.

جاء التحوّل في زنقة، حيث كنت شريكة لا مصمّمة مستأجَرة. حين تكون داخل غرفة النقاش الاستراتيجي، تكفّ عن تسلّم شاشات لترسمها وتبدأ بتسلّم مشكلات لتحلّها — وتكتشف أن بعض الشاشات التي كنت ستصمّمها لا ينبغي أن توجد أصلًا.

## ابدأ من النتيجة

بريف الواجهة يقول: صمّم مسار دفع. أما بريف المنتج فيسأل: لماذا يتخلّى الناس عند هذه الخطوة، وما الذي يجب تغييره كي لا يفعلوا؟

الإجابة أحيانًا شاشة. وغالبًا سياسة: رسوم توصيل تظهر متأخرة، أو حقل إلزامي لا يملكه أحد، أو وسيلة دفع يستخدمها السوق فعلًا ولا تدعمها أنت. في تطبيق توصيل، لا يصلح أي تلميع بصري نموذج عنوان يفترض عنوانًا واحدًا لكل حساب.

والمصمّم القادر على تسمية ذلك يمارس عمل المنتج. أما من يعيد تصميم الزر فيزخرف فوق قرار معطوب.

## وتعلّم قراءة الأرقام

لست مضطرًا لتصبح محلّلًا، لكنك مضطر لمعرفة ما هو نجاح منتجك فعلًا، وأين سترى أثره يتحرّك.

وصلت زنقة إلى 94,000 مستخدم و50,000 تحميل و3,000 ناشر، ولم تكن هذه أرقام تباهٍ: كانت تخبرنا أي أجزاء المنتج تعمل وأيها يُهجَر. والتصميم من دون رؤية ذلك تصميمٌ بعينين مغمضتين، مهما بدت الشاشات جميلة.

اطلب الوصول إلى الأرقام. معظم الفرق ستعطيك إياه، وترتاح سرًّا لأن مصمّمًا سأل.

## وقُل «لا» ومعها سبب

أنفع جملة تعلّمتها صيغة من: نستطيع بناء ذلك، وهذا ما سيكلّفنا في مكان آخر.

ليست رفضًا، بل مفاضلة. فكل ميزة تكلّف تعقيدًا، وإسهام مصمّم المنتج الحقيقي هو غالبًا الشيء الذي لم يُبنَ، لأن النسخة التي أُطلقت بقيت مفهومة.

## والقيود هي المهنة

الميزانية، والوقت، والفريق المتاح، والسوق، واللغة التي يُقرأ بها المنتج — ليست عوائق أمام التصميم الجيد، بل هي شكل المشكلة نفسها.

عملت مع عملاء في سوريا والسعودية والعراق ودبي وألمانيا وفرنسا، والميزة نفسها تصميمٌ مختلف في كل منها. عادات الدفع تختلف. وإشارات الثقة تختلف. وكون الواجهة تُقرأ من اليمين إلى اليسار يغيّر التخطيط قبل أن ترسم أول مستطيل.

والتصميم بلا هذه القيود ليس حرية، بل تصميم لا أحد.`,
  },

  "ux-research-on-a-budget": {
    excerptEn:
      "You do not need a lab or a research budget. Five people and a prepared question will tell you more than another week of internal debate.",
    excerptAr:
      "لست بحاجة إلى مختبر ولا ميزانية بحث. خمسة أشخاص وسؤال محضّر جيدًا سيخبرونك أكثر من أسبوع آخر من الجدال الداخلي.",
    bodyEn: `Most of the clients I work with have no research budget, and several have never watched anyone use their product. That is not a reason to design on assumption. It is a reason to make research small enough to actually happen.

## Five people, one task

You do not need statistical significance to learn that nobody can find the button. The serious usability problems show up in the first few sessions, and the fifth person rarely tells you something the first four did not.

So: five people, one realistic task, twenty minutes each. Not "what do you think of this?" — that invites politeness. A task: order a kilo of lamb and have it delivered to your home. Then stop talking and watch where they hesitate.

The hesitation is the finding. What they say afterwards is a rationalisation of it.

## Ask about the last time, not the next time

"Would you use this?" produces useless answers. People are kind, and they are bad at predicting themselves.

"Tell me about the last time you ordered food delivery — what did you use, what annoyed you?" produces a real answer, because it is a memory rather than a forecast. Five of those conversations will tell you more about a market than a survey with two hundred responses.

## Use what the product already knows

If anything is analytics-instrumented, you already have research nobody has read.

On this site, page and content views are aggregated daily, and the pattern is more honest than my instincts about which projects matter. Where people leave, what they never open, which article gets read to the end — that is free evidence sitting in a table.

## Test the thing you are unsure about

Not the whole product. The one decision you and the client disagree about.

Two versions of a card, one question: which of these tells you the price. That takes ten minutes with a colleague and settles an argument that could otherwise absorb a week.

## Test in the language people will use

This one gets skipped constantly, and it invalidates everything.

An Arabic interface tested with English content is not tested. Arabic text runs longer, the layout is mirrored, and the reading path is different — so the participant is navigating a product that does not exist. If the product ships in Arabic, the test runs in Arabic, with real Arabic content and a participant who reads it natively.

## Write down what you will do about it

A finding nobody acts on is entertainment. One page: what you saw, how many people it happened to, what you changed. That is the whole report, and clients read it because it is short enough to.`,
    bodyAr: `معظم العملاء الذين أعمل معهم بلا ميزانية بحث، وكثير منهم لم يشاهد أحدًا يستخدم منتجه قطّ. وهذا ليس سببًا للتصميم على الافتراض، بل سبب لجعل البحث صغيرًا بما يكفي ليحدث فعلًا.

## خمسة أشخاص، ومهمة واحدة

لا تحتاج دلالة إحصائية لتعرف أن أحدًا لا يجد الزر. المشكلات الجدّية في سهولة الاستخدام تظهر في الجلسات الأولى، ونادرًا ما يخبرك الخامس بشيء لم يخبرك به الأربعة قبله.

إذن: خمسة أشخاص، ومهمة واقعية واحدة، وعشرون دقيقة لكل منهم. لا تسأل «ما رأيك بهذا؟» فذلك يستدعي المجاملة. بل كلّفه بمهمة: اطلب كيلو لحم غنم ليصلك إلى المنزل. ثم اصمت وراقب أين يتردّد.

التردّد هو النتيجة. أما ما يقوله بعدها فتبرير له.

## واسأل عن المرة الماضية لا عن المرة القادمة

سؤال «هل ستستخدم هذا؟» يعطي إجابات بلا قيمة. الناس لطفاء، وهم سيّئون في التنبؤ بأنفسهم.

أما «حدّثني عن آخر مرة طلبت فيها طعامًا: ما التطبيق الذي استخدمته، وما الذي أزعجك؟» فيعطي إجابة حقيقية، لأنها ذاكرة لا توقّع. وخمس محادثات كهذه تخبرك عن السوق أكثر من استبيان بمئتَي إجابة.

## واستخدم ما يعرفه المنتج أصلًا

إن كان أي جزء موصولًا بتحليلات، فعندك بحث لم يقرأه أحد.

في هذا الموقع تُجمَّع مشاهدات الصفحات والمحتوى يوميًا، والنمط الظاهر أصدق من حدسي حول أي المشاريع تهمّ. أين يغادر الناس، وما الذي لا يفتحونه أبدًا، وأي مقال يُقرأ حتى نهايته — كلها أدلة مجانية جالسة في جدول.

## واختبر ما أنت غير متأكد منه

لا المنتج كله، بل القرار الوحيد الذي تختلف فيه مع العميل.

نسختان من بطاقة، وسؤال واحد: أي منهما يخبرك بالسعر. عشر دقائق مع زميل تحسم جدالًا كان سيلتهم أسبوعًا.

## واختبر باللغة التي سيستخدمها الناس

تُتجاوَز هذه القاعدة باستمرار، وتجاوزها يُبطل كل شيء.

الواجهة العربية المختبَرة بمحتوى إنجليزي غير مختبَرة. النص العربي أطول، والتخطيط معكوس، ومسار القراءة مختلف — فالمشارك يتنقّل في منتج غير موجود. وإن كان المنتج سيصدر بالعربية، فليجرِ الاختبار بالعربية، بمحتوى عربي حقيقي، ومع مشارك يقرأها بطلاقة.

## واكتب ما ستفعله بالنتيجة

النتيجة التي لا يتصرّف أحد بناءً عليها تسلية. صفحة واحدة: ما الذي رأيته، وكم شخصًا حدث معه، وما الذي غيّرته. هذا هو التقرير كله، والعملاء يقرؤونه لأنه قصير بما يكفي.`,
  },

  "designing-ai-native-product-experiences": {
    excerptEn:
      "When a product can be confidently wrong, the interface's main job stops being efficiency. It becomes showing the user how much to trust what they are reading.",
    excerptAr:
      "حين يصير بإمكان المنتج أن يخطئ بثقة، تتوقّف الوظيفة الأولى للواجهة عن كونها الكفاءة، وتصير إظهار مقدار الثقة الواجبة فيما يقرأه المستخدم.",
    bodyEn: `Designing an interface on top of a model is different from designing one on top of a database, and the difference is not technical. A database is either right or unavailable. A model can be wrong while sounding completely certain.

Everything else follows from that.

## Confidence is a design element

If the system is unsure, the interface has to say so — and not in fine print at the bottom.

A result presented identically whether it is near-certain or a guess teaches the user to trust everything or nothing. Both are failures. Ranked answers, visible uncertainty, and a clear difference between "here is the answer" and "here is my best attempt" are what let someone calibrate.

This is the same problem as a form that does not distinguish between required and optional fields, except the cost of getting it wrong is higher.

## Show the source

The single strongest trust signal is being able to check.

Where did this come from, which document, which record, which part of my data — a user who can verify one answer will extend more trust to the next ten. A user who cannot verify anything is being asked to believe, and belief is not a product feature.

## Make correction cheap

The model will be wrong. Design for that moment rather than hoping to avoid it.

Editing an answer, rejecting it, telling the system it misread the intent — these need to be one action, not a support ticket. If correcting the product is harder than doing the task manually, people will do it manually, and quietly stop coming back.

## Waiting is part of the interface

Generation is slow enough that the wait is a designed experience whether or not you designed it.

Streaming a response as it arrives is not a technical detail; it changes the wait from dead time into reading time. Anything over a second without a signal makes people press again, and pressing again on a generative feature usually costs money.

## Never let it act silently

The line I hold is that the model can draft anything and commit nothing.

Sending a message, making a payment, deleting a record, changing a setting — these need a human to confirm, and the confirmation has to state plainly what is about to happen. Convenience here is not worth the one case where it acts on a misunderstanding.

## What has not changed

None of the fundamentals went away. Hierarchy, clear language, honest states, respecting the user's time and attention.

An AI feature with a confusing interface is a confusing interface. The model does not rescue the design, and quite often it raises the standard, because the user is now being asked to judge something rather than just read it.`,
    bodyAr: `تصميم واجهة فوق نموذج ذكاء اصطناعي مختلف عن تصميمها فوق قاعدة بيانات، والفرق ليس تقنيًا. قاعدة البيانات إما صحيحة وإما غير متاحة. أما النموذج فيستطيع أن يخطئ وهو يبدو واثقًا تمامًا.

وكل ما عدا ذلك يتفرّع من هنا.

## الثقة عنصر تصميمي

إن كان النظام غير متأكد، فعلى الواجهة أن تقول ذلك، لا أن تدسّه في سطر صغير في الأسفل.

النتيجة المعروضة بالشكل نفسه سواء كانت شبه مؤكدة أو مجرد تخمين تعلّم المستخدم أن يثق بكل شيء أو بلا شيء، وكلاهما فشل. أما الإجابات المرتّبة، وإظهار عدم اليقين، والتمييز الواضح بين «هذه هي الإجابة» و«هذه أفضل محاولة عندي» فهي ما يتيح للمستخدم أن يعاير ثقته.

وهذه المسألة نفسها مسألة نموذج لا يميّز بين الحقول الإلزامية والاختيارية، غير أن كلفة الخطأ هنا أعلى.

## وأظهر المصدر

أقوى إشارة ثقة على الإطلاق هي القدرة على التحقّق.

من أين جاء هذا، ومن أي مستند، وأي سجلّ، وأي جزء من بياناتي — المستخدم الذي يتحقّق من إجابة واحدة سيمنح ثقة أكبر للعشر التالية. أما من لا يستطيع التحقّق من شيء فيُطلب منه أن يؤمن، والإيمان ليس ميزة في منتج.

## واجعل التصحيح رخيصًا

سيخطئ النموذج. فصمّم لتلك اللحظة بدل أن تأمل تفاديها.

تعديل إجابة، أو رفضها، أو إخبار النظام بأنه أساء فهم القصد — كل ذلك يجب أن يكون إجراءً واحدًا لا طلب دعم فني. فإن كان تصحيح المنتج أصعب من إنجاز المهمة يدويًا، أنجزها الناس يدويًا، وكفّوا عن العودة بصمت.

## والانتظار جزء من الواجهة

التوليد بطيء بما يكفي ليكون الانتظار تجربة مصمَّمة، صمّمتها أم لم تصمّمها.

وبثّ الإجابة أثناء وصولها ليس تفصيلًا تقنيًا، بل يحوّل الانتظار من وقت ميت إلى وقت قراءة. وأي تأخير يتجاوز الثانية بلا إشارة يجعل الناس يضغطون ثانية، والضغط ثانية على ميزة توليدية يكلّف مالًا عادةً.

## ولا تدعه يتصرّف بصمت أبدًا

الخط الذي ألتزم به أن النموذج يستطيع صياغة أي شيء، ولا يستطيع تنفيذ أي شيء.

إرسال رسالة، أو إتمام دفعة، أو حذف سجلّ، أو تغيير إعداد — كلها تحتاج تأكيدًا بشريًا، وعلى التأكيد أن يذكر بوضوح ما الذي سيحدث. والراحة هنا لا تساوي الحالة الواحدة التي يتصرّف فيها بناءً على سوء فهم.

## وما الذي لم يتغيّر

لم يذهب أي من الأساسيات. التسلسل البصري، واللغة الواضحة، والحالات الصادقة، واحترام وقت المستخدم وانتباهه.

فميزة ذكاء اصطناعي بواجهة مربكة هي واجهة مربكة. النموذج لا ينقذ التصميم، بل يرفع المعيار غالبًا، لأن المستخدم صار مطالبًا بالحكم على شيء لا بقراءته فقط.`,
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
