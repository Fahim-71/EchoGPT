import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import "./fonts.css";

/**
 * Fonts are self-hosted and declared in `./fonts.css` — see the note there for
 * why `next/font` cannot be used in the MV3 build. The result matches the web
 * app and the landing page exactly, with no network request on popup open.
 */
export const metadata: Metadata = {
  title: "EchoGPT — Multi-AI Chat Sidebar",
  description:
    "A redesign of the EchoGPT Chrome extension: a launcher popup, a full side panel, and a settings page that stop making sign-in the first thing you see.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0912" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
