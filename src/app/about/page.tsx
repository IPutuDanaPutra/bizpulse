import { Separator } from "@/components/ui/separator";
import { DayStrip } from "@/components/day-strip";
import { CloudRain, CalendarDays, Package } from "lucide-react";
import type { WeatherDay, HolidayEntry } from "@/lib/types";

// Purely illustrative — the same day-strip pattern as the Dashboard, static, to open the page with
// the same visual identity instead of straight into a heading.
const SAMPLE_WEEK: WeatherDay[] = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(2026, 0, i + 1).toISOString(),
  weatherCode: 1,
  tempMax: 30,
  tempMin: 24,
  precipitationProbability: 40,
  precipitationSum: 2,
  windSpeedMax: 10,
  uvIndexMax: 7,
  confidenceTier: "actionable",
}));
const SAMPLE_HOLIDAY: HolidayEntry = {
  date: "2026-01-04",
  localName: "",
  name: "",
  isLongWeekend: false,
  daysUntil: 3,
};

const SIGNALS = [
  {
    icon: CloudRain,
    label: "Cuaca",
    body: "Prakiraan hari ini dan ke depan, termasuk peluang hujan dan intensitasnya — bukan cuma “cerah/hujan” yang kasar.",
  },
  {
    icon: CalendarDays,
    label: "Kalender",
    body: "Hari besar dan long weekend yang mendekat, karena momentum yang terlewat sering lebih mahal daripada modal yang terbuang.",
  },
  {
    icon: Package,
    label: "Produk kamu sendiri",
    body: "Kalau kamu tambahkan katalog produk/menu, sinyal di atas jadi rekomendasi yang menyebut produk spesifik kamu.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 p-6 py-12">
      <div className="flex flex-col-reverse items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold leading-snug">Tentang BizPulse</h1>
        <div className="w-full max-w-56">
          <DayStrip days={SAMPLE_WEEK} holiday={SAMPLE_HOLIDAY} selectedIndex={2} interactive={false} onSelect={() => {}} />
        </div>
      </div>

      <article className="flex flex-col gap-4 leading-[1.6] text-foreground/90">
        <h2 className="text-lg font-bold text-foreground">Masalah yang ingin kami jawab</h2>
        <p>
          Banyak keputusan operasional harian di usaha kecil — mau siapin stok berapa, kapan waktu tepat promosi,
          kapan harus lebih waspada — masih diputuskan berdasarkan feeling. Bukan karena pemiliknya males, tapi
          karena nggak ada sistem yang bikin data eksternal (cuaca, kalender, momentum pasar) gampang diakses dan
          langsung actionable dalam hitungan detik.
        </p>
        <p>BizPulse dibangun untuk mengisi gap itu.</p>
      </article>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-foreground">Bagaimana cara kerjanya</h2>
        <p className="leading-[1.6] text-foreground/90">Setiap hari, BizPulse menggabungkan tiga sinyal:</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SIGNALS.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-4">
              <s.icon className="size-6 text-[var(--primary)]" strokeWidth={1.5} />
              <p className="font-medium">{s.label}</p>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="leading-[1.6] text-foreground/90">
          Ketiganya diproses jadi satu rekomendasi aksi harian — bukan dashboard penuh angka yang harus kamu
          tafsirkan sendiri.
        </p>
      </div>

      <article className="flex flex-col gap-4 leading-[1.6] text-foreground/90">
        <h2 className="text-lg font-bold text-foreground">Filosofi di baliknya</h2>
        <p>
          BizPulse berpijak pada satu prinsip sederhana: kesadaran terhadap lingkungan sekitar (environmental
          awareness) adalah kebiasaan eksekusi yang paling sering diabaikan pelaku usaha kecil — bukan karena
          dianggap tidak penting, tapi karena belum ada alat yang membuatnya semudah membuka satu layar.
        </p>
        <blockquote className="border-l-2 border-[var(--primary)] pl-4 text-xl font-bold leading-snug text-foreground">
          Keputusan yang baik itu bukan soal insting yang lebih tajam, tapi soal informasi yang lebih dekat.
        </blockquote>
        <p>
          Kami percaya alat yang baik tidak menggantikan penilaian pemilik usaha — alat yang baik membuat penilaian
          itu lebih berbasis data, dan lebih cepat diambil.
        </p>

        <h2 className="mt-2 text-lg font-bold text-foreground">Privasi</h2>
        <p>
          API key AI kamu disimpan hanya di browser ini, tidak pernah dikirim ke server kami. Data cuaca dan
          kalender diambil dari sumber terbuka (Open-Meteo, Nager.Date) tanpa menyertakan informasi pribadi kamu.
        </p>
      </article>

      <Separator />

      <footer className="text-sm text-muted-foreground">
        <p>Hak cipta © 2026 I Putu Dana Putra. Seluruh hak dilindungi.</p>
        <p className="mt-1">
          <a href="https://github.com/IPutuDanaPutra" className="underline underline-offset-2 hover:text-foreground">
            GitHub
          </a>{" "}
          ·{" "}
          <a
            href="https://www.linkedin.com/in/iputudanaputra/"
            className="underline underline-offset-2 hover:text-foreground"
          >
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}
