import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

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
      <body style={{ height: "100vh", overflow: "hidden" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
