import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';
import ConditionalNavbar from "@/components/ConditionalNavbar";

export const metadata: Metadata = {
  title: "FineAI - Fine-tune Your AI Models",
  description: "Upload, customize, and download your AI model using Cohere's API – no code needed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-900">
      <body className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen">
        <ConditionalNavbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="py-4 text-center">
          <p className="text-xs text-gray-500">
            developed and designed by dee
          </p>
        </footer>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
} 