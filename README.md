# SF Design Solution — Static Website

Laman web statik (HTML + CSS + JavaScript, tiada framework) untuk **SF Design Solution**,
syarikat cabinet & reka bentuk dalaman di Bukit Jelutong, Shah Alam.

## Struktur Fail

```
sf-design-solution/
├── index.html          # Halaman utama
├── about.html          # Tentang kami
├── services.html       # Perkhidmatan
├── portfolio.html      # Portfolio (ada filter + lightbox)
├── contact.html        # Hubungi + borang
├── robots.txt          # SEO
├── sitemap.xml         # SEO
├── css/
│   └── style.css       # Semua gaya (design system + komponen)
├── js/
│   └── main.js         # Navigasi, animasi, filter, lightbox, borang
└── images/
    ├── logo.jpg        # Logo syarikat
    ├── hero.jpg        # Gambar latar hero
    └── project-01..12.jpg
```

## 1. Cara Tukar Gambar (PENTING)

Gambar sekarang ialah **placeholder** dari Unsplash sebagai demo. Tukar dengan
gambar sebenar dari Facebook/Instagram client supaya laman ini nampak tulen.

Cara paling mudah — **kekalkan nama fail yang sama**, cuma ganti kandungan fail:

| Fail | Gunakan untuk |
|------|---------------|
| `images/logo.jpg` | Logo rasmi syarikat |
| `images/hero.jpg` | Gambar projek paling cantik (latar hero, guna resolusi besar ~1600x1000) |
| `images/project-01.jpg` hingga `project-12.jpg` | Gambar projek (disyorkan nisbah 4:3, ~800x600 ke atas) |

Contoh langkah:
1. Save gambar dari FB page client ke folder `images/`.
2. Namakan semula ikut nama di atas (contoh: gambar dapur → `project-01.jpg`).
3. Refresh browser — siap.

> Guna gambar resolusi besar (minimum 1200px lebar) supaya tajam pada paparan retina.

## 2. Cara Edit Teks

Semua teks ada terus dalam fail `.html`. Cari sahaja perkataan yang nak ditukar.
Perkara yang **WAJIB disemak** dan diselaraskan dengan client:

- **Nombor telefon**: `+60197630972` (dalam `tel:` dan `wa.me:` links) — ada di semua halaman.
- **Alamat**: `I-Park 3, No. 7 Jalan Riyal U3/38, Bukit Jelutong, 40150 Shah Alam, Selangor`.
- **E-mel**: `info@sfdesign.my`.
- **Statistik** (`500+ projek`, `4.5/5`) dalam `index.html` — ubah ikut data sebenar.
- Kalau ada **nama domain rasmi**, kemas kini dalam `sitemap.xml`, `robots.txt` dan meta tag.

## 3. Borang Hubungi

Borang sekarang berfungsi tanpa server:

- Jika tiada tetapan, ia akan buka **WhatsApp** dengan mesej yang diisi automatik.
- Untuk simpan ke e-mel/DB, gunakan perkhidmatan percuma seperti
  [Formspree](https://formspree.io) atau [Web3Forms](https://web3forms.com), kemudian
  tambah atribut pada tag form:

  ```html
  <form class="form" data-form data-endpoint="https://formspree.io/f/XXXXXX" novalidate>
  ```

  Bila `data-endpoint` ada, borang akan hantar terus ke endpoint tersebut.

## 4. Cara Preview & Deploy

Preview tempatan (mana-mana satu):

```powershell
# Pilihan A: buka terus
start index.html

# Pilihan B: server tempatan (disyorkan)
python -m http.server 8080
# kemudian buka http://localhost:8080
```

Deploy percuma (pilih salah satu):

- **Netlify** / **Cloudflare Pages** / **Vercel**: drag & drop folder ini.
- **GitHub Pages**: push ke repo → Settings → Pages.

## 5. Design System Ringkas

- **Warna brand** (dari logo): navy `#1e3352` + kuning `#fae204`.
- **Font**: Poppins (tajuk) + Inter (teks) — dari Google Fonts.
- Semua warna/spacing dikawal melalui CSS variables di atas `css/style.css`
  (`:root`). Tukar nilai di situ untuk ubah seluruh tema.

## Nota

- Laman ini responsif (desktop, tablet, telefon) dan ada sokongan `prefers-reduced-motion`.
- Tiada dependency / build step — boleh terus dibuka dalam browser.
