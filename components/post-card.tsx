"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { commentSchema, type CommentInput } from "@/lib/schema";
import {
  likePostAction,
  createCommentAction,
  fetchComments,
} from "@/server/actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import { Heart, MessageSquare, ChevronDown, Send } from "lucide-react";

type Post = {
  id: string;
  content: string;
  mood: "curhat" | "pertanyaan" | "saran" | "pujian";
  createdAt?: any;
  likes?: number;
};

const moodMap: Record<Post["mood"], { label: string; className: string }> = {
  curhat: {
    label: "Curhat",
    className:
      "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 dark:from-red-900/30 dark:to-rose-900/30 dark:text-red-200",
  },
  pertanyaan: {
    label: "Pertanyaan",
    className:
      "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-200",
  },
  saran: {
    label: "Saran",
    className:
      "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 dark:from-amber-900/30 dark:to-yellow-900/30 dark:text-amber-200",
  },
  pujian: {
    label: "Pujian",
    className:
      "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 dark:from-emerald-900/30 dark:to-green-900/30 dark:text-emerald-200",
  },
};

export function PostCard({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false); // hanya tampil jika diperlukan
  const [comments, setComments] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState<number>(0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [likes, setLikes] = useState(post.likes ?? 0);
  const likeTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isPending, startTransition] = useTransition();

  // RHF + zod untuk komentar
  const form = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
      postId: post.id,
      name: "Anonim",
      parentId: "",
    },
  });

  // Ambil jumlah komentar awal (tanpa render form)
  useEffect(() => {
    let active = true;
    fetchComments(post.id)
      .then((list) => {
        if (!active) return;
        setCommentCount(list.length);
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      active = false;
    };
  }, [post.id]);

  // Lazy-load komentar saat dibuka
  useEffect(() => {
    if (!open) return;
    setLoadingComments(true);
    fetchComments(post.id)
      .then((list) => {
        setComments(list);
        setCommentCount(list.length);
      })
      .catch(() => toast.error("Gagal memuat komentar"))
      .finally(() => setLoadingComments(false));
  }, [open, post.id]);

  // Debounce + optimistic like
  async function likeWrapper() {
    if (likeTimeout.current) return;
    likeTimeout.current = setTimeout(() => (likeTimeout.current = null), 1500);

    const clientId = localStorage.getItem("clientId") || crypto.randomUUID();
    localStorage.setItem("clientId", clientId);

    try {
      setLikes((v) => v + 1);
      await likePostAction(post.id, clientId);
    } catch {
      setLikes((v) => v - 1);
      toast.error("Gagal menyukai");
    }
  }

  function onSubmit(values: CommentInput) {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("content", values.content);
        fd.append("postId", values.postId);
        if (values.name) fd.append("name", values.name);
        if (values.parentId) fd.append("parentId", values.parentId);

        await createCommentAction(fd);
        toast.success("Komentar terkirim");
        form.reset({
          content: "",
          postId: post.id,
          name: "Anonim",
          parentId: undefined,
        });
        const list = await fetchComments(post.id);
        setComments(list);
        setCommentCount(list.length);
        setShowForm(false);
      } catch {
        toast.error("Gagal kirim komentar");
      }
    });
  }

  const initials = useMemo(() => {
    const name = "Anonim";
    return name
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "group relative overflow-hidden border border-border/60",
        "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40",
        "hover:shadow-lg transition-all duration-300",
        "rounded-2xl"
      )}>
        {/* Decorative gradient ring */}
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-gradient-to-b from-primary/10 to-transparent" />

        <CardContent className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <Badge className={cn("capitalize px-2.5 py-1 rounded-full text-xs", moodMap[post.mood].className)}>
              {moodMap[post.mood].label}
            </Badge>

            <motion.button
              type="button"
              onClick={likeWrapper}
              whileTap={{ scale: 0.92 }}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm",
                "hover:bg-accent hover:text-accent-foreground transition-colors"
              )}
              aria-label="Suka"
            >
              <Heart className="h-4 w-4" />
              <span className="tabular-nums">{likes}</span>
            </motion.button>
          </div>

          <p className="text-[15px] leading-7 whitespace-pre-wrap">{post.content}</p>

          <div className="text-xs text-muted-foreground">
            {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="tabular-nums">{commentCount}</span>
              <span>komentar</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  open ? "rotate-180" : "rotate-0"
                )}
              />
            </Button>

            <div className="flex items-center gap-2">
              {!showForm && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setOpen(true);
                    setShowForm(true);
                  }}
                  className="rounded-full"
                >
                  Tulis komentar
                </Button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2 space-y-3"
              >
                {/* Form hanya jika diperlukan */}
                <AnimatePresence initial={false}>
                  {showForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-3 rounded-xl border bg-card/50 p-3"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nama (opsional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Anonim jika kosong" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Komentar</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Tulis komentar..."
                                    className="min-h-[88px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex items-center gap-2">
                            <Button type="submit" size="sm" disabled={isPending}>
                              {isPending ? "Mengirim..." : (
                                <span className="inline-flex items-center gap-1">
                                  <Send className="h-4 w-4" /> Kirim
                                </span>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowForm(false)}
                            >
                              Batal
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* List komentar */}
                <div className="space-y-2.5">
                  {loadingComments ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-16 w-full animate-pulse rounded-xl border bg-muted/30"
                        />
                      ))}
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((c) => (
                      <div key={c.id} className="rounded-xl border p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                            {String(c.name || "A")
                              .split(" ")
                              .map((s: string) => s[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-sm">
                              <span className="font-medium">{c.name || "Anonim"}</span>
                              {c.createdAt && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(c.createdAt).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <div className="mt-1 text-sm leading-6 break-words">{c.content}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border p-4 text-sm text-muted-foreground">
                      Belum ada komentar.
                      {!showForm && (
                        <Button
                          variant="link"
                          className="px-1"
                          onClick={() => setShowForm(true)}
                        >
                          Jadilah yang pertama berkomentar
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
