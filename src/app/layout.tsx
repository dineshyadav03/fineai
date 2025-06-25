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
    <html lang="en">
      <body>
        <ConditionalNavbar />
        <main>
          {children}
        </main>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
} 