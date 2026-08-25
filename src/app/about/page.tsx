import { Separator } from "@/components/ui/separator";
import { CloudRain, CalendarDays, Package } from "lucide-react";

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
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold leading-snug">Tentang BizPulse</h1>
        <p className="text-lg text-muted-foreground">Kesadaran situasional harian untuk usaha kecil.</p>
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
