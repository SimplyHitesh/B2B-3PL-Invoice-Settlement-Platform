import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MswProvider } from "@/components/msw-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vecto Logistics | Enterprise POD-to-Cash Settlement Engine",
  description: "Enterprise POD-to-Cash Dispatch, Audit, and Invoice Settlement Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MswProvider>{children}</MswProvider>
      </body>
    </html>
  );
}

