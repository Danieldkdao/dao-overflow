import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "Dao Overflow",
  description: "Dao Overflow is a stack overflow clone built by Daniel Dao.",
};

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NuqsAdapter>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${outfitSans.variable} ${outfitSans.className} antialiased`}
        >
          <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableColorScheme
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </TooltipProvider>
        </body>
      </html>
    </NuqsAdapter>
  );
}
