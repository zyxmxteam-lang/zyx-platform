import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZYX — Plataforma Interna",
  description: "Dashboard interno ZYX — Campañas, Ventas y Research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full`} style={{ background: "#080808" }}>
      <body style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
