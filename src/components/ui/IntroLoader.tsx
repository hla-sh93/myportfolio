import { getLocale } from "next-intl/server";

/**
 * The brand curtain that opens the site.
 *
 * Deliberately built with **zero client-side React**: the markup is in the
 * server-rendered HTML so it paints on the very first frame, and one small
 * inline script (parsed immediately after it) owns the whole lifecycle. A
 * React component would only appear after hydration — far too late.
 *
 * The curtain is handed to the DOM through `dangerouslySetInnerHTML` on
 * purpose. React never reconciles the children of such a node, so the script
 * is free to mutate and delete them; rendering it as normal JSX meant React
 * put the curtain straight back on the page the moment hydration ran, and on
 * a repeat visit it never went away at all.
 *
 * Rules it follows:
 *  - shows once per browser session (sessionStorage), never on every route;
 *  - skipped entirely for `prefers-reduced-motion`;
 *  - two independent time caps, so a slow network — or a background tab where
 *    requestAnimationFrame never fires — can't leave the page behind it;
 *  - hidden outright when JavaScript is off (see the <noscript> block).
 */

/** Floor: the curtain is never on screen for less than this (ms). */
const MIN_MS = 780;
/** Ceiling: lift it no matter what the document is doing (ms). */
const MAX_MS = 2000;
/** Must match the `intro-wipe` animation duration in globals.css (ms). */
const EXIT_MS = 640;

/**
 * Static markup — every value below is a literal chosen by locale, so no
 * user-controlled data can ever reach this string.
 */
function curtain(isArabic: boolean) {
  return `<div id="intro-loader" class="intro-loader">
  <div class="intro-row">
    <span class="intro-tag">${isArabic ? "حلا شندية" : "Hla Shindeah"}</span>
    <span class="intro-tag intro-tag--plain">${isArabic ? "بورتفوليو" : "Portfolio"}</span>
  </div>
  <div class="intro-center">
    <div class="intro-clip"><span class="intro-mark">${isArabic ? "حلا" : "Hla"}<span>.</span></span></div>
  </div>
  <div class="intro-row">
    <span class="intro-rail"></span>
    <span class="intro-count"><span data-count>00</span>%</span>
  </div>
</div>`;
}

const script = `(function(){
  var d=document,r=d.documentElement,root=d.getElementById('intro-root');
  if(!root)return;
  var el=d.getElementById('intro-loader');
  function clear(){root.innerHTML='';r.removeAttribute('data-intro')}
  if(!el){clear();return}
  var KEY='hla:intro',skip=false;
  try{skip=sessionStorage.getItem(KEY)==='1'}catch(e){}
  if(skip||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){clear();return}
  try{sessionStorage.setItem(KEY,'1')}catch(e){}
  r.setAttribute('data-intro','on');
  var num=el.querySelector('[data-count]'),t0=performance.now(),p=0,ready=false,done=false;
  function finish(){
    if(done)return;done=true;
    el.setAttribute('data-state','out');
    setTimeout(clear,${EXIT_MS});
  }
  function tick(now){
    if(done)return;
    var target=ready?1:Math.min(0.92,(now-t0)/${MIN_MS});
    p+=(target-p)*0.16;
    if(target===1&&p>0.994)p=1;
    el.style.setProperty('--p',p.toFixed(4));
    if(num)num.textContent=(p*100<10?'0':'')+Math.round(p*100);
    if(p===1){finish();return}
    requestAnimationFrame(tick);
  }
  function open(){
    var left=${MIN_MS}-(performance.now()-t0);
    if(left>0)setTimeout(function(){ready=true},left);else ready=true;
  }
  if(d.readyState==='loading')d.addEventListener('DOMContentLoaded',open,{once:true});else open();
  setTimeout(function(){ready=true},${MAX_MS});
  /* requestAnimationFrame is suspended while the tab is in the background, so
     the loop above can stall indefinitely — this timer always runs. */
  setTimeout(finish,${MAX_MS + 1200});
  requestAnimationFrame(tick);
})();`;

export async function IntroLoader() {
  const locale = await getLocale();

  return (
    <>
      <div
        id="intro-root"
        aria-hidden="true"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: curtain(locale === "ar") }}
      />

      {/* No JS → nothing could ever lift the curtain, so it must not show. */}
      <noscript>
        <style>{`#intro-loader{display:none!important}`}</style>
      </noscript>

      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
