import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dao Overflow",
  description: "Dao Overflow is a stack overflow clone built by Daniel Dao.",
};

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"]
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfitSans.variable} ${outfitSans.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
