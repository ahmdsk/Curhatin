"use client";

import { useEffect, useRef, useState, useTransition } from "react";
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
import { Heart, MessageSquare } from "lucide-react";

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
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200",
  },
  pertanyaan: {
    label: "Pertanyaan",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200",
  },
  saran: {
    label: "Saran",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200",
  },
  pujian: {
    label: "Pujian",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-200",
  },
};

export function PostCard({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
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

  useEffect(() => {
    if (open) fetchComments(post.id).then(setComments);
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
        setComments(await fetchComments(post.id));
      } catch {
        toast.error("Gagal kirim komentar");
      }
    });
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center justify-between">
          <Badge className={cn("capitalize", moodMap[post.mood].className)}>
            {moodMap[post.mood].label}
          </Badge>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={likeWrapper}
            className="inline-flex items-center gap-1 rounded-full"
          >
            <Heart className="h-3.5 w-3.5" />
            <span>{likes}</span>
          </Button>
        </div>

        <p className="text-sm leading-7">{post.content}</p>
        <div className="text-xs text-muted-foreground">
          {post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
        </div>

        <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
          <MessageSquare className="h-4 w-4 mr-1" /> {comments.length} komentar
        </Button>

        {open && (
          <div className="mt-3 space-y-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
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
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Komentar</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tulis komentar..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Button type="submit" size="sm" disabled={isPending}>
                    {isPending ? "Mengirim..." : "Kirim"}
                  </Button>
                </div>
              </form>
            </Form>

            <div className="space-y-2">
              {comments.map((c) => (
                <div key={c.id} className="rounded-lg border p-2 text-sm">
                  <span className="font-medium">{c.name || "Anonim"}</span>:{" "}
                  {c.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
