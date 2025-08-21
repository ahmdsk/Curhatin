"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, ShieldCheck, GaugeCircle, Sparkles } from "lucide-react";

export const dynamic = "force-static";

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-amber-100 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-black" />
      {/* Animated blobs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-500/10" />
      <div className="pointer-events-none absolute bottom-[-6rem] right-[-5rem] -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />

      {/* Hero */}
      <section className="container grid items-center gap-10 pb-20 pt-16 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-auto max-w-3xl text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Modern, clean, & responsive
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Curhat, Saran, dan Pujian {" "}
            <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
              Tanpa Ribet
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Curhatin adalah tempat aman untuk berbagi keluh kesah, bertanya, atau memberi apresiasi secara anonim.
            UI simple, UX mantap, dan cepat di semua perangkat.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/keluh-kesah" className="contents">
              <Button size="lg" className="rounded-full">
                Buka Feed
              </Button>
            </Link>
            <a href="#fitur" className="contents">
              <Button variant="secondary" size="lg" className="rounded-full">
                Lihat Fitur
              </Button>
            </a>
          </div>

          {/* Social proof / mini badges */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="secondary" className="rounded-full">Tanpa Login</Badge>
            <Badge variant="outline" className="rounded-full">Dark Mode</Badge>
            <Badge variant="outline" className="rounded-full">Gratis</Badge>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.25 }}
          className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3"
        >
          {[
            {
              title: "Anonim & Aman",
              desc: "Tanpa login. Data disimpan dengan Firestore & best-practice server actions.",
              Icon: ShieldCheck,
            },
            {
              title: "UI/UX Modern",
              desc: "Tailwind + shadcn/ui. Dark mode, cards, dan gestures-friendly.",
              Icon: Heart,
            },
            {
              title: "Cepat & Responsif",
              desc: "Next.js 15 App Router dengan caching & revalidate otomatis.",
              Icon: GaugeCircle,
            },
          ].map(({ title, desc, Icon }) => (
            <Card
              key={title}
              className="group rounded-3xl border bg-card/70 p-6 shadow-sm backdrop-blur transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border bg-background/70 p-2">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      </section>

      {/* Features grid */}
      <section id="fitur" className="container grid gap-8 pb-24">
        <div className="mx-auto max-w-2xl text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Fitur Utama</h2>
          <p className="text-muted-foreground">Sederhana tapi powerful untuk kebutuhan curhat & saran sehari-hari.</p>
        </div>

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              title: "Form Curhat Sekali Klik",
              desc: "Tulis isi hati, pilih mood, dan kirim. Tidak perlu daftar.",
            },
            {
              title: "Like & Sorting",
              desc: "Apresiasi cerita dengan tombol suka. Urutkan terbaru atau terpopuler.",
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl border bg-card/60 p-6 backdrop-blur"
            >
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA card */}
        <div className="mx-auto max-w-5xl">
          <Card className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/10 via-transparent to-amber-100/40 p-8 dark:from-primary/10 dark:to-amber-500/10">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-20 rounded-full bg-amber-300/30 blur-xl" />
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight">Siap untuk mulai curhat?</h3>
                <p className="text-sm text-muted-foreground">Semua cerita berharga. Mulai dari satu kalimat.</p>
              </div>
              <Link href="/keluh-kesah" className="contents">
                <Button size="lg" className="rounded-full">Mulai Curhat Sekarang</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
