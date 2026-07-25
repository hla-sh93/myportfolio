import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Prisma over Neon's serverless driver (HTTPS/WebSocket) rather than a raw
 * 5432 TCP socket. Two reasons this matters:
 *  1. Serverless functions get no connection pooling on a raw socket.
 *  2. Port 5432 is blocked on some networks; 443 is not.
 * Without DATABASE_URL the client becomes a proxy that throws on use, so
 * every call site's try/catch falls through to the file store.
 */
function createPrismaClient() {
  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL missing");
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
    });
    return new PrismaClient({ adapter });
  } catch {
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive) return undefined;
        throw new Error(
          `Database is not configured. Set DATABASE_URL in .env to use ${String(prop)}.`
        );
      },
    });
  }
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
