"use client";
import { useEffect, useMemo, useState } from "react";

type Asn = {
  id?: number;
  nama: string;
  nomorPegawai: string;
  tmtPns?: string | null;
  riwayatTmtKgb?: string | null;
  riwayatTmtPangkat?: string | null;
  jadwalKgbBerikutnya?: string | null;
  jadwalPangkatBerikutnya?: string | null;
};

export default function Page() {
  const [data, setData] = useState<Asn[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/asn", { cache: "no-store" });
        if (!res.ok) throw new Error(await res.text());
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        setError(e?.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return data;
    return data.filter(d =>
      d.nama?.toLowerCase().includes(k) ||
      d.nomorPegawai?.toLowerCase().includes(k)
    );
  }, [q, data]);

  return (
    <main style={{ padding: 16 }}>
      <h1>Monitoring ASN</h1>

      <div style={{ margin: "12px 0" }}>
        <input
          placeholder="Cari nama / nomor pegawai"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ padding: 8, width: 260 }}
        />
      </div>

      {loading && <p>Memuat…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!loading && !error && filtered.length === 0 && <p>Belum ada data</p>}

      {!loading && !error && filtered.length > 0 && (
        <table border={1} cellPadding={6}>
          <thead>
            <tr>
              <th>Nama</th>
              <th>No. Pegawai</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id ?? i}>
                <td>{r.nama}</td>
                <td>{r.nomorPegawai}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

