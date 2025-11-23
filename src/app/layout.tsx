import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LifeOps™ | Clarity You Can Live In",
  description: "The daily operating system for your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} antialiased bg-background text-foreground min-h-screen selection:bg-primary/20`}
      >
        {/* Background Gradient Mesh */}
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background opacity-80" />
        <div className="fixed inset-0 z-[-1] bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        {children}
      </body>
    </html>
  );
}
