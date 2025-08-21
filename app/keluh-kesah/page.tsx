import { fetchPosts, createPostAction } from "@/server/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PostCard } from "@/components/post-card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PostForm from "@/components/post-form";

export const runtime = "nodejs"; // required for firebase-admin
export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const sp = await searchParams; // wajib di-await
  const posts = await fetchPosts(60);
  const q = (sp.q || "").toLowerCase();
  const sort = sp.sort === "top" ? "top" : "new";

  const filtered = posts
    .filter((p: any) => (q ? p.content.toLowerCase().includes(q) : true))
    .sort((a: any, b: any) => {
      if (sort === "top") return (b.likes ?? 0) - (a.likes ?? 0);
      return (
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
      );
    });

  return (
    <main className="container grid gap-8 py-10">
      <section className="grid gap-4 rounded-3xl border bg-card/50 p-6">
        <h1 className="text-xl font-semibold">Tulis Keluh Kesah</h1>
        <PostForm />
      </section>

      <section className="grid gap-4">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <h2 className="text-lg font-semibold">Feed</h2>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <form className="flex w-full items-center gap-2">
              <Input name="q" placeholder="Cari..." defaultValue={q} />
              <input type="hidden" name="sort" value={sort} />
              <Button type="submit" variant="secondary">
                Cari
              </Button>
            </form>
            <div className="flex items-center gap-1 rounded-full border p-1">
              <a
                href="?sort=new"
                className={
                  "px-3 py-1 text-sm rounded-full " +
                  (sort === "new" ? "bg-primary text-primary-foreground" : "")
                }
              >
                Terbaru
              </a>
              <a
                href="?sort=top"
                className={
                  "px-3 py-1 text-sm rounded-full " +
                  (sort === "top" ? "bg-primary text-primary-foreground" : "")
                }
              >
                Terpopuler
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Belum ada postingan yang cocok.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
