export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addYears } from "@/utils/date";
import { ensureAsnTable } from "@/lib/init";

type Ctx = { params: { id: string } };

export async function GET(_: Request, ctx: Ctx) {
  await ensureAsnTable();
  const id = Number(ctx.params.id);
  const found = await prisma.asn.findUnique({ where: { id } });
  if (!found) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
  return NextResponse.json(found);
}

export async function PUT(req: Request, ctx: Ctx) {
  await ensureAsnTable();
  const id = Number(ctx.params.id);
  const body = await req.json();
  const {
    nama, nomorPegawai, tmtPns, riwayatTmtKgb, riwayatTmtPangkat,
    jadwalKgbBerikutnya, jadwalPangkatBerikutnya
  } = body ?? {};

  const computedKgb = jadwalKgbBerikutnya ?? addYears(riwayatTmtKgb, 2);
  const computedPangkat = jadwalPangkatBerikutnya ?? addYears(riwayatTmtPangkat, 4);

  try {
    const updated = await prisma.asn.update({
      where: { id },
      data: {
        nama,
        nomorPegawai,
        tmtPns: tmtPns ? new Date(tmtPns) : null,
        riwayatTmtKgb: riwayatTmtKgb ? new Date(riwayatTmtKgb) : null,
        riwayatTmtPangkat: riwayatTmtPangkat ? new Date(riwayatTmtPangkat) : null,
        jadwalKgbBerikutnya: computedKgb ?? null,
        jadwalPangkatBerikutnya: computedPangkat ?? null
      }
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Gagal memperbarui data" }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: Ctx) {
  await ensureAsnTable();
  const id = Number(ctx.params.id);
  try {
    await prisma.asn.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Gagal menghapus data" }, { status: 500 });
  }
}
