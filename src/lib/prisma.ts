// Initializes a single PrismaClient instance with the PrismaPg driver adapter
// (required in Prisma v7) and exports it for use across all server-side code.


// The singleton pattern (globalForPrisma) prevents connection exhaustion during
// Next.js hot-reloads in development. In production, module caching handles it.


// Usage:
//   import prisma from "@/lib/prisma";
//   const users = await prisma.user.findMany();


// Docs:
// - Prisma Client setup: https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration
// - Next.js singleton pattern: https://www.prisma.io/docs/orm/more/troubleshooting/nextjs
// - Prisma v7 driver adapters: https://www.prisma.io/docs/orm/overview/databases/postgresql#driver-adapters
// - Prisma Client API: https://www.prisma.io/docs/orm/reference/prisma-client-reference



import { PrismaClient } from "../generated/prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg"; 
const globalForPrisma = global as unknown as {
  prisma: PrismaClient; 
}; 
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL, 
}); 
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter, 
  }); 
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma; 
export default prisma; 