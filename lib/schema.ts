import { z } from "zod";

export const postSchema = z.object({
  content: z.string().min(5, "Minimal 5 karakter").max(1000, "Maksimum 1000 karakter"),
  mood: z.enum(["curhat", "pertanyaan", "saran", "pujian"]).default("curhat"),
  name: z.string().default("Anonim"),
});
export type PostInput = z.input<typeof postSchema>;

export type PostDoc = PostInput & {
  id: string;
  createdAt: Date;
  likes: number;
};

export const commentSchema = z.object({
  content: z.string().min(2, "Komentar terlalu pendek").max(500, "Maksimum 500 karakter"),
  postId: z.string(),
  parentId: z.string().optional(),
  name: z.string().default("Anonim"),
});
export type CommentInput = z.input<typeof commentSchema>;
