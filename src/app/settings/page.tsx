"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, CheckCircle2, Loader2, Info } from "lucide-react";
import { getApiKey, saveApiKey, clearApiKey, maskApiKey } from "@/lib/local-store";

export default function SettingsPage() {
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [testing, setTesting] = useState(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync read from localStorage on mount
    setSavedKey(getApiKey());
    setLoaded(true);
  }, []);

  async function testAndSave() {
    const key = input.trim();
    if (!key) return;
    setTesting(true);
    setTestError(null);
    try {
      const res = await fetch("/api/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setTestError(
          data.reason === "invalid"
            ? "Key ini nggak valid. Cek lagi apakah tersalin lengkap, tanpa spasi di awal/akhir."
            : "Nggak bisa menghubungi server AI saat ini. Coba lagi sebentar lagi."
        );
        return;
      }
      saveApiKey(key);
      setSavedKey(key);
      setInput("");
      toast.success("Tersimpan.");
    } catch {
      setTestError("Nggak bisa menghubungi server AI saat ini. Coba lagi sebentar lagi.");
    } finally {
      setTesting(false);
    }
  }

  function disconnect() {
    clearApiKey();
    setSavedKey(null);
    toast.success("Koneksi diputuskan.");
  }

  if (!loaded) return null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">API key untuk rekomendasi harian.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>Dipakai untuk membuat rekomendasi harian.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {savedKey ? (
            <>
              <Alert className="border-[var(--primary)]/40">
                <CheckCircle2 className="size-4 text-[var(--primary)]" />
                <AlertTitle>Terhubung</AlertTitle>
                <AlertDescription className="font-mono">{maskApiKey(savedKey)}</AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSavedKey(null)}>
                  Ganti key
                </Button>
                <Button variant="ghost" onClick={disconnect}>
                  Putuskan koneksi
                </Button>
              </div>
            </>
          ) : (
            <>
              <Alert>
                <KeyRound className="size-4" />
                <AlertTitle>Belum terhubung ke AI</AlertTitle>
                <AlertDescription>
                  Tanpa API key, BizPulse nggak bisa bikin rekomendasi harian. Cuaca dan kalender tetap tampil
                  seperti biasa.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="apiKeyInput" className="text-sm font-medium">
                  API Key
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    id="apiKeyInput"
                    type="password"
                    placeholder="sk-..."
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      setTestError(null);
                    }}
                    aria-invalid={!!testError}
                    className="font-mono"
                  />
                  <Button onClick={testAndSave} disabled={!input.trim() || testing}>
                    {testing && <Loader2 className="size-4 animate-spin" />}
                    Simpan & Uji Koneksi
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Kami dukung provider AI yang kompatibel dengan format OpenAI (contoh: DeepSeek).
                </p>
              </div>

              {testError && (
                <Alert className="border-[var(--error-amber)]/40 text-[var(--error-amber)]">
                  <AlertDescription className="text-[var(--error-amber)]">{testError}</AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Key kamu disimpan hanya di browser ini — tidak pernah dikirim ke server kami selain untuk memanggil AI
        secara langsung.
      </p>

      {/* "Tentang" doesn't fit the mobile bottom tab bar, so it lives here instead. */}
      <Link
        href="/about"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground md:hidden"
      >
        <Info className="size-4" /> Tentang BizPulse
      </Link>
    </div>
  );
}
