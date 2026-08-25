"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressSearch } from "@/components/address-search";
import { FieldHint } from "@/components/field-hint";
import { ProfileWizard } from "@/components/profile-wizard";
import {
  AREA_TYPE_LABELS,
  BUSINESS_CATEGORY_LABELS,
  DELIVERY_STATUS_LABELS,
  EXPOSURE_LABELS,
  type AreaType,
  type BusinessCategory,
  type BusinessProfile,
  type DeliveryStatus,
  type Exposure,
} from "@/lib/types";
import { getProfile, saveProfile } from "@/lib/local-store";

const schema = z.object({
  businessName: z.string().min(1, "Isi nama bisnis kamu"),
  category: z.enum(["fnb_outdoor", "fnb_delivery", "retail", "jasa", "other"]),
  locationLabel: z.string().min(1, "Pilih lokasi usaha"),
  lat: z.number(),
  lon: z.number(),
  areaType: z.enum(["jalan_utama", "dalam_gang", "mall", "perumahan", "wisata"]),
  exposure: z.enum(["indoor", "outdoor", "both"]),
  deliveryStatus: z.enum(["none", "own", "platform"]),
  operatingHours: z.string().optional(),
  hasOutdoorSeating: z.boolean().optional(),
  isPerishable: z.boolean().optional(),
  isOnLocationService: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const DEFAULTS: FormValues = {
  businessName: "",
  category: "fnb_outdoor",
  locationLabel: "",
  lat: -6.2088,
  lon: 106.8456,
  areaType: "jalan_utama",
  exposure: "outdoor",
  deliveryStatus: "none",
};

export default function ProfilePage() {
  const [existingProfile, setExistingProfile] = useState<BusinessProfile | null | undefined>(undefined);

  const { control, register, handleSubmit, watch, reset, setValue, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    const existing = getProfile();
    setExistingProfile(existing);
    if (existing) {
      reset({
        businessName: existing.businessName,
        category: existing.category,
        locationLabel: existing.location.label,
        lat: existing.location.lat,
        lon: existing.location.lon,
        areaType: existing.areaType,
        exposure: existing.exposure,
        deliveryStatus: existing.deliveryStatus,
        operatingHours: existing.operatingHours,
        hasOutdoorSeating: existing.hasOutdoorSeating,
        isPerishable: existing.isPerishable,
        isOnLocationService: existing.isOnLocationService,
      });
    }
  }, [reset]);

  const category = watch("category");
  const isFnb = category === "fnb_outdoor" || category === "fnb_delivery";

  function onSubmit(values: FormValues) {
    const profile: BusinessProfile = {
      businessName: values.businessName,
      category: values.category,
      location: { lat: values.lat, lon: values.lon, label: values.locationLabel },
      areaType: values.areaType,
      exposure: values.exposure,
      deliveryStatus: values.deliveryStatus,
      operatingHours: isFnb || category === "jasa" ? values.operatingHours : undefined,
      hasOutdoorSeating: isFnb ? values.hasOutdoorSeating : undefined,
      isPerishable: category === "retail" ? values.isPerishable : undefined,
      isOnLocationService: category === "jasa" ? values.isOnLocationService : undefined,
    };
    saveProfile(profile);
    toast.success("Profil bisnis tersimpan.");
  }

  // Still reading localStorage — avoid a flash of the wizard before we know a profile already exists.
  if (existingProfile === undefined) return null;

  // First-time setup gets the guided, one-question-at-a-time flow. Editing later uses the full form below.
  if (existingProfile === null) return <ProfileWizard />;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div>
        <h1 className="text-xl font-semibold">Profil Bisnis</h1>
        <p className="text-sm text-muted-foreground">
          Semakin lengkap profil ini, semakin tajam rekomendasi harian yang BizPulse berikan — lokasi dan kategori
          usaha kamu langsung memengaruhi apa yang disarankan tiap hari.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identitas usaha</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Label htmlFor="businessName">Nama Bisnis</Label>
            <Input id="businessName" placeholder="cth. Kedai Kopi Senja" {...register("businessName")} />
            {formState.errors.businessName && (
              <p className="text-xs text-destructive">{formState.errors.businessName.message}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kategori usaha</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <ToggleGroup
                  variant="outline"
                  value={[field.value]}
                  onValueChange={(v) => v[0] && field.onChange(v[0] as BusinessCategory)}
                  className="flex-wrap justify-start"
                >
                  {Object.entries(BUSINESS_CATEGORY_LABELS).map(([value, label]) => (
                    <ToggleGroupItem key={value} value={value} className="px-3">
                      {label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lokasi</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Alamat</Label>
              <Controller
                control={control}
                name="locationLabel"
                render={({ field }) => (
                  <AddressSearch
                    value={field.value}
                    onSelect={(r) => {
                      field.onChange(r.label);
                      setValue("lat", r.lat);
                      setValue("lon", r.lon);
                    }}
                  />
                )}
              />
              {formState.errors.locationLabel && (
                <p className="text-xs text-destructive">{formState.errors.locationLabel.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="flex items-center gap-1.5">
                Tipe area <FieldHint text="Ini membantu kami tahu seberapa besar pengaruh cuaca ke usaha kamu." />
              </Label>
              <Controller
                control={control}
                name="areaType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => v && field.onChange(v as AreaType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(AREA_TYPE_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Paparan cuaca</Label>
              <Controller
                control={control}
                name="exposure"
                render={({ field }) => (
                  <ToggleGroup
                    variant="outline"
                    value={[field.value]}
                    onValueChange={(v) => v[0] && field.onChange(v[0] as Exposure)}
                  >
                    {Object.entries(EXPOSURE_LABELS).map(([value, label]) => (
                      <ToggleGroupItem key={value} value={value}>
                        {label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-1.5">
              Status delivery
              <FieldHint text="Kalau kamu punya delivery, hujan bisa jadi peluang, bukan cuma hambatan." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              control={control}
              name="deliveryStatus"
              render={({ field }) => (
                <ToggleGroup
                  variant="outline"
                  value={[field.value]}
                  onValueChange={(v) => v[0] && field.onChange(v[0] as DeliveryStatus)}
                  className="flex-wrap justify-start"
                >
                  {Object.entries(DELIVERY_STATUS_LABELS).map(([value, label]) => (
                    <ToggleGroupItem key={value} value={value} className="px-3">
                      {label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
          </CardContent>
        </Card>

        {(isFnb || category === "retail" || category === "jasa") && (
          <Card>
            <CardHeader>
              <CardTitle>Detail tambahan</CardTitle>
              <CardDescription>Menyesuaikan kategori usahamu.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {(isFnb || category === "jasa") && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="operatingHours">Jam operasional</Label>
                  <Input id="operatingHours" placeholder="cth. 08.00 - 21.00" {...register("operatingHours")} />
                </div>
              )}
              {isFnb && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="hasOutdoorSeating">Punya seating outdoor</Label>
                  <Controller
                    control={control}
                    name="hasOutdoorSeating"
                    render={({ field }) => (
                      <Switch id="hasOutdoorSeating" checked={field.value ?? false} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              )}
              {category === "retail" && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPerishable" className="flex items-center gap-1.5">
                    Barang mudah rusak kena cuaca
                    <FieldHint text="Membantu kami kasih rekomendasi soal penyimpanan/display saat cuaca ekstrem." />
                  </Label>
                  <Controller
                    control={control}
                    name="isPerishable"
                    render={({ field }) => (
                      <Switch id="isPerishable" checked={field.value ?? false} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              )}
              {category === "jasa" && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="isOnLocationService" className="flex items-center gap-1.5">
                    Layanan dilakukan di lokasi pelanggan
                    <FieldHint text="Kalau kamu kerja di lokasi pelanggan, cuaca outdoor lebih berpengaruh ke jadwal kamu." />
                  </Label>
                  <Controller
                    control={control}
                    name="isOnLocationService"
                    render={({ field }) => (
                      <Switch id="isOnLocationService" checked={field.value ?? false} onCheckedChange={field.onChange} />
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Button type="submit">Simpan</Button>
      </form>
    </div>
  );
}
