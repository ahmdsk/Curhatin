"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, MoonStar, Heart } from "lucide-react";

export default function Nav() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          KeluhKesah<span className="text-primary">+</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/keluh-kesah">
            <Button variant="secondary" className="rounded-full">
              <Heart className="mr-2 h-4 w-4" />
              Lihat Feed
            </Button>
          </Link>
          <Button
            aria-label="Toggle theme"
            variant="ghost"
            size="icon"
            className={cn("rounded-full")}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}
