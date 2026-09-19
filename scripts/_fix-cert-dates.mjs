import "dotenv/config";
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/* One shape for every certificate date. The rows were typed by hand over
   years and drifted: "Nov16, 2023", "Aug 28 , 2023", "Sep25, 2023". The
   issuer beside them is English and the line is already dir="ltr", so these
   stay English and simply agree with each other. */
const APPLY = process.argv.includes("--apply");
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function normalise(raw) {
  if (!raw) return raw ?? null;
  const s = String(raw).trim().replace(/\s+/g, " ");
  if (/^\d{4}$/.test(s)) return s;                       // year alone
  const m = s.match(/^([A-Za-z]{3,9})\.?\s*(\d{1,2})?\s*,?\s*(\d{4})$/);
  if (!m) return null;                                   // unrecognised, leave it
  const mon = MONTHS.find((x) => m[1].toLowerCase().startsWith(x.toLowerCase()));
  if (!mon) return null;
  return m[2] ? `${mon} ${Number(m[2])}, ${m[3]}` : `${mon} ${m[3]}`;
}

const certs = JSON.parse(fs.readFileSync("data/certificates.json", "utf8"));
const db = new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) });
const live = new Map((await db.certificate.findMany({ select: { id: true, date: true } })).map((c) => [c.id, c]));

let changed = 0, skipped = 0;
for (const c of certs) {
  const next = normalise(c.date);
  if (next === null && c.date) { console.log(`  ?? unrecognised, left alone: "${c.date}"`); skipped++; continue; }
  if (next === c.date) continue;
  console.log(`  "${String(c.date).padEnd(16)}"  ->  "${next}"`);
  c.date = next;
  changed++;
  if (APPLY && live.has(c.id)) await db.certificate.update({ where: { id: c.id }, data: { date: next } });
}
if (APPLY) fs.writeFileSync("data/certificates.json", JSON.stringify(certs, null, 1));
console.log(`\n${changed} dates ${APPLY ? "normalised (file + database)" : "would change"}${skipped ? `, ${skipped} left alone` : ""}`);
console.log(APPLY ? "APPLIED" : "DRY RUN — re-run with --apply");
await db.$disconnect();
