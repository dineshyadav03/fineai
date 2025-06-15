'use client';

import Link from 'next/link';
import { CloudArrowUpIcon, RocketLaunchIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-trainy-accent-blue to-trainy-accent-dark-blue text-white py-20 md:py-32 flex-grow flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-6">
            {"Fine-tune AI Models with Your Own Data"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-2 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-lg md:text-xl mb-10 opacity-90"
          >
            Upload, customize, and download your AI model using Cohere's API – no code needed.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/auth" className="btn-primary bg-white text-trainy-accent-blue hover:bg-gray-100">
              Get Started
            </Link>
            <Link href="/contact" className="px-6 py-2 rounded-lg border border-white text-white font-medium shadow-sm hover:bg-white hover:text-trainy-accent-blue transition-colors duration-200">
              Contact Support
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="mt-20 rounded-lg border border-white border-opacity-30 bg-white bg-opacity-10 p-4 shadow-xl backdrop-blur-sm"
          >
            <div className="w-full overflow-hidden rounded-md border border-white border-opacity-20">
              <img
                src="https://assets.aceternity.com/pro/aceternity-landing.webp"
                alt="FineAI Dashboard Preview"
                className="aspect-[16/9] h-auto w-full object-cover"
                width={1000}
                height={562}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-trainy-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-trainy-text-primary">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center transition-transform duration-300 hover:scale-105">
              <CloudArrowUpIcon className="h-16 w-16 text-trainy-accent-blue mx-auto mb-6" />
              <h3 className="text-xl font-display font-semibold mb-3 text-trainy-text-primary">
                Upload Your Dataset
              </h3>
              <p className="text-trainy-text-secondary">
                Easily upload your CSV or JSON data through our intuitive interface.
              </p>
            </div>
            <div className="card text-center transition-transform duration-300 hover:scale-105">
              <RocketLaunchIcon className="h-16 w-16 text-trainy-accent-blue mx-auto mb-6" />
              <h3 className="text-xl font-display font-semibold mb-3 text-trainy-text-primary">
                Train with Cohere API
              </h3>
              <p className="text-trainy-text-secondary">
                Leverage Cohere's powerful API to fine-tune models with your custom dataset.
              </p>
            </div>
            <div className="card text-center transition-transform duration-300 hover:scale-105">
              <ComputerDesktopIcon className="h-16 w-16 text-trainy-accent-blue mx-auto mb-6" />
              <h3 className="text-xl font-display font-semibold mb-3 text-trainy-text-primary">
                Download or Test Your Model
              </h3>
              <p className="text-trainy-text-secondary">
                Once trained, access and test your fine-tuned model directly from your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-trainy-text-primary text-white py-8">
        <div className="max-w-7xl mx-auto text-center px-6">
          <div className="flex justify-center space-x-6 mb-4">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">
              About
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">
              Contact
            </Link>
            <Link href="/terms" className="text-gray-300 hover:text-white transition-colors duration-200">
              Terms
            </Link>
          </div>
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} FineAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 