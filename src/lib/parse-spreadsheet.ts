import * as XLSX from "xlsx";

export interface SpreadsheetPreview {
  headers: string[];
  rows: string[][];
}

export async function parseSpreadsheet(file: File): Promise<SpreadsheetPreview> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const table: unknown[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  const [headerRow, ...dataRows] = table;
  const headers = (headerRow ?? []).map((h) => String(h));
  const rows = dataRows
    .filter((r) => r.some((cell) => String(cell).trim() !== ""))
    .map((r) => headers.map((_, i) => String(r[i] ?? "")));

  return { headers, rows };
}
