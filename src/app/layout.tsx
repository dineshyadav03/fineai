import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from 'react-hot-toast';

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
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen bg-trainy-background">
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
} 