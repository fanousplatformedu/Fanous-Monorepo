export const normalizeIranMobile = (raw: string): { ok: boolean; e164?: string }=> {
  if (!raw) return { ok: false };
  let s = raw.replace(/\s+/g, "").replace(/-/g, "");
  if (s.startsWith("0098")) s = "+" + s.slice(2);
  if (s.startsWith("09")) s = "+98" + s.slice(1);
  if (/^9\d{9}$/.test(s)) s = "+98" + s;
  const ok = /^\+989\d{9}$/.test(s);
  return ok ? { ok: true, e164: s } : { ok: false };
}
