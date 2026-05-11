import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "VoicePrompt — Say it once. Use it anywhere.",
  description:
    "Turn natural speech into polished, tool-ready prompts for ChatGPT, Claude, Cursor, Midjourney, and 50+ AI tools.",
  openGraph: {
    title: "VoicePrompt — Say it once. Use it anywhere.",
    description:
      "Turn natural speech into polished, tool-ready prompts for ChatGPT, Claude, Cursor, Midjourney, and 50+ AI tools.",
    type: "website",
    locale: "en_US",
    siteName: "VoicePrompt",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoicePrompt — Say it once. Use it anywhere.",
    description:
      "Turn natural speech into polished, tool-ready prompts for ChatGPT, Claude, Cursor, Midjourney, and 50+ AI tools.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-dvh flex-col text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
