/**
 * Generates the two values the admin login needs, without the password ever
 * being typed into a chat, a file, or a command-line argument (which would
 * land in shell history).
 *
 *   node scripts/set-admin-password.mjs
 *
 * It prints ADMIN_PASSWORD_HASH_B64 — the bcrypt hash, base64-encoded because
 * bcrypt's "$" characters get mangled by env-var interpolation. Paste that
 * into .env.local and into Vercel's environment variables.
 */
import bcrypt from "bcryptjs";
import readline from "node:readline";
import { Writable } from "node:stream";

// A writable that swallows output, so the typed password is never echoed.
let muted = false;
const mutedOut = new Writable({
  write(chunk, _enc, cb) {
    if (!muted) process.stdout.write(chunk);
    cb();
  },
});

const rl = readline.createInterface({
  input: process.stdin,
  output: mutedOut,
  terminal: true,
});

const ask = (q) =>
  new Promise((resolve) => {
    rl.question(q, (a) => resolve(a));
    muted = true;
  });

console.log("Set a new admin password.\n");

const pw = await ask("New password (min 8 characters): ");
muted = false;
console.log();

if (!pw || pw.length < 8) {
  console.error("Too short — the login requires at least 8 characters.");
  rl.close();
  process.exit(1);
}

const confirm = await ask("Type it again: ");
muted = false;
console.log();
rl.close();

if (pw !== confirm) {
  console.error("The two entries did not match. Nothing was changed.");
  process.exit(1);
}

const hash = await bcrypt.hash(pw, 12);
const b64 = Buffer.from(hash, "utf8").toString("base64");

console.log("Done. Put this in .env.local and in Vercel → Environment Variables:\n");
console.log(`ADMIN_PASSWORD_HASH_B64="${b64}"\n`);
console.log("Then redeploy on Vercel for it to take effect.");
