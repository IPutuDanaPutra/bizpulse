"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, CheckCircle2, Loader2 } from "lucide-react";
import { getApiKey, saveApiKey, clearApiKey, maskApiKey } from "@/lib/local-store";

export default function SettingsPage() {
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [testing, setTesting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync read from localStorage on mount
    setSavedKey(getApiKey());
    setLoaded(true);
  }, []);

  async function testAndSave() {
    if (!input.trim()) return;
    setTesting(true);
    try {
      const res = await fetch("/api/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: input.trim() }),
      });
      if (!res.ok) throw new Error();
      saveApiKey(input.trim());
      setSavedKey(input.trim());
      setInput("");
      toast.success("Terhubung ke DeepSeek AI.");
    } catch {
      toast.error("Key tidak valid atau gagal terhubung. Coba lagi.");
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
        <p className="text-sm text-muted-foreground">API key DeepSeek untuk rekomendasi harian.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Key</CardTitle>
          <CardDescription>Dipakai untuk membuat rekomendasi harian dari DeepSeek AI.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {savedKey ? (
            <>
              <Alert className="border-[var(--signal-blue)]/40">
                <CheckCircle2 className="size-4 text-[var(--signal-blue)]" />
                <AlertTitle>Terhubung ke DeepSeek AI</AlertTitle>
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
                <AlertTitle>Belum terhubung ke DeepSeek AI</AlertTitle>
                <AlertDescription>
                  Tanpa API key, Radar Usaha nggak bisa bikin rekomendasi harian. Cuaca dan kalender tetap tampil
                  seperti biasa.
                </AlertDescription>
              </Alert>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="font-mono"
                />
                <Button onClick={testAndSave} disabled={!input.trim() || testing}>
                  {testing && <Loader2 className="size-4 animate-spin" />}
                  Simpan & Uji Koneksi
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Key kamu disimpan hanya di browser ini — tidak pernah dikirim ke server kami selain untuk memanggil DeepSeek
        secara langsung.
      </p>
    </div>
  );
}
