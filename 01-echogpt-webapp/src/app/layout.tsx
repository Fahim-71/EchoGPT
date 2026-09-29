import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

/**
 * Typography.
 *
 * `globals.css` composes `--font-sans` / `--font-mono` from the two variables
 * these classes declare. The `geist` package ships the woff2 files inside
 * node_modules and routes them through `next/font/local`, so the faces are
 * self-hosted and subset at build time — no request to a font CDN at build or
 * at runtime, and no FOUT.
 */

export const metadata: Metadata = {
  title: {
    default: "EchoGPT — AI chat workspace",
    template: "%s · EchoGPT",
  },
  description:
    "A redesigned EchoGPT: one calm chat workspace with a real model picker, side-by-side comparison, searchable history and a full command palette.",
  applicationName: "EchoGPT",
  keywords: ["AI chat", "LLM", "model comparison", "EchoGPT"],
};

export const viewport: Viewport = {
  // `viewport-fit` lets the composer sit above the home indicator on iOS.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0912" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only z-[100] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lift"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
