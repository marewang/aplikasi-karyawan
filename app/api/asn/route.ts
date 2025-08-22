export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAsnTable } from "@/lib/init";
import { addYears } from "@/utils/date";
export async function GET() {
  await ensureAsnTable(); { return NextResponse.json(await prisma.asn.findMany({orderBy:{updatedAt:"desc"}})); }
export async function POST(req: Request) {
  await ensureAsnTable(); {
  const b = await req.json();
  const { nama, nomorPegawai, tmtPns, riwayatTmtKgb, riwayatTmtPangkat, jadwalKgbBerikutnya, jadwalPangkatBerikutnya } = b ?? {};
  if (!nama || !nomorPegawai) return NextResponse.json({error:"nama dan nomorPegawai wajib diisi"},{status:400});
  const created = await prisma.asn.create({ data: {
    nama, nomorPegawai,
    tmtPns: tmtPns?new Date(tmtPns):null,
    riwayatTmtKgb: riwayatTmtKgb?new Date(riwayatTmtKgb):null,
    riwayatTmtPangkat: riwayatTmtPangkat?new Date(riwayatTmtPangkat):null,
    jadwalKgbBerikutnya: jadwalKgbBerikutnya ?? addYears(riwayatTmtKgb,2),
    jadwalPangkatBerikutnya: jadwalPangkatBerikutnya ?? addYears(riwayatTmtPangkat,4),
  }});
  return NextResponse.json(created,{status:201});
}
