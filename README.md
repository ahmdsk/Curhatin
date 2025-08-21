# Curhatin (Next.js 15, App Router, Server Actions, Firestore)

Flow dan fitur menyerupai **web-keluh-kesah**, namun dengan UI/UX yang ditingkatkan memakai **Tailwind + shadcn/ui**. Full-stack monolith (server actions).

## ✨ Stack
- Next.js 15 (App Router) + Server Actions
- Firestore (Firebase Admin SDK) — akses hanya di server
- TailwindCSS + shadcn/ui components (komponen inti disertakan)
- TypeScript, Zod validation, next-themes (dark mode)

## ▶️ Jalankan Lokal
```bash
cp .env.example .env
# Isi kredensial service account (Admin SDK)
npm install
npm run dev
```

## 🔐 Environment Variables
Lihat `.env.example`. Gunakan Service Account JSON lalu isi variabel berikut:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` (ingat untuk escape newline menjadi `\n`)

## 🧱 Struktur
```
app/
  page.tsx                # Landing page
  keluh-kesah/page.tsx    # Feed + form posting
  layout.tsx
components/
  nav.tsx
  post-card.tsx
  ui/*                    # Komponen dasar shadcn-like
lib/
  firebase-admin.ts       # Inisialisasi Admin SDK
  schema.ts               # Zod schemas
  utils.ts                # helper cn(), hashIP()
server/
  actions.ts              # Server Actions (createPost, likePost, fetchPosts)
```

## 🗃️ Firestore
Collection: `posts`
```ts
{
  content: string;
  mood: "curhat" | "pertanyaan" | "saran" | "pujian";
  isAnonymous: boolean;
  ipHash?: string;
  likes: number;
  createdAt: Timestamp;
  status: "published";
}
```

## 🚀 Deploy
Deploy ke Vercel. Pastikan **Environment Variables** diisi di Project Settings. Jalankan `npm run build` dan `npm start` (otomatis di Vercel).

## 🧩 Catatan
- Runtime halaman Firestore di-set ke `nodejs` agar kompatibel dengan Admin SDK.
- Untuk komponen shadcn/ui lain, Anda bisa menambahkannya seiring kebutuhan.
- Rate limit & moderation tidak diaktifkan di starter ini — tambahkan sesuai kebutuhan (misal Upstash Ratelimit, Perspective, dll).
