import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Nav from "@/components/nav";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Curhatin — Curhat, Saran, & Pujian",
  description:
    "Tempat berbagi keluh kesah secara anonim dengan UI modern dan nyaman.",
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          {children}
          <Toaster position="top-center" />
          {/* Footer mini */}
          <footer className="border-t py-8 text-center text-xs text-muted-foreground">
            <div className="container">
              © {new Date().getFullYear()} Curhatin — All rights reserved. Made
              with ❤️ by{" "}
              <a
                href="https://github.com/ahmdsk"
                target="_blank"
                rel="noopener noreferrer"
              >
                ahmdsk
              </a>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
