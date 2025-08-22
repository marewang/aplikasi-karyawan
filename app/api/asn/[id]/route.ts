export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureAsnTable } from "@/lib/init";
import { addYears } from "@/utils/date";
type Ctx = { params: { id: string } };
export async function GET(_: Request, ctx: Ctx) {
  const id = Number(ctx.params.id);
  const found = await prisma.asn.findUnique({ where: { id } });
  if (!found) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  return NextResponse.json(found);
}
export async function PUT(req: Request, ctx: Ctx) {
  await ensureAsnTable(); {
  const id = Number(ctx.params.id);
  const b = await req.json();
  const { nama, nomorPegawai, tmtPns, riwayatTmtKgb, riwayatTmtPangkat, jadwalKgbBerikutnya, jadwalPangkatBerikutnya } = b ?? {};
  const updated = await prisma.asn.update({
    where: { id },
    data: {
      nama, nomorPegawai,
      tmtPns: tmtPns?new Date(tmtPns):null,
      riwayatTmtKgb: riwayatTmtKgb?new Date(riwayatTmtKgb):null,
      riwayatTmtPangkat: riwayatTmtPangkat?new Date(riwayatTmtPangkat):null,
      jadwalKgbBerikutnya: jadwalKgbBerikutnya ?? addYears(riwayatTmtKgb,2),
      jadwalPangkatBerikutnya: jadwalPangkatBerikutnya ?? addYears(riwayatTmtPangkat,4),
    }
  });
  return NextResponse.json(updated);
}
export async function DELETE(_: Request, ctx: Ctx) {
  await ensureAsnTable(); {
  const id = Number(ctx.params.id);
  await prisma.asn.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
