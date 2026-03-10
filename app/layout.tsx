import { RootProvider } from "fumadocs-ui/provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { inter, jetbrains } from "@/lib/fonts";
import { keywords } from "@utils/index";
import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "@ui/styles";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://fixfx.wiki"),

  /** Canonical & Alternates */
  alternates: {
    canonical: "https://fixfx.wiki",
    languages: {
      "en-US": "https://fixfx.wiki",
    },
  },

  /** OpenGraph */
  openGraph: {
    type: "website",
    siteName: "FixFX",
    url: "https://fixfx.wiki",
    locale: "en_US",
    creators: ["@CodeMeAPixel"],
    title: "FixFX - FiveM & RedM Documentation Hub",
    description:
      "Comprehensive guides, tutorials, and documentation for FiveM, RedM, txAdmin, and the CitizenFX ecosystem. Your one-stop resource for server development.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "FixFX - Your FiveM & RedM Resource Hub",
      },
    ],
  },
  twitter: {
    title: "FixFX - FiveM & RedM Documentation Hub",
    card: "summary_large_image",
    creator: "@CodeMeAPixel",
    site: "@FixFXWiki",
    description:
      "Comprehensive guides, tutorials, and documentation for FiveM, RedM, txAdmin, and the CitizenFX ecosystem.",
    images: ["/twitter-image.png"],
  },
  /** OpenGraph */

  /** PWA */
  applicationName: "FixFX",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FixFX",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  /** PWA */

  title: {
    default: "FixFX - FiveM & RedM Documentation Hub",
    template: "%s | FixFX",
  },
  description:
    "Comprehensive guides, tutorials, and documentation for FiveM, RedM, txAdmin, and the CitizenFX ecosystem. Your one-stop resource for server development.",
  creator: "CodeMeAPixel",
  publisher: "FixFX",
  authors: [
    {
      url: "https://github.com/CodeMeAPixel",
      name: "Pixelated",
    },
  ],
  keywords: keywords,
  category: "Documentation",

  /** Icons */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/logo.png",
      },
    ],
  },
  /** Icons */

  /** Robots */
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE ?? undefined,
    yandex: process.env.YANDEX_VERIFICATION_CODE ?? undefined,
    other: {
      "msvalidate.01": process.env.BING_VERIFICATION_CODE ?? "",
    },
  },
  /** Robots */
};

// JSON-LD Structured Data for SEO
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FixFX",
  alternateName: ["FixFX Wiki", "FixFX Documentation"],
  url: "https://fixfx.wiki",
  description:
    "Comprehensive guides, tutorials, and documentation for FiveM, RedM, txAdmin, and the CitizenFX ecosystem.",
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    name: "FixFX",
    logo: {
      "@type": "ImageObject",
      url: "https://fixfx.wiki/logo.png",
      width: 512,
      height: 512,
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://fixfx.wiki/docs?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  sameAs: [
    "https://github.com/CodeMeAPixel/FixFX",
    "https://discord.gg/cYauqJfnNK",
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FixFX",
  url: "https://fixfx.wiki",
  logo: "https://fixfx.wiki/logo.png",
  description:
    "Documentation hub for FiveM, RedM, txAdmin, and the CitizenFX ecosystem.",
  foundingDate: "2024",
  sameAs: [
    "https://github.com/FixFXOSS/FixFX",
    "https://discord.gg/cYauqJfnNK",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "technical support",
    url: "https://github.com/FixFXOSS/FixFX/issues",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "FixFX Documentation",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    ratingCount: "100",
    bestRating: "5",
    worstRating: "1",
  },
};

const jsonLd = [websiteJsonLd, organizationJsonLd, softwareJsonLd];

export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* RSS Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="FixFX Blog RSS Feed"
          href="/blog/feed.xml"
        />
        {/* Atom Feed */}
        <link
          rel="alternate"
          type="application/atom+xml"
          title="FixFX Blog Atom Feed"
          href="/blog/atom.xml"
        />
        {/* JSON Feed */}
        <link
          rel="alternate"
          type="application/feed+json"
          title="FixFX Blog JSON Feed"
          href="/blog/feed.json"
        />
        {/* OpenSearch for browser search */}
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="FixFX Documentation Search"
          href="/opensearch.xml"
        />
        {/* LLMs.txt for AI crawlers */}
        <link rel="llms" href="/llms.txt" />
        <link rel="llms-full" href="/llms-full.txt" />
        {/* Humans.txt */}
        <link rel="author" href="/humans.txt" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://runtime.fivem.net" />
        <link rel="dns-prefetch" href="https://portal.cfx.re" />
      </head>
      <body className="dark:selection:text-fd-foreground antialiased [text-rendering:optimizeLegibility] selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-800">
        <QueryProvider>
          <RootProvider theme="dark">{children}</RootProvider>
        </QueryProvider>
        <Analytics />
        <Script
          async
          src="https://ackee.bytebrush.dev/tracker.js"
          data-ackee-server="https://ackee.bytebrush.dev"
          data-ackee-domain-id="cda143c2-45f9-4884-96b6-9e73ffecaf15"
        />
      </body>
    </html>
  );
}
