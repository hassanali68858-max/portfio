import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers/providers";
import { Navbar } from "@/components/layout/navbar";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { site } from "@/lib/data";
import "./globals.css";

const inter = localFont({
  src: "./fonts/InterVariable-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.shortName}`,
  },
  description: site.shortBio,
  keywords: ["AI Engineer", "Full-Stack Engineer", "RAG", "LLM", "Next.js", "React", "Python", "Finland"],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.title}`,
    description: site.shortBio,
    url: site.url,
    siteName: site.name,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.shortBio },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-full bg-fg px-4 py-2 text-sm text-bg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <ScrollProgress />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
