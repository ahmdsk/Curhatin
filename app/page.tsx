import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <main className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-amber-100 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />
      <section className="container grid items-center gap-10 pb-20 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">
            ✨ Modern, clean, & responsive
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Curhat, Saran, dan Pujian <span className="text-primary">Tanpa Ribet</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            KeluhKesah+ adalah tempat aman untuk berbagi keluh kesah, bertanya, atau memberi apresiasi secara anonim.
            UI simple, UX mantap, dan cepat di semua perangkat.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/keluh-kesah">
              <Button size="lg" className="rounded-full">Buka Feed</Button>
            </Link>
            <a href="#fitur">
              <Button variant="secondary" size="lg" className="rounded-full">Lihat Fitur</Button>
            </a>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { title: "Anonim & Aman", desc: "Tanpa login. Data disimpan dengan Firestore & best-practice server actions." },
            { title: "UI/UX Modern", desc: "Pakai Tailwind + shadcn/ui. Dark mode, cards, dan gestures-friendly." },
            { title: "Cepat & Responsif", desc: "Next.js 15 App Router dengan caching & revalidate otomatis." }
          ].map((f) => (
            <div key={f.title} className="rounded-3xl border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fitur" className="container grid gap-6 pb-24">
        <div className="mx-auto max-w-2xl text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Fitur Utama</h2>
          <p className="text-muted-foreground">Sederhana tapi powerful untuk kebutuhan curhat & saran sehari-hari.</p>
        </div>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border bg-card/50 p-6">
            <h3 className="font-semibold">Form Curhat Sekali Klik</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tinggal tulis isi hati, pilih mood, dan kirim. Tidak perlu daftar.
            </p>
          </div>
          <div className="rounded-3xl border bg-card/50 p-6">
            <h3 className="font-semibold">Like & Sorting</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Apresiasi cerita dengan tombol suka. Urutkan terbaru atau terpopuler.
            </p>
          </div>
        </div>
        <div className="text-center">
          <Link href="/keluh-kesah">
            <Button size="lg" className="rounded-full">Mulai Curhat Sekarang</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
