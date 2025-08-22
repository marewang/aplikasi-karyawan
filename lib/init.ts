import { prisma } from "@/lib/prisma";
const g = globalThis as unknown as { __asn_init_done?: boolean };
export async function ensureAsnTable() {
  if (g.__asn_init_done) return;
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "Asn" (
      "id" SERIAL PRIMARY KEY,
      "nama" TEXT NOT NULL,
      "nomorPegawai" TEXT NOT NULL UNIQUE,
      "tmtPns" TIMESTAMP(3),
      "riwayatTmtKgb" TIMESTAMP(3),
      "riwayatTmtPangkat" TIMESTAMP(3),
      "jadwalKgbBerikutnya" TIMESTAMP(3),
      "jadwalPangkatBerikutnya" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL
    );
  `);
  g.__asn_init_done = true;
}
