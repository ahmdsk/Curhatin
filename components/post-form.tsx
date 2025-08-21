"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostInput } from "@/lib/schema";
import { createPostAction } from "@/server/actions";

import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const moods = [
  { value: "curhat", label: "Curhat" },
  { value: "pertanyaan", label: "Pertanyaan" },
  { value: "saran", label: "Saran" },
  { value: "pujian", label: "Pujian" },
];

export default function PostForm() {
  const form = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { content: "", mood: "curhat", name: "Anonim" },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(values: PostInput) {
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("content", values.content);
        fd.append("mood", values.mood || "curhat");
        fd.append("name", values.name || "Anonim");

        await createPostAction(fd);
        toast.success("Curhat terkirim!");
        form.reset({ content: "", mood: "curhat", name: "Anonim" });
      } catch (e) {
        console.error(e);
        toast.error("Gagal kirim curhat");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isi curhat</FormLabel>
              <FormControl>
                <Textarea placeholder="Tulis keluh kesahmu di sini..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-2 md:grid-cols-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama (opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Anonim jika kosong" className="rounded-2xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mood</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue placeholder="Pilih mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="self-end">
            <Button type="submit" className="w-full rounded-full" disabled={isPending}>
              {isPending ? "Mengirim..." : "Kirim"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
