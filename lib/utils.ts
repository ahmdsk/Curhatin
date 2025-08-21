import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hashIP(ip?: string | null) {
  if (!ip) return undefined;
  // Simple, non-reversible hash (not for strong security)
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}