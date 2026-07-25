import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
const D='my portfolio/02 - Branding & Identity/Cadeau Boutique';
const out='my portfolio/08 - Mockups/Cadeau Boutique/mockup-1-brand-board.png';
fs.mkdirSync(path.dirname(out),{recursive:true});
const C={charcoal:'#3B3A38',gold:'#C6A15B',mauve:'#8A6E5E',cream:'#EFE7DC',white:'#FFFFFF'};
const W=1800,M=50,G=26,colW=Math.round((1800-100-26)/2),rightX=M+colW+G;
const heroY=50,heroH=430,r2Y=heroY+heroH+G,r2H=620,r3Y=r2Y+r2H+G,r3H=620,swY=r3Y+r3H+G,swH=150,H=swY+swH+M;
async function cover(p,w,h,r,pos='centre'){const img=await sharp(p).resize(w,h,{fit:'cover',position:pos}).toBuffer();const mask=Buffer.from(`<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" fill="#fff"/></svg>`);return sharp(img).composite([{input:mask,blend:'dest-in'}]).png().toBuffer();}
const contain=(p,w,h)=>sharp(p).resize(w,h,{fit:'inside',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
const sw=[[C.charcoal,'#fff','#3B3A38'],[C.gold,'#fff','#C6A15B'],[C.mauve,'#fff','#8A6E5E'],[C.cream,'#3B3A38','#EFE7DC'],[C.white,'#3B3A38','#FFFFFF']];
const swW=(1700-4*20)/5;
const swSvg=sw.map((s,i)=>{const x=M+i*(swW+20);return `<rect x="${x}" y="${swY}" width="${swW}" height="${swH}" rx="16" fill="${s[0]}" ${i>=3?'stroke="#ddd" stroke-width="2"':''}/><text x="${x+swW/2}" y="${swY+swH-22}" font-family="Georgia,serif" font-size="24" font-weight="bold" fill="${s[1]}" text-anchor="middle">${s[2]}</text>`;}).join('');
const svg=`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<rect width="${W}" height="${H}" fill="#e9e2d8"/>
<rect x="${M}" y="${heroY}" width="1700" height="${heroH}" rx="26" fill="${C.charcoal}"/>
<rect x="${M+40}" y="${heroY+70}" width="520" height="290" rx="16" fill="#fff"/>
<text x="${M+640}" y="${heroY+200}" font-family="Georgia,serif" font-size="52" fill="${C.gold}">Cadeau Boutique</text>
<text x="${M+642}" y="${heroY+262}" font-family="Georgia,serif" font-size="30" letter-spacing="3" fill="#fff">EXPRESS HOW YOU FEEL</text>
${swSvg}</svg>`;
const base=await sharp(Buffer.from(svg)).png().toBuffer();
const logo=await contain('scripts/_cadeau_logo.png',440,250);const lm=await sharp(logo).metadata();
const cards=await cover(`${D}/business-cards.jpg`,colW,r2H,24);
const letter=await cover(`${D}/letterhead.jpg`,colW,r2H,24);
const tag1=await cover(`${D}/hang-tags-1.jpg`,colW,r3H,24);
const tag3=await cover(`${D}/hang-tags-3.jpg`,colW,r3H,24);
await sharp(base).composite([
 {input:logo,left:Math.round(M+40+(520-lm.width)/2),top:Math.round(heroY+70+(290-lm.height)/2)},
 {input:cards,left:M,top:r2Y},{input:letter,left:rightX,top:r2Y},
 {input:tag1,left:M,top:r3Y},{input:tag3,left:rightX,top:r3Y},
]).png().toFile(out);
console.log('WROTE',out,W+'x'+H);
