import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";

// Memanggil font Inter untuk teks biasa (Body)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Memanggil font Libre Caslon untuk Judul (Headline)
const libreCaslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre",
});

export const metadata: Metadata = {
  title: "PasalPintar.id - Asisten Hukum Digital",
  description: "Pahami Hak dan Kewajiban Anda, Lebih Mudah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${libreCaslon.variable} h-full antialiased`}
    >
      {/* Kita set default font satu halaman menggunakan Inter */}
      <body className="min-h-full flex flex-col font-sans" style={{ fontFamily: "var(--font-inter)" }}>
        {children}
      </body>
    </html>
  );
}