import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "../components/layout/Navbar";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ACCOUNTmarket",
  description: "Safe account marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <body
        className={`${syne.variable} ${inter.variable}`}
        style={{ background: '#0c0c0c', color: '#f0f0f0', minHeight: '100vh' }}
      >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}