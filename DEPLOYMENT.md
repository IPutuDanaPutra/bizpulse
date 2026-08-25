# Deploy BizPulse ke Vercel

## 1. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit: BizPulse"
git branch -M main
git remote add origin https://github.com/IPutuDanaPutra/bizpulse.git
git push -u origin main
```

## 2. Hubungkan ke Vercel
1. Buka [vercel.com/new](https://vercel.com/new)
2. Login/daftar pakai akun GitHub kamu
3. Klik **Import** di samping repo `bizpulse`
4. Framework Preset akan otomatis terdeteksi sebagai **Next.js** — biarkan default
5. Root Directory: biarkan kosong (kode ada langsung di root repo)

## 3. Environment Variables (opsional)
Build dasar **tidak butuh secret apa pun** (API key AI dibawa tiap pengguna lewat halaman Pengaturan, bukan project secret — lihat README bagian Arsitektur). Kalau mau override default negara buat Nager.Date:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | `ID` |

## 4. Deploy
Klik **Deploy**. Vercel akan build dan kasih URL preview (`bizpulse-xxxx.vercel.app`) dalam 1-2 menit.

## 5. Custom domain (opsional)
Di project settings → **Domains** → tambahkan domain kamu sendiri kalau ada, ikuti instruksi DNS yang muncul (biasanya cukup tambah 1 record CNAME/A di provider domain kamu).

## 6. Preview deployment tiap perubahan
Setiap kali kamu push branch baru atau buka Pull Request, Vercel otomatis bikin **preview URL terpisah** — berguna buat cek perubahan sebelum merge ke `main` (yang otomatis re-deploy ke URL production).

## 7. Cek sebelum pitch
- [ ] Buka URL production di device yang beda (desktop + HP) — pastikan responsive-nya sesuai spec
- [ ] Test isi API key sendiri di halaman Pengaturan, pastikan status "Terhubung" muncul
- [ ] Test dari Profil Bisnis kosong — pastikan Beranda nunjukin empty state (bukan cuaca lokasi default) sebelum lokasi diisi
- [ ] Favicon muncul benar di tab browser
