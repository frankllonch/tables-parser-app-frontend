"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);

  return (
    <html lang="en" className={`${inter.className} transition-colors`}>
      <body className="bg-transparent dark:bg-black text-black dark:text-white transition-colors">
        <header className="flex justify-between items-center p-6 border-b border-black dark:border-white">
          <h1 className="text-2xl font-bold">Table Extractor</h1>
          <button
            onClick={() => setDark(!dark)}
            className="border border-black dark:border-white px-4 py-1 rounded hover:opacity-70"
          >
            {dark ? "Light" : "Dark"}
          </button>
        </header>
        {children}
      </body>
    </html>
  );
}