import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import {
  getRateLimitIdentifier,
  loginEmailRateLimit,
  loginIpRateLimit,
} from "@/lib/ratelimit";

type Role = "ADMIN" | "EDITOR";

/* The role travels user → token → session. These used to live in an unused
   copy of this config (src/lib/auth.ts), which is why the callbacks here
   cast through `any`. */
declare module "next-auth" {
  interface User {
    role?: Role;
  }
  interface Session {
    user: { id: string; role?: Role } & DefaultSession["user"];
  }
}
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
  }
}

/** Thrown when sign-in is rate limited; the login form reads the code. */
class RateLimited extends CredentialsSignin {
  code = "rate_limited";
}

/**
 * A bcrypt hash of a random secret nobody holds. An unknown address is
 * compared against it so that it costs the same time as a wrong password,
 * and the admin address cannot be picked out by timing the response.
 */
const DUMMY_HASH = "$2b$12$a9GSvC/hw4FfOkMO0pdzAuP6wdDzdAMjgEVF75iPFDd95ayAx9QF.";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 0. Rate limit before any password work. Until now nothing stood
        //    between a script and unlimited guesses.
        const ip = getRateLimitIdentifier(request);
        const [byIp, byEmail] = await Promise.all([
          loginIpRateLimit.limit(`login:ip:${ip}`),
          loginEmailRateLimit.limit(`login:email:${email.toLowerCase()}`),
        ]);
        if (!byIp.success || !byEmail.success) throw new RateLimited();

        // 1. Database user (production path)
        try {
          const user = await db.user.findUnique({
            where: { email },
          });
          if (user) {
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (!passwordsMatch) return null;
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
            };
          }
        } catch {
          /* DB not configured — fall through to env admin */
        }

        // 2. Env-configured admin (works without a database):
        //    ADMIN_EMAIL + ADMIN_PASSWORD_HASH_B64 (base64 of the bcrypt
        //    hash — bcrypt's "$" chars get mangled by env interpolation,
        //    so the hash is stored encoded) in .env.local
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH_B64
          ? Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64, "base64").toString("utf8")
          : process.env.ADMIN_PASSWORD_HASH;
        if (adminEmail && adminHash && email === adminEmail) {
          const ok = await bcrypt.compare(password, adminHash);
          if (ok) {
            return {
              id: "env-admin",
              email: adminEmail,
              name: "Admin",
              role: "ADMIN",
            };
          }
          return null;
        }

        // 3. Unknown address: spend the time a real comparison would.
        await bcrypt.compare(password, DUMMY_HASH);
        return null;
      },
    }),
  ],
  pages: {
    // The only sign-in screen lives under /admin; "/login" does not exist and
    // sent failed logins to a 404.
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? token.sub ?? "";
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role;
      }
      return session;
    },
  },
});
