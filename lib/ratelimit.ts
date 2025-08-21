import { db } from "@/lib/firebase-admin";

export async function checkRateLimit(ipHash: string, type: "post" | "comment", maxPerHour = 5) {
  if (!ipHash) return true; // kalau ga ada IP skip

  const key = `${ipHash}_${type}`;
  const ref = db.collection("ratelimit").doc(key);
  const snap = await ref.get();

  const now = Date.now();
  const oneHour = 1000 * 60 * 60;

  if (!snap.exists) {
    await ref.set({ count: 1, last: now });
    return true;
  }

  const data = snap.data()!;
  const diff = now - data.last;

  if (diff > oneHour) {
    await ref.set({ count: 1, last: now });
    return true;
  }

  if (data.count >= maxPerHour) {
    return false;
  }

  await ref.update({ count: data.count + 1, last: now });
  return true;
}
