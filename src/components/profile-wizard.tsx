"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { AddressSearch } from "@/components/address-search";
import { BUSINESS_CATEGORY_LABELS, DELIVERY_STATUS_LABELS, type BusinessCategory, type BusinessProfile, type DeliveryStatus } from "@/lib/types";
import { saveProfile } from "@/lib/local-store";
import type { GeocodeResult } from "@/lib/geocode";

const STEPS = ["Nama usaha", "Lokasi", "Kategori", "Delivery"] as const;

// First-time setup: one question at a time (Beautiful UI's Approval Card pattern) — friendlier than a
// long form for a first impression. Editing later uses the full form instead (see profile/page.tsx).
export function ProfileWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState<GeocodeResult | null>(null);
  const [category, setCategory] = useState<BusinessCategory | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("none");

  const canProceed = [businessName.trim().length > 0, location !== null, category !== null, true][step];

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    finish();
  }

  function finish() {
    if (!location || !category) return;
    const profile: BusinessProfile = {
      businessName: businessName.trim(),
      category,
      location: { lat: location.lat, lon: location.lon, label: location.label },
      areaType: "jalan_utama",
      exposure: "outdoor",
      deliveryStatus,
    };
    saveProfile(profile);
    toast.success("Profil bisnis tersimpan.");
    router.push("/");
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-1 flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-[var(--primary)]" : "bg-muted"}`}
              />
            ))}
          </div>
          <CardTitle>{STEPS[step]}</CardTitle>
          <CardDescription>
            {step === 0 && "Nama usahamu, biar rekomendasi terasa personal."}
            {step === 1 && "Lokasi usaha menentukan data cuaca yang kami pakai."}
            {step === 2 && "Kategori usaha membentuk jenis rekomendasi yang relevan."}
            {step === 3 && "Kalau punya delivery, hujan bisa jadi peluang, bukan cuma hambatan."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {step === 0 && (
            <Input
              autoFocus
              placeholder="cth. Kedai Kopi Senja"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          )}
          {step === 1 && <AddressSearch value={location?.label ?? ""} onSelect={setLocation} />}
          {step === 2 && (
            <ToggleGroup
              variant="outline"
              value={category ? [category] : []}
              onValueChange={(v) => v[0] && setCategory(v[0] as BusinessCategory)}
              className="flex-wrap justify-start"
            >
              {Object.entries(BUSINESS_CATEGORY_LABELS).map(([value, label]) => (
                <ToggleGroupItem key={value} value={value} className="px-3">
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
          {step === 3 && (
            <ToggleGroup
              variant="outline"
              value={[deliveryStatus]}
              onValueChange={(v) => v[0] && setDeliveryStatus(v[0] as DeliveryStatus)}
              className="flex-wrap justify-start"
            >
              {Object.entries(DELIVERY_STATUS_LABELS).map(([value, label]) => (
                <ToggleGroupItem key={value} value={value} className="px-3">
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}

          <div className="flex items-center justify-between">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                Kembali
              </Button>
            ) : (
              <span />
            )}
            <Button onClick={next} disabled={!canProceed}>
              {step === STEPS.length - 1 ? "Selesai" : "Lanjut"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
