import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Noni Social",
  description: "The ultimate social platform for teens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-accent selection:text-white`}
      >
        <div className="flex bg-black min-h-screen text-white">
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0 md:pl-20 lg:pl-64">
            <div className="mx-auto max-w-screen-xl px-4 py-8 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
