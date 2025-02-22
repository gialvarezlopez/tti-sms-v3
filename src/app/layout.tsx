import type { Metadata } from "next";
import { TanStackProvider } from "@/components/providers/TanstackProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TTI SMS Message",
  description: "Milwaukee",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={figtree.className}>
        <NextTopLoader
          color="#2299DD"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl
          showSpinner
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        <AuthProvider>
          <TanStackProvider>
            {children}
            <Toaster />
          </TanStackProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
