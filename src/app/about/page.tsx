import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-[68ch] flex-col gap-6 p-6 py-12">
      <article className="flex flex-col gap-6 leading-relaxed text-foreground/90 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:leading-snug [&_h1]:text-foreground [&_h2]:mt-2 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_p]:leading-[1.6]">
        <h1>Tentang Radar Usaha</h1>

        <h2>Masalah yang ingin kami jawab</h2>
        <p>
          Banyak keputusan operasional harian di usaha kecil — mau siapin stok berapa, kapan waktu tepat promosi,
          kapan harus lebih waspada — masih diputuskan berdasarkan feeling. Bukan karena pemiliknya males, tapi
          karena nggak ada sistem yang bikin data eksternal (cuaca, kalender, momentum pasar) gampang diakses dan
          langsung actionable dalam hitungan detik.
        </p>
        <p>Radar Usaha dibangun untuk mengisi gap itu.</p>

        <h2>Bagaimana cara kerjanya</h2>
        <p>Setiap hari, Radar Usaha menggabungkan tiga sinyal:</p>
        <ol className="flex flex-col gap-2 pl-5 leading-[1.6] [&>li]:list-decimal">
          <li>
            <strong>Cuaca</strong> — prakiraan hari ini dan ke depan, termasuk peluang hujan dan intensitasnya,
            bukan cuma &ldquo;cerah/hujan&rdquo; yang kasar.
          </li>
          <li>
            <strong>Kalender</strong> — hari besar dan long weekend yang mendekat, karena momentum yang terlewat
            sering lebih mahal daripada modal yang terbuang.
          </li>
          <li>
            <strong>Produk kamu sendiri</strong> — kalau kamu tambahkan katalog produk/menu, sinyal di atas nggak
            cuma jadi info umum, tapi rekomendasi yang menyebut produk spesifik kamu.
          </li>
        </ol>
        <p>
          Ketiganya diproses jadi satu rekomendasi aksi harian — bukan dashboard penuh angka yang harus kamu
          tafsirkan sendiri.
        </p>

        <h2>Filosofi di baliknya</h2>
        <p>
          Radar Usaha berpijak pada satu prinsip sederhana: kesadaran terhadap lingkungan sekitar (environmental
          awareness) adalah kebiasaan eksekusi yang paling sering diabaikan pelaku usaha kecil — bukan karena
          dianggap tidak penting, tapi karena belum ada alat yang membuatnya semudah membuka satu layar. Keputusan
          yang baik itu bukan soal insting yang lebih tajam, tapi soal informasi yang lebih dekat.
        </p>
        <p>
          Kami percaya alat yang baik tidak menggantikan penilaian pemilik usaha — alat yang baik membuat penilaian
          itu lebih berbasis data, dan lebih cepat diambil.
        </p>

        <h2>Privasi</h2>
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
