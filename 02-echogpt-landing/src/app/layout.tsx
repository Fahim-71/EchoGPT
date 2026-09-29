import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { SITE } from "@/lib/site";
import "./globals.css";

/**
 * Typography.
 *
 * `globals.css` reads `--font-geist-sans` / `--font-geist-mono`; the `geist`
 * package declares both through `next/font/local` over woff2 files shipped in
 * node_modules. Self-hosting means no font-CDN request on first paint, no
 * FOUT, and a build that works offline.
 */

const DESCRIPTION =
  "EchoGPT puts OpenAI, Anthropic, Google, Meta and Mistral models behind one picker in a secure Chrome sidebar. Summarise any webpage, explain highlighted text and compare answers side by side — with no third-party analytics.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "EchoGPT — Chat with multiple AI models in one secure sidebar",
    template: "%s · EchoGPT",
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: [
    "EchoGPT",
    "multi-model AI chat",
    "Chrome AI sidebar",
    "AI browser extension",
    "summarise webpage AI",
    "explain selected text",
    "compare AI models",
    "GPT-4o Claude Gemini Llama Mistral",
    "private AI assistant",
    "AppifyDevs",
  ],
  authors: [{ name: SITE.company }],
  creator: SITE.company,
  publisher: SITE.company,
  alternates: { canonical: "/" },
  category: "technology",
  openGraph: {
    type: "website",
    url: SITE.url,
    siteName: SITE.name,
    title: "EchoGPT — Every AI model, one secure sidebar",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoGPT — Every AI model, one secure sidebar",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0912" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Structured data so the listing can show as an application, not a blog post. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.name,
  applicationCategory: "BrowserApplication",
  operatingSystem: "Chrome, Windows, macOS, Linux",
  softwareVersion: SITE.extension.version,
  fileSize: SITE.extension.size,
  url: SITE.url,
  downloadUrl: SITE.chromeStore,
  description: SITE.tagline,
  author: { "@type": "Organization", name: SITE.company },
  publisher: { "@type": "Organization", name: SITE.company },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    category: "free",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: SITE.extension.rating,
    bestRating: 5,
    ratingCount: 24,
  },
  featureList: [
    "Chat with multiple AI models in one thread",
    "Summarise any webpage from the browser sidebar",
    "Explain selected text in place",
    "Compare two model responses side by side",
    "Image Studio and Video Studio",
    "Connectors and configurable API endpoint",
    "No third-party analytics; preferences stored locally",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="font-sans antialiased">
        {/*
          Scroll reveals render their `initial` style during SSR, so without
          JavaScript every revealed block would stay at opacity 0. This forces
          them visible for no-JS readers and for crawlers that do not execute
          scripts — the content is in the DOM either way, this just makes it
          paint.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // Static, author-controlled object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
