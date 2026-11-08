import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduCoach Master - Central Platform for Coaching Management Systems",
  description:
    "Master management portal for coaching centers, multi-tenant accessibility control, instant website provisioning, and subscription billing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="w-full overflow-x-hidden">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-600 selection:text-white w-full max-w-full overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

