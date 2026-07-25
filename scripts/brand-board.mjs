// Hybrid brand-showcase board:
//  - AI environmental scenes (van, storefront, laptop) passed in as images
//  - REAL designs composited pixel-exact (business card, letterhead, logo)
//  - exact brand palette
// Usage: node scripts/brand-board.mjs <projDir> <out> <van> <storefront> <laptop> <heroBg>
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const [projDir, outPath, vanP, shopP, lapP, heroP] = process.argv.slice(2);
const P = (f) => path.join(projDir, f);
const C = { black:'#1F1F1F', red:'#E31E24', orange:'#FF6A00', amber:'#FFC107', white:'#FFFFFF' };

async function cover(buf, w, h, r, pos='centre') {
  const img = await sharp(buf).resize(w, h, { fit:'cover', position:pos }).toBuffer();
  const mask = Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`);
  return sharp(img).composite([{ input: mask, blend:'dest-in' }]).png().toBuffer();
}
const contain = (p, w, h) => sharp(p).resize(w, h, { fit:'inside', background:{r:0,g:0,b:0,alpha:0} }).png().toBuffer();

const W=1800, M=50, G=26, colW=Math.round((1800-100-26)/2);
const rightX=M+colW+G;
const heroY=50, heroH=520;
const r2Y=heroY+heroH+G, r2H=620;
const r3Y=r2Y+r2H+G, r3H=620;
const r4Y=r3Y+r3H+G, r4H=620;
const valY=r4Y+r4H+G, valH=210;
const swY=valY+valH+G, swH=150;
const H=swY+swH+M;

// palette (5)
const sw=[[C.black,'#fff','#1F1F1F'],[C.red,'#fff','#E31E24'],[C.orange,'#fff','#FF6A00'],[C.amber,'#1F1F1F','#FFC107'],[C.white,'#1F1F1F','#FFFFFF']];
const swW=(1700-4*20)/5;
const swSvg=sw.map((s,i)=>{const x=M+i*(swW+20);return `<rect x="${x}" y="${swY}" width="${swW}" height="${swH}" rx="16" fill="${s[0]}" ${i===4?'stroke="#ddd" stroke-width="2"':''}/><text x="${x+swW/2}" y="${swY+swH-22}" font-family="Arial" font-size="24" font-weight="bold" fill="${s[1]}" text-anchor="middle">${s[2]}</text>`;}).join('');

// values (4 cols on a light tile)
const vals=[['Solar Solutions','High-efficiency systems for homes and businesses'],['Professional Installation','Expert engineering and setup'],['Reliable Support','Dedicated long-term maintenance'],['Built to Last','Quality you can trust']];
const vColW=(1700-2*40)/4;
const valSvg=`<rect x="${M}" y="${valY}" width="1700" height="${valH}" rx="20" fill="#F2F2F2"/>`+vals.map((v,i)=>{const cx=M+40+i*vColW+vColW/2;return `<rect x="${cx-30}" y="${valY+44}" width="60" height="5" rx="2.5" fill="${C.red}"/><text x="${cx}" y="${valY+100}" font-family="Arial" font-size="28" font-weight="bold" fill="${C.black}" text-anchor="middle">${v[0]}</text>${wrap(v[1],cx,valY+134,26,vColW-30)}`;}).join('');
function wrap(t,cx,y,fs,maxw){const words=t.split(' ');const lines=[];let cur='';const cpl=Math.floor(maxw/(fs*0.52));for(const w of words){if((cur+' '+w).trim().length>cpl){lines.push(cur.trim());cur=w;}else cur+=' '+w;}if(cur.trim())lines.push(cur.trim());return lines.map((l,i)=>`<text x="${cx}" y="${y+i*(fs+6)}" font-family="Arial" font-size="${fs}" fill="#555" text-anchor="middle">${l}</text>`).join('');}

const svg=`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><defs>
<linearGradient id="acc" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${C.amber}"/><stop offset="100%" stop-color="${C.red}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="#0e0e10"/>
<rect x="${M}" y="${heroY}" width="1700" height="${heroH}" rx="26" fill="${C.black}"/>
<rect x="${M+40}" y="${heroY+120}" width="740" height="250" rx="16" fill="#fff"/>
<rect x="${M+40}" y="${heroY+400}" width="200" height="8" rx="4" fill="url(#acc)"/>
<text x="${M+40}" y="${heroY+455}" font-family="Arial" font-size="30" letter-spacing="4" fill="#fff">BOUNDLESS IMPACT</text>
<rect x="${rightX}" y="${r4Y}" width="${colW}" height="${r4H}" rx="24" fill="#F4F1EE"/>
${valSvg}
${swSvg}
</svg>`;

const base=await sharp(Buffer.from(svg)).png().toBuffer();
const heroLogo=await contain(P('full logo.png'),640,220); const hlm=await sharp(heroLogo).metadata();
const logoLg=await contain(P('full logo.png'),640,300); const llm=await sharp(logoLg).metadata();

const hero=await cover(fs.readFileSync(heroP), 620, heroH-48, 18);
const van=await cover(fs.readFileSync(vanP), colW, r2H, 24);
const shop=await cover(fs.readFileSync(shopP), colW, r2H, 24);
const lap=await cover(fs.readFileSync(lapP), colW, r3H, 24);
const card=await cover(fs.readFileSync(P('Default_A_luxurious_black_business_card_with_a_subtle_embossed).jpg')), colW, r3H, 24);
const letter=await cover(fs.readFileSync(P('Sola-temp.jpg')), colW, r4H, 24, 'top');

await sharp(base).composite([
  { input: hero, left: M+1056, top: heroY+24 },
  { input: heroLogo, left: Math.round(M+40+(740-hlm.width)/2), top: Math.round(heroY+120+(250-hlm.height)/2) },
  { input: van, left: M, top: r2Y },
  { input: shop, left: rightX, top: r2Y },
  { input: lap, left: M, top: r3Y },
  { input: card, left: rightX, top: r3Y },
  { input: letter, left: M, top: r4Y },
  { input: logoLg, left: Math.round(rightX+(colW-llm.width)/2), top: Math.round(r4Y+(r4H-llm.height)/2) },
]).png().toFile(outPath);
console.log('WROTE', outPath, W+'x'+H);
