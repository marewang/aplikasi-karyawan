export function toISODateInput(dt?: string | Date | null) {
  if (!dt) return "";
  const d = typeof dt === "string" ? new Date(dt) : dt;
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function addYears(base: Date | string | null | undefined, years: number): Date | null {
  if (!base) return null;
  const d = new Date(base);
  if (isNaN(d.getTime())) return null;
  const out = new Date(d);
  out.setFullYear(d.getFullYear() + years);
  return out;
}
