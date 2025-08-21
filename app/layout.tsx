import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/nav";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "KeluhKesah+ — Curhat, Saran, & Pujian",
  description: "Tempat berbagi keluh kesah secara anonim dengan UI modern dan nyaman.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          {children}
          <Toaster position="top-center" />
          <footer className="border-t">
            <div className="container py-8 text-sm text-muted-foreground">
              © {new Date().getFullYear()} KeluhKesah+. Dibuat dengan Next.js 15, Firestore, dan shadcn/ui.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
