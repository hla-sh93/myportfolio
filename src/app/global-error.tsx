"use client"; // Error boundaries must be Client Components
/* eslint-disable @next/next/no-html-link-for-pages -- a layout has failed;
   a full document load is the reliable way home, not a client navigation. */

/**
 * Last-resort error page, for a failure in a layout itself.
 *
 * It replaces the whole document, so none of the site's CSS, fonts, theme or
 * translations are available here — hence inline styles, system fonts, the
 * OS colour scheme, and both languages side by side instead of guessing one.
 */
const css = `
  :root { color-scheme: light dark; --bg:#FAF7F6; --fg:#1C1416; --muted:#6E6367; --accent:#B91942; }
  @media (prefers-color-scheme: dark) { :root { --bg:#070607; --fg:#F7F4F5; --muted:#A39A9E; --accent:#D62049; } }
  body { margin:0; min-height:100vh; display:grid; place-items:center; background:var(--bg); color:var(--fg);
         font-family: system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif; padding:24px; box-sizing:border-box; }
  main { max-width:560px; width:100%; }
  section + section { margin-top:40px; padding-top:40px; border-top:1px solid color-mix(in srgb, var(--fg) 12%, transparent); }
  h1 { font-size:1.75rem; line-height:1.3; margin:0 0 12px; }
  p { color:var(--muted); line-height:1.7; margin:0 0 24px; }
  .row { display:flex; flex-wrap:wrap; gap:12px; }
  button, a { font:inherit; font-weight:600; font-size:.95rem; border-radius:999px; padding:12px 24px; cursor:pointer; text-decoration:none; }
  button { background:#B91942; color:#fff; border:0; }
  a { color:var(--fg); border:1px solid color-mix(in srgb, var(--fg) 25%, transparent); }
  button:focus-visible, a:focus-visible { outline:2px solid var(--accent); outline-offset:3px; }
`;

export default function GlobalError({ retry }: { error: Error; retry: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>حدث خطأ · Something went wrong</title>
        <meta name="robots" content="noindex" />
        <style>{css}</style>
      </head>
      <body>
        <main>
          <section>
            <h1>تعذّر عرض هذه الصفحة</h1>
            <p>حدث خطأ أثناء تحميل الصفحة. جرّب إعادة المحاولة، وإن تكرّر الأمر فارجع إلى الرئيسية.</p>
            <div className="row">
              <button type="button" onClick={() => retry()}>
                إعادة المحاولة
              </button>
              <a href="/ar">العودة إلى الرئيسية</a>
            </div>
          </section>
          <section dir="ltr" lang="en">
            <h1>This page could not be shown</h1>
            <p>Something went wrong while loading it. Try again, and if it keeps happening, head back home.</p>
            <div className="row">
              <button type="button" onClick={() => retry()}>
                Try again
              </button>
              <a href="/en">Back to home</a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
