/**
 * Illustrative blog covers v2 — every article gets a topic-specific
 * illustration (not typography). Studio look: dark base, blueprint grid,
 * wine glow, category-tinted geometric scene. Latin-only micro-labels.
 * Output: public/images/blog/<slug>.webp (1600×900).
 */
import sharp from "sharp";
import fs from "node:fs";

const W = 1600, H = 900;
const CAT = {
  uiux: { tint: "#E14A6D", label: "UI / UX" },
  frontend: { tint: "#60A5FA", label: "FRONT-END" },
  graphic: { tint: "#F59E0B", label: "GRAPHIC DESIGN" },
  product: { tint: "#8B5CF6", label: "PRODUCT DESIGN" },
};

/* ── reusable primitives ─────────────────────────────────────────────── */
const card = (x, y, w, h, r, fill, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const glass = (x, y, w, h, r = 18) =>
  card(x, y, w, h, r, "rgba(255,255,255,0.055)", 'stroke="rgba(255,255,255,0.14)" stroke-width="2"');
const line = (x, y, w, hh, color, o = 1, r = 4) =>
  card(x, y, w, hh, r, color, `opacity="${o}"`);
const dot = (cx, cy, r, fill, extra = "") => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${extra}/>`;
const sparkle = (cx, cy, s, color) =>
  `<path d="M${cx} ${cy - s} Q${cx + s * 0.18} ${cy - s * 0.18} ${cx + s} ${cy} Q${cx + s * 0.18} ${cy + s * 0.18} ${cx} ${cy + s} Q${cx - s * 0.18} ${cy + s * 0.18} ${cx - s} ${cy} Q${cx - s * 0.18} ${cy - s * 0.18} ${cx} ${cy - s}Z" fill="${color}"/>`;
const arrow = (x1, y1, x2, y2, color, sw = 6) => {
  const a = Math.atan2(y2 - y1, x2 - x1), L = 16;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>
  <path d="M${x2} ${y2} L${x2 - L * Math.cos(a - 0.45)} ${y2 - L * Math.sin(a - 0.45)} M${x2} ${y2} L${x2 - L * Math.cos(a + 0.45)} ${y2 - L * Math.sin(a + 0.45)}" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;
};
const browser = (x, y, w, h, tint) => `
  ${glass(x, y, w, h, 20)}
  <line x1="${x}" y1="${y + 52}" x2="${x + w}" y2="${y + 52}" stroke="rgba(255,255,255,0.14)" stroke-width="2"/>
  ${dot(x + 30, y + 26, 7, "#E5484D")}${dot(x + 56, y + 26, 7, "#F5A623")}${dot(x + 82, y + 26, 7, "#30A46C")}
  ${card(x + w - 150, y + 16, 130, 20, 10, "rgba(255,255,255,0.10)")}`;
const phone = (x, y, w, h, tint) => `
  ${glass(x, y, w, h, 34)}
  ${card(x + w / 2 - 34, y + 14, 68, 12, 6, "rgba(255,255,255,0.18)")}`;

/* ── per-article scenes (x range ~640..1520, y ~120..820) ────────────── */
const scenes = {
  /* UI/UX */
  "ai-assisted-design-workflow-2026": (t) => `
    ${browser(660, 190, 560, 430, t)}
    ${card(700, 290, 200, 120, 14, "rgba(255,255,255,0.10)")}
    ${card(700, 440, 200, 24, 8, "rgba(255,255,255,0.14)")}
    ${card(700, 480, 150, 24, 8, "rgba(255,255,255,0.10)")}
    ${card(940, 290, 240, 220, 14, t + "33", `stroke="${t}" stroke-width="3" stroke-dasharray="10 8"`)}
    ${sparkle(1180, 270, 34, t)}${sparkle(1230, 340, 20, "#F5F5F7")}${sparkle(1130, 240, 14, t)}
    <path d="M1010 560 L1035 640 L1058 610 L1090 655 L1108 640 L1076 596 L1112 585 Z" fill="#F5F5F7"/>`,
  "arabic-rtl-ux-design-guide": (t) => `
    ${glass(660, 200, 380, 420)}
    ${line(700, 260, 300, 26, t, 1, 8)}
    ${line(760, 320, 240, 16, "rgba(255,255,255,0.35)")}
    ${line(720, 356, 280, 16, "rgba(255,255,255,0.22)")}
    ${line(800, 392, 200, 16, "rgba(255,255,255,0.22)")}
    ${card(700, 470, 120, 90, 12, "rgba(255,255,255,0.10)")}
    ${line(850, 480, 150, 14, "rgba(255,255,255,0.25)")}
    ${line(880, 510, 120, 14, "rgba(255,255,255,0.18)")}
    ${glass(1100, 200, 380, 420)}
    ${line(1140, 260, 300, 26, "rgba(255,255,255,0.35)", 1, 8)}
    ${line(1140, 320, 240, 16, "rgba(255,255,255,0.35)")}
    ${line(1140, 356, 280, 16, "rgba(255,255,255,0.22)")}
    ${line(1140, 392, 200, 16, "rgba(255,255,255,0.22)")}
    ${card(1320, 470, 120, 90, 12, t + "44", `stroke="${t}" stroke-width="2.5"`)}
    ${line(1140, 480, 150, 14, "rgba(255,255,255,0.25)")}
    ${arrow(1060, 700, 940, 700, t)}
    ${arrow(1120, 700, 1240, 700, "rgba(255,255,255,0.5)")}
    <text x="1070" y="760" text-anchor="middle" font-family="Arial" font-size="26" font-weight="700" letter-spacing="4" fill="rgba(255,255,255,0.55)">RTL · LTR</text>`,
  "design-tokens-multi-brand-systems": (t) => {
    const chips = [["#B91942", 690, 240], [t, 850, 240], ["#F5A623", 1010, 240], ["#30A46C", 1170, 240]];
    return `
    ${chips.map(([c, x, y]) => card(x, y, 120, 120, 20, c) + dot(x + 60, y + 170, 6, "rgba(255,255,255,0.4)")).join("")}
    ${chips.map(([, x]) => `<line x1="${x + 60}" y1="${360}" x2="1000" y2="470" stroke="rgba(255,255,255,0.25)" stroke-width="2.5"/>`).join("")}
    ${card(900, 470, 200, 64, 14, "rgba(255,255,255,0.09)", 'stroke="rgba(255,255,255,0.2)" stroke-width="2"')}
    <text x="1000" y="512" text-anchor="middle" font-family="Consolas,monospace" font-size="30" font-weight="700" fill="#F5F5F7">accent</text>
    <line x1="1000" y1="534" x2="800" y2="650" stroke="${t}" stroke-width="3"/>
    <line x1="1000" y1="534" x2="1000" y2="650" stroke="${t}" stroke-width="3"/>
    <line x1="1000" y1="534" x2="1200" y2="650" stroke="${t}" stroke-width="3"/>
    ${card(720, 650, 160, 76, 14, "rgba(255,255,255,0.07)")}${card(920, 650, 160, 76, 14, "rgba(255,255,255,0.07)")}${card(1120, 650, 160, 76, 14, "rgba(255,255,255,0.07)")}
    ${card(748, 676, 104, 24, 8, "#B91942")}${card(948, 676, 104, 24, 8, "#B91942")}${card(1148, 676, 104, 24, 8, "#B91942")}`;
  },
  "motion-ux-microinteractions-2026": (t) => `
    <path d="M680 640 C 820 640, 850 300, 990 300 S 1160 640, 1300 640" fill="none" stroke="${t}" stroke-width="6" stroke-linecap="round"/>
    ${dot(680, 640, 16, t, 'opacity="0.25"')}${dot(800, 590, 20, t, 'opacity="0.4"')}${dot(920, 380, 26, t, 'opacity="0.65"')}
    ${dot(1060, 340, 34, t)}
    ${dot(1060, 340, 52, "none", `stroke="${t}" stroke-width="3" opacity="0.5"`)}
    ${dot(1060, 340, 74, "none", `stroke="${t}" stroke-width="2" opacity="0.25"`)}
    <path d="M1275 585 l0 88 l26 -22 l16 38 l24 -10 l-16 -38 l34 -4 Z" fill="#F5F5F7"/>
    ${card(1200, 200, 240, 90, 45, "rgba(255,255,255,0.08)", 'stroke="rgba(255,255,255,0.2)" stroke-width="2"')}
    ${dot(1268, 245, 30, t)}
    <text x="1320" y="257" font-family="Arial" font-size="30" font-weight="800" fill="#F5F5F7">ON</text>`,

  /* FRONT-END */
  "react-server-components-in-practice": (t) => `
    ${glass(660, 210, 300, 400)}
    ${[0, 1, 2].map((i) => card(692, 250 + i * 120, 236, 88, 12, "rgba(255,255,255,0.08)", 'stroke="rgba(255,255,255,0.16)" stroke-width="2"') + dot(716, 294 + i * 120, 8, t) + line(740, 286 + i * 120, 150, 14, "rgba(255,255,255,0.3)")).join("")}
    <text x="810" y="660" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" letter-spacing="5" fill="rgba(255,255,255,0.55)">SERVER</text>
    ${arrow(980, 400, 1120, 400, t, 7)}
    ${card(1000, 340, 100, 34, 17, t + "33", `stroke="${t}" stroke-width="2"`)}
    ${browser(1140, 230, 380, 360, t)}
    ${card(1180, 320, 300, 60, 12, "rgba(255,255,255,0.10)")}
    ${card(1180, 400, 300, 60, 12, t + "40", `stroke="${t}" stroke-width="2.5"`)}
    ${dot(1210, 430, 10, t)}
    ${card(1180, 480, 190, 60, 12, "rgba(255,255,255,0.10)")}
    <text x="1330" y="660" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" letter-spacing="5" fill="rgba(255,255,255,0.55)">CLIENT</text>`,
  "modern-css-2026-no-framework": (t) => `
    ${glass(680, 190, 700, 470)}
    ${card(720, 240, 300, 370, 16, "rgba(255,255,255,0.06)", `stroke="${t}" stroke-width="3" stroke-dasharray="12 8"`)}
    ${card(760, 290, 220, 120, 12, "rgba(255,255,255,0.10)")}
    ${card(760, 440, 220, 120, 12, "rgba(255,255,255,0.10)")}
    ${card(1070, 240, 270, 180, 16, t + "30", `stroke="${t}" stroke-width="3"`)}
    ${card(1100, 280, 90, 90, 10, "rgba(255,255,255,0.14)")}
    ${card(1210, 280, 100, 40, 10, "rgba(255,255,255,0.10)")}
    <text x="1085" y="500" font-family="Consolas,monospace" font-size="42" font-weight="700" fill="#F5F5F7">:has( )</text>
    <text x="1085" y="570" font-family="Consolas,monospace" font-size="30" font-weight="600" fill="rgba(255,255,255,0.5)">@container</text>
    ${dot(700, 620, 9, t)}${dot(700, 620, 20, "none", `stroke="${t}" stroke-width="2.5" opacity="0.6"`)}`,
  "core-web-vitals-inp-performance": (t) => `
    <path d="M 760 620 A 260 260 0 0 1 1280 620" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="34" stroke-linecap="round"/>
    <path d="M 760 620 A 260 260 0 0 1 1150 400" fill="none" stroke="${t}" stroke-width="34" stroke-linecap="round"/>
    ${dot(1020, 620, 22, "#F5F5F7")}
    <line x1="1020" y1="620" x2="1165" y2="452" stroke="#F5F5F7" stroke-width="10" stroke-linecap="round"/>
    <text x="1020" y="720" text-anchor="middle" font-family="Arial" font-size="34" font-weight="900" fill="#F5F5F7">INP</text>
    ${[["190ms", 700], ["OK", 1020], ["FAST", 1290]].map(([s, x]) => `<text x="${x}" y="790" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" letter-spacing="2" fill="rgba(255,255,255,0.45)">${s}</text>`).join("")}
    ${sparkle(1250, 300, 22, t)}
    ${card(690, 210, 170, 60, 14, "rgba(255,255,255,0.08)", 'stroke="rgba(255,255,255,0.18)" stroke-width="2"')}
    <text x="775" y="250" text-anchor="middle" font-family="Arial" font-size="26" font-weight="800" fill="#30A46C">LCP ✓</text>`,
  "typescript-patterns-design-engineers": (t) => `
    <text x="700" y="480" font-family="Consolas,monospace" font-size="200" font-weight="800" fill="${t}" opacity="0.9">&lt;</text>
    <text x="1300" y="480" font-family="Consolas,monospace" font-size="200" font-weight="800" fill="${t}" opacity="0.9">&gt;</text>
    ${card(860, 280, 380, 90, 16, "rgba(255,255,255,0.08)", 'stroke="rgba(255,255,255,0.2)" stroke-width="2"')}
    <text x="1050" y="338" text-anchor="middle" font-family="Consolas,monospace" font-size="34" font-weight="700" fill="#F5F5F7">size: "sm" | "lg"</text>
    ${card(860, 400, 380, 90, 16, "rgba(255,255,255,0.08)", 'stroke="rgba(255,255,255,0.2)" stroke-width="2"')}
    <text x="1050" y="458" text-anchor="middle" font-family="Consolas,monospace" font-size="34" font-weight="700" fill="#F5F5F7">tone: Token</text>
    ${card(860, 520, 380, 90, 16, "#E5484D22", 'stroke="#E5484D" stroke-width="3"')}
    <text x="1050" y="578" text-anchor="middle" font-family="Consolas,monospace" font-size="34" font-weight="700" fill="#E5484D" text-decoration="line-through">"#ff0000"</text>
    <line x1="880" y1="640" x2="1010" y2="640" stroke="#E5484D" stroke-width="6" stroke-linecap="round" transform="rotate(-8 945 640)"/>`,

  /* GRAPHIC */
  "brand-identity-ai-era": (t) => `
    ${dot(1000, 400, 190, "none", 'stroke="rgba(255,255,255,0.2)" stroke-width="2"')}
    ${dot(1000, 400, 132, "none", 'stroke="rgba(255,255,255,0.3)" stroke-width="2"')}
    <line x1="810" y1="400" x2="1190" y2="400" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <line x1="1000" y1="210" x2="1000" y2="590" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    <path d="M1000 300 C 920 300 880 360 880 415 C 880 480 940 520 1000 520 C 1060 520 1120 480 1120 415 C 1120 360 1080 300 1000 300 Z" fill="none" stroke="${t}" stroke-width="8"/>
    ${dot(1000, 400, 26, t)}
    <path d="M960 262 l14 -34 l14 34 l-14 12 Z" fill="#F5F5F7"/>
    ${sparkle(1250, 250, 24, t)}${sparkle(770, 560, 16, "rgba(255,255,255,0.7)")}
    ${card(1180, 560, 200, 66, 14, "rgba(255,255,255,0.08)", 'stroke="rgba(255,255,255,0.2)" stroke-width="2"')}
    <text x="1280" y="604" text-anchor="middle" font-family="Arial" font-size="24" font-weight="800" letter-spacing="3" fill="#F5F5F7">HUMAN ✓</text>`,
  "packaging-design-shelf-to-screen": (t) => `
    <line x1="660" y1="640" x2="1180" y2="640" stroke="rgba(255,255,255,0.35)" stroke-width="5" stroke-linecap="round"/>
    ${[0, 1, 2].map((i) => {
      const x = 700 + i * 150, hh = 180 + (i === 1 ? 30 : 0);
      const cols = [t, "#E14A6D", "#30A46C"];
      return `${card(x, 640 - hh, 110, hh, 14, "rgba(255,255,255,0.09)", 'stroke="rgba(255,255,255,0.22)" stroke-width="2"')}
        ${card(x + 18, 640 - hh + 24, 74, 34, 8, cols[i])}
        ${line(x + 24, 640 - hh + 78, 62, 10, "rgba(255,255,255,0.3)")}
        ${line(x + 24, 640 - hh + 98, 44, 10, "rgba(255,255,255,0.2)")}`;
    }).join("")}
    ${phone(1240, 230, 220, 440, t)}
    ${card(1268, 300, 164, 120, 12, t + "3a", `stroke="${t}" stroke-width="2.5"`)}
    ${card(1290, 330, 120, 40, 8, t)}
    ${line(1268, 445, 164, 12, "rgba(255,255,255,0.3)")}
    ${line(1268, 470, 110, 12, "rgba(255,255,255,0.2)")}
    ${card(1268, 540, 164, 48, 24, "#F5F5F7")}
    ${arrow(1150, 340, 1230, 340, "rgba(255,255,255,0.5)")}`,
  "typography-trends-2026-variable-arabic": (t) => `
    <text x="700" y="560" font-family="Georgia,serif" font-size="300" font-weight="400" fill="rgba(255,255,255,0.9)">A</text>
    <text x="920" y="560" font-family="Arial" font-size="300" font-weight="900" fill="${t}">A</text>
    <line x1="720" y1="640" x2="1180" y2="640" stroke="rgba(255,255,255,0.25)" stroke-width="6" stroke-linecap="round"/>
    ${dot(1060, 640, 18, t)}
    <text x="720" y="700" font-family="Arial" font-size="24" font-weight="700" letter-spacing="4" fill="rgba(255,255,255,0.5)">100</text>
    <text x="1130" y="700" font-family="Arial" font-size="24" font-weight="700" letter-spacing="4" fill="rgba(255,255,255,0.5)">900</text>
    ${card(1250, 260, 210, 300, 20, "rgba(255,255,255,0.07)", 'stroke="rgba(255,255,255,0.18)" stroke-width="2"')}
    ${line(1280, 300, 150, 18, t, 0.9)}
    ${line(1300, 340, 130, 14, "rgba(255,255,255,0.4)")}
    ${line(1280, 375, 150, 14, "rgba(255,255,255,0.3)")}
    ${line(1320, 410, 110, 14, "rgba(255,255,255,0.3)")}
    ${line(1280, 445, 150, 14, "rgba(255,255,255,0.2)")}
    <text x="1355" y="530" text-anchor="middle" font-family="Arial" font-size="22" font-weight="700" letter-spacing="3" fill="rgba(255,255,255,0.5)">RTL READY</text>`,
  "brand-board-process-brief-to-delivery": (t) => `
    ${glass(660, 190, 820, 480)}
    ${card(700, 240, 260, 180, 14, "rgba(255,255,255,0.10)")}
    ${dot(830, 330, 52, t)}
    ${card(1000, 240, 130, 84, 12, "#B91942")}${card(1150, 240, 130, 84, 12, t)}${card(1300, 240, 130, 84, 12, "#3B3A38")}
    ${line(1000, 350, 430, 20, "rgba(255,255,255,0.28)", 1, 8)}
    ${line(1000, 388, 320, 14, "rgba(255,255,255,0.18)")}
    ${card(700, 450, 180, 180, 14, "rgba(255,255,255,0.08)", 'stroke="rgba(255,255,255,0.2)" stroke-width="2"')}
    ${card(724, 480, 132, 84, 10, t + "44")}
    ${line(724, 580, 132, 12, "rgba(255,255,255,0.3)")}
    ${card(910, 450, 260, 180, 14, "rgba(255,255,255,0.08)", 'stroke="rgba(255,255,255,0.2)" stroke-width="2"')}
    ${line(940, 490, 200, 14, "rgba(255,255,255,0.35)")}
    ${line(940, 520, 160, 12, "rgba(255,255,255,0.25)")}
    ${line(940, 548, 180, 12, "rgba(255,255,255,0.2)")}
    ${card(1200, 450, 230, 180, 14, t + "26", `stroke="${t}" stroke-width="3"`)}
    <text x="1315" y="555" text-anchor="middle" font-family="Arial" font-size="28" font-weight="800" letter-spacing="2" fill="#F5F5F7">BOARD</text>`,

  /* PRODUCT */
  "ui-designer-to-product-designer": (t) => `
    ${card(680, 470, 190, 130, 16, "rgba(255,255,255,0.09)", 'stroke="rgba(255,255,255,0.22)" stroke-width="2"')}
    ${line(706, 500, 138, 12, "rgba(255,255,255,0.35)")}
    ${line(706, 526, 100, 12, "rgba(255,255,255,0.25)")}
    ${card(706, 552, 60, 24, 8, t + "55")}
    <path d="M 900 530 C 1010 530 1030 380 1160 350" fill="none" stroke="${t}" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 18"/>
    ${arrow(1160, 350, 1230, 336, t, 7)}
    ${dot(1310, 320, 100, "none", 'stroke="rgba(255,255,255,0.25)" stroke-width="3"')}
    ${dot(1310, 320, 64, "none", 'stroke="rgba(255,255,255,0.4)" stroke-width="3"')}
    ${dot(1310, 320, 28, t)}
    <text x="775" y="660" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" letter-spacing="4" fill="rgba(255,255,255,0.5)">SCREENS</text>
    <text x="1310" y="480" text-anchor="middle" font-family="Arial" font-size="24" font-weight="700" letter-spacing="4" fill="rgba(255,255,255,0.5)">OUTCOMES</text>`,
  "design-engineering-handoff-is-dead": (t) => `
    ${card(700, 260, 300, 300, 20, "rgba(255,255,255,0.07)", `stroke="${t}" stroke-width="3"`)}
    ${dot(760, 330, 26, t)}
    ${line(730, 400, 240, 16, "rgba(255,255,255,0.3)")}
    ${line(730, 436, 180, 16, "rgba(255,255,255,0.2)")}
    ${card(1060, 260, 300, 300, 20, "rgba(255,255,255,0.07)", 'stroke="rgba(255,255,255,0.3)" stroke-width="3"')}
    <text x="1210" y="430" text-anchor="middle" font-family="Consolas,monospace" font-size="72" font-weight="700" fill="#F5F5F7">&lt;/&gt;</text>
    <path d="M 1010 410 L 1050 410" stroke="${t}" stroke-width="8" stroke-linecap="round"/>
    ${dot(1030, 410, 30, "none", `stroke="${t}" stroke-width="4"`)}
    ${card(890, 600, 300, 70, 35, t + "26", `stroke="${t}" stroke-width="3"`)}
    <text x="1040" y="646" text-anchor="middle" font-family="Arial" font-size="26" font-weight="800" letter-spacing="3" fill="#F5F5F7">ONE CRAFT</text>`,
  "ux-research-on-a-budget": (t) => `
    ${[0, 1, 2, 3, 4].map((i) => {
      const x = 700 + i * 96;
      return `${dot(x, 300, 34, "rgba(255,255,255,0.14)", 'stroke="rgba(255,255,255,0.3)" stroke-width="2.5"')}
      <path d="M ${x - 36} 392 a 36 30 0 0 1 72 0" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.3)" stroke-width="2.5"/>`;
    }).join("")}
    ${dot(1178, 300, 34, t + "44", `stroke="${t}" stroke-width="3"`)}
    <path d="M 1142 392 a 36 30 0 0 1 72 0" fill="${t}44" stroke="${t}" stroke-width="3"/>
    ${dot(1000, 560, 110, "none", 'stroke="rgba(255,255,255,0.35)" stroke-width="10"')}
    <line x1="1082" y1="642" x2="1190" y2="750" stroke="rgba(255,255,255,0.5)" stroke-width="16" stroke-linecap="round"/>
    ${card(940, 520, 120, 20, 8, t, 'opacity="0.85"')}
    ${card(940, 556, 90, 16, 8, "rgba(255,255,255,0.35)")}
    ${card(940, 588, 104, 16, 8, "rgba(255,255,255,0.25)")}
    ${sparkle(1290, 500, 18, t)}`,
  "designing-ai-native-product-experiences": (t) => `
    <path d="M 700 260 h 420 a 26 26 0 0 1 26 26 v 150 a 26 26 0 0 1 -26 26 h -310 l -68 62 v -62 h -42 a 26 26 0 0 1 -26 -26 v -150 a 26 26 0 0 1 26 -26 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.25)" stroke-width="3"/>
    ${line(740, 310, 300, 16, "rgba(255,255,255,0.35)")}
    ${line(740, 348, 240, 16, "rgba(255,255,255,0.22)")}
    ${sparkle(1100, 300, 20, t)}
    <path d="M 1240 420 l 90 -40 l 90 40 v 90 c 0 80 -60 130 -90 145 c -30 -15 -90 -65 -90 -145 Z" fill="${t}22" stroke="${t}" stroke-width="5"/>
    <path d="M 1290 520 l 30 32 l 55 -62" fill="none" stroke="${t}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    ${card(820, 560, 240, 66, 33, "rgba(255,255,255,0.08)", 'stroke="rgba(255,255,255,0.25)" stroke-width="2.5"')}
    <text x="940" y="604" text-anchor="middle" font-family="Arial" font-size="24" font-weight="800" letter-spacing="2" fill="#F5F5F7">PREVIEW ✎</text>`,
};

/* ── frame ───────────────────────────────────────────────────────────── */
function svgFor(slug, cat) {
  const { tint, label } = CAT[cat];
  const grid = [];
  for (let x = 0; x <= W; x += 80) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#ffffff" stroke-opacity="0.045"/>`);
  for (let y = 0; y <= H; y += 80) grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#ffffff" stroke-opacity="0.045"/>`);
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="75%" cy="50%" r="75%">
      <stop offset="0%" stop-color="${tint}" stop-opacity="0.34"/>
      <stop offset="55%" stop-color="#B91942" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#070607" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="5%" cy="105%" r="70%">
      <stop offset="0%" stop-color="#B91942" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#070607" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#070607"/>
  ${grid.join("")}
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>
  <text x="96" y="140" font-family="Arial" font-size="26" font-weight="700" letter-spacing="10" fill="${tint}">${label}</text>
  <rect x="98" y="166" width="72" height="5" rx="2.5" fill="${tint}"/>
  <text x="98" y="${H - 78}" font-family="Arial" font-size="22" font-weight="600" letter-spacing="6" fill="#98989D">HLA SHINDEAH — BLOG · 2026</text>
  ${scenes[slug](tint)}
</svg>`;
}

const items = JSON.parse(fs.readFileSync("scripts/_covers.json", "utf8"));
fs.mkdirSync("public/images/blog", { recursive: true });
for (const { slug, cat } of items) {
  if (!scenes[slug]) { console.error("NO SCENE:", slug); continue; }
  await sharp(Buffer.from(svgFor(slug, cat))).webp({ quality: 86 }).toFile(`public/images/blog/${slug}.webp`);
  console.error("ok", slug);
}
console.error("V2 COVERS DONE");
