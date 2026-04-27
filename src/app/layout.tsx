import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "@uploadthing/react/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "BIU Lost & Found",
    template: "%s · BIU Lost & Found",
  },
  description:
    "Report and browse lost and found items on the Build Bright University campus.",
  openGraph: {
    title: "BIU Lost & Found",
    description:
      "Report and browse lost and found items on the Build Bright University campus.",
    type: "website",
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIU Lost & Found",
    description:
      "Report and browse lost and found items on the Build Bright University campus.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
