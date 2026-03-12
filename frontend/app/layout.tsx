import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "snip.ly — Minimal URL Shortener",
  description: "The minimal, developer-grade URL shortener. Create short links instantly, track analytics, and manage everything from a beautiful dashboard.",
  keywords: "url shortener, link shortener, short url, analytics, saas",
  openGraph: {
    title: "snip.ly — Minimal URL Shortener",
    description: "Create short links instantly and track analytics from a beautiful dashboard.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
