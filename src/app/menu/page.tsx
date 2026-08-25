"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Loader2, Trash2, Tag, ImageIcon, FileText, FileSpreadsheet, AlertTriangle } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { getApiKey, getMenuItems, saveMenuItems } from "@/lib/local-store";
import { parseSpreadsheet, type SpreadsheetPreview } from "@/lib/parse-spreadsheet";

interface DraftRow {
  name: string;
  category: string;
  price: string;
}

const ACCEPT = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
  "text/csv": [".csv"],
};

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [processingLabel, setProcessingLabel] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftRow[] | null>(null);
  const [draftSource, setDraftSource] = useState<MenuItem["source"]>("manual");
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetPreview | null>(null);
  const [colMap, setColMap] = useState<{ name: string; category: string; price: string }>({
    name: "",
    category: "",
    price: "",
  });
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractionWarning, setExtractionWarning] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync read from localStorage on mount
    setItems(getMenuItems());
  }, []);

  // Some items missing a price is a soft signal that part of the source (usually a photo) wasn't fully
  // legible — not a hard failure, just a nudge to check the editable table below.
  function checkExtractionQuality(items: Array<{ price?: number | null }> | undefined) {
    if (items && items.length > 0 && items.some((it) => it.price == null)) {
      setExtractionWarning("Sebagian teks nggak terbaca jelas. Cek dan lengkapi manual di tabel di bawah.");
    } else {
      setExtractionWarning(null);
    }
  }

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setDraft(null);
    setSpreadsheet(null);
    setUploadError(null);
    setExtractionWarning(null);

    if (file.type.startsWith("image/")) {
      const apiKey = getApiKey();
      if (!apiKey) return setUploadError("Tambahkan API key di Settings dulu untuk membaca gambar menu.");
      setProcessingLabel("Membaca gambar menu...");
      try {
        const dataUrl = await fileToDataUrl(file);
        const res = await fetch("/api/menu/extract-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey, imageDataUrl: dataUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setDraft(toDraftRows(data.items));
        setDraftSource("image");
        checkExtractionQuality(data.items);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Gagal membaca gambar menu.");
      } finally {
        setProcessingLabel(null);
      }
    } else if (file.type === "application/pdf") {
      const apiKey = getApiKey();
      if (!apiKey) return setUploadError("Tambahkan API key di Settings dulu untuk membaca PDF.");
      setProcessingLabel("Mengekstrak dari PDF...");
      try {
        const fileBase64 = await fileToBase64(file);
        const res = await fetch("/api/menu/extract-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ apiKey, fileBase64 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setDraft(toDraftRows(data.items));
        setDraftSource("pdf");
        checkExtractionQuality(data.items);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Gagal membaca PDF.");
      } finally {
        setProcessingLabel(null);
      }
    } else {
      setProcessingLabel("Membaca spreadsheet...");
      try {
        const preview = await parseSpreadsheet(file);
        setSpreadsheet(preview);
        setColMap({ name: preview.headers[0] ?? "", category: "", price: preview.headers[1] ?? "" });
      } catch {
        setUploadError("Gagal membaca spreadsheet.");
      } finally {
        setProcessingLabel(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected: () =>
      setUploadError("Format ini belum didukung. Pakai gambar (JPG/PNG), PDF, atau spreadsheet (XLSX/CSV)."),
    accept: ACCEPT,
    multiple: false,
  });

  function applyColumnMapping() {
    if (!spreadsheet || !colMap.name) return;
    const headers = spreadsheet.headers;
    const nameIdx = headers.indexOf(colMap.name);
    const catIdx = headers.indexOf(colMap.category);
    const priceIdx = headers.indexOf(colMap.price);
    const rows: DraftRow[] = spreadsheet.rows.map((r) => ({
      name: r[nameIdx] ?? "",
      category: catIdx >= 0 ? (r[catIdx] ?? "") : "",
      price: priceIdx >= 0 ? (r[priceIdx] ?? "") : "",
    }));
    setDraft(rows);
    setDraftSource("spreadsheet");
    setSpreadsheet(null);
  }

  function updateDraftRow(i: number, field: keyof DraftRow, value: string) {
    setDraft((d) => (d ? d.map((row, idx) => (idx === i ? { ...row, [field]: value } : row)) : d));
  }

  function removeDraftRow(i: number) {
    setDraft((d) => (d ? d.filter((_, idx) => idx !== i) : d));
  }

  function confirmSave() {
    if (!draft) return;
    const newItems: MenuItem[] = draft
      .filter((r) => r.name.trim())
      .map((r) => ({
        id: crypto.randomUUID(),
        name: r.name.trim(),
        category: r.category.trim() || undefined,
        price: r.price.trim() ? Number(r.price.replace(/[^\d.]/g, "")) : undefined,
        source: draftSource,
        addedAt: new Date().toISOString(),
      }));
    const merged = [...items, ...newItems];
    saveMenuItems(merged);
    setItems(merged);
    setDraft(null);
    toast.success(`${newItems.length} produk ditambahkan.`);
  }

  function deleteItem(id: string) {
    const merged = items.filter((i) => i.id !== id);
    saveMenuItems(merged);
    setItems(merged);
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Menu & Produk</h1>
        <p className="text-sm text-muted-foreground">
          Upload menu atau daftar produk supaya rekomendasi AI bisa sebut nama produk spesifik.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
              isDragActive ? "border-[var(--signal-blue)] bg-[var(--signal-blue)]/5" : "border-border"
            }`}
          >
            <input {...getInputProps()} />
            <ImagePlus className="size-8 text-muted-foreground" />
            <p className="text-sm font-medium">Tarik file ke sini, atau klik untuk pilih</p>
            <p className="text-xs text-muted-foreground">Foto menu (.jpg/.png), PDF, atau spreadsheet (.xlsx/.csv)</p>
          </div>
        </CardContent>
      </Card>

      {uploadError && (
        <Alert className="border-[var(--error-red)]/40">
          <AlertTriangle className="size-4 text-[var(--error-red)]" />
          <AlertDescription className="text-[var(--error-red)]">{uploadError}</AlertDescription>
        </Alert>
      )}

      {processingLabel && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> {processingLabel}
        </div>
      )}

      {spreadsheet && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="size-4" /> Pilih kolom
            </CardTitle>
            <CardDescription>Kolom mana yang berisi nama produk, kategori, dan harga?</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(["name", "category", "price"] as const).map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-xs text-muted-foreground">
                    {field === "name" ? "Nama produk" : field === "category" ? "Kategori (opsional)" : "Harga"}
                  </label>
                  <Select value={colMap[field]} onValueChange={(v) => v && setColMap((m) => ({ ...m, [field]: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih kolom" />
                    </SelectTrigger>
                    <SelectContent>
                      {spreadsheet.headers.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
            <Button onClick={applyColumnMapping} disabled={!colMap.name} className="self-start">
              Terapkan
            </Button>
          </CardContent>
        </Card>
      )}

      {draft && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {draftSource === "image" && <ImageIcon className="size-4" />}
              {draftSource === "pdf" && <FileText className="size-4" />}
              {draftSource === "spreadsheet" && <FileSpreadsheet className="size-4" />}
              Hasil ekstraksi — periksa dulu sebelum disimpan
            </CardTitle>
            <CardDescription>Koreksi apa saja yang kurang tepat.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {extractionWarning && (
              <Alert>
                <AlertTriangle className="size-4 text-muted-foreground" />
                <AlertDescription>{extractionWarning}</AlertDescription>
              </Alert>
            )}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {draft.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Input value={row.name} onChange={(e) => updateDraftRow(i, "name", e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input value={row.category} onChange={(e) => updateDraftRow(i, "category", e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={row.price}
                          onChange={(e) => updateDraftRow(i, "price", e.target.value)}
                          className="font-mono"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" onClick={() => removeDraftRow(i)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex gap-2">
              <Button onClick={confirmSave}>Simpan ke Menu</Button>
              <Button variant="ghost" onClick={() => setDraft(null)}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Produk tersimpan ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada produk. Upload menu di atas untuk mulai.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead className="w-8" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.category ?? "-"}</TableCell>
                      <TableCell className="font-mono">
                        {item.price ? (
                          <span className="flex items-center gap-1">
                            <Tag className="size-3.5 text-muted-foreground" /> Rp{item.price.toLocaleString("id-ID")}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-sm" onClick={() => deleteItem(item.id)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function toDraftRows(items: Array<{ name: string; category?: string | null; price?: number | null }> | undefined): DraftRow[] {
  return (items ?? []).map((it) => ({
    name: it.name ?? "",
    category: it.category ?? "",
    price: it.price != null ? String(it.price) : "",
  }));
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function fileToBase64(file: File): Promise<string> {
  const dataUrl = await fileToDataUrl(file);
  return dataUrl.split(",")[1] ?? "";
}
