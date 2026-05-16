import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/providers/providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Cartix — Modern Commerce",
    template: "%s | Cartix",
  },
  description:
    "Cartix is a high-velocity ecommerce platform where velocity meets vision.",
  openGraph: {
    title: "Cartix — Modern Commerce",
    description: "High-velocity ecommerce. Velocity meets vision.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistMono.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ClerkProvider afterSignOutUrl="/"
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <Providers>
            {children}
            <Toaster richColors position="top-right" />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
