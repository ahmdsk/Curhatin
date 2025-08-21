"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase-admin";
import { postSchema } from "@/lib/schema";
import { hashIP } from "@/lib/utils";
import { FieldValue } from "firebase-admin/firestore";
import { checkRateLimit } from "@/lib/ratelimit";
import { filterBadwords } from "@/lib/badwords";

export async function createPostAction(formData: FormData): Promise<void> {
  const content = (formData.get("content") as string)?.trim();
  const mood = formData.get("mood") as any;
  const name = (formData.get("name") as string)?.trim() || "Anonim";
  const ipHeader = (formData.get("ip") as string) || undefined;
  const ipHash = await hashIP(ipHeader);

  const parsed = postSchema.safeParse({ content, mood, isAnonymous: name === "Anonim" });
  if (!parsed.success) {
    console.error("Invalid post data:", parsed.error);
    return;
  };

  const allowed = await checkRateLimit(ipHash!, "post", 5);
  if (!allowed) {
    console.warn("Rate limit exceeded for IP:", ipHash);
    return;
  };

  await db.collection("posts").add({
    content: filterBadwords(parsed.data.content),
    mood: parsed.data.mood,
    name,
    ipHash: ipHash ?? null,
    likes: 0,
    createdAt: FieldValue.serverTimestamp(),
    status: "published"
  });

  revalidatePath("/keluh-kesah");
}


export async function likePostAction(id: string, clientId: string) {
  const likeRef = db.collection("posts").doc(id).collection("likes").doc(clientId);
  const doc = await likeRef.get();
  if (doc.exists) return; // sudah like

  await likeRef.set({ at: Date.now() });
  await db.collection("posts").doc(id).update({
    likes: FieldValue.increment(1)
  });

  revalidatePath("/keluh-kesah");
}

export async function fetchPosts(limit = 50) {
  const snap = await db
    .collection("posts")
    // .where("status", "==", "published")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  const posts = snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      content: data.content,
      mood: data.mood,
      isAnonymous: data.isAnonymous,
      likes: data.likes ?? 0,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : null, // selalu jadi string/null
    };
  });

  return posts;
}

export async function createCommentAction(formData: FormData) {
  const content = (formData.get("content") as string)?.trim();
  const postId = formData.get("postId") as string;
  const parentId = formData.get("parentId") as string | undefined;
  const ipHeader = (formData.get("ip") as string) || undefined;
  const name = (formData.get("name") as string)?.trim() || "Anonim";
  const ipHash = await hashIP(ipHeader);

  if (!content || content.length < 2) return { ok: false, error: "Komentar terlalu pendek" };

  const allowed = await checkRateLimit(ipHash!, "comment", 10);
  if (!allowed) return { ok: false, error: "Terlalu sering komentar, coba lagi nanti." };

  await db.collection("posts").doc(postId).collection("comments").add({
    content: filterBadwords(content),
    parentId: parentId || null,
    name,
    ipHash: ipHash ?? null,
    createdAt: FieldValue.serverTimestamp(),
    likes: 0,
  });

  revalidatePath("/keluh-kesah");
}

export async function fetchComments(postId: string) {
  const snap = await db.collection("posts").doc(postId)
    .collection("comments")
    .orderBy("createdAt", "asc")
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate?.().toISOString() ?? null, // ✅ convert ke ISO string
    };
  });
}