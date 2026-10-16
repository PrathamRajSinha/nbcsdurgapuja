export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((v) => v.trim())) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((v) => v.trim())) rows.push(row);
  return rows;
}

export function toCsv(header: string[], rows: (string | number | null | undefined)[][]) {
  const esc = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return "\uFEFF" + [header, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
}

export function downloadCsv(filename: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Accepts DD/MM/YYYY, DD-MM-YY, DD.MM.YYYY or YYYY-MM-DD; returns YYYY-MM-DD or null. */
export function parseDate(v: string): string | null {
  const s = v.trim();
  let y: number, m: number, d: number;
  let r = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (r) { y = +r[1]!; m = +r[2]!; d = +r[3]!; }
  else {
    r = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/);
    if (!r) return null;
    d = +r[1]!; m = +r[2]!; y = +r[3]!; if (y < 100) y += 2000;
  }
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export const fmtDate = (iso: string | null | undefined) => {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

export const inr = (n: number) => `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

export const normMethod = (v: string): "Cash" | "Cheque" | "UPI" | null => {
  const s = v.trim().toLowerCase();
  if (s.startsWith("cash")) return "Cash";
  if (s.startsWith("cheq") || s.startsWith("chq") || s.startsWith("check")) return "Cheque";
  if (s.includes("upi") || s.includes("gpay") || s.includes("phonepe") || s.includes("paytm") || s.includes("online")) return "UPI";
  return null;
};
