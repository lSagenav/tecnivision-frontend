import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";

export const metadata: Metadata = {
  title: { default: "TecniVision", template: "%s | TecniVision" },
  description: "Catálogo de tecnología, accesorios, cámaras y soluciones de seguridad.",
  openGraph: {
    title: "TecniVision",
    description: "Tecnología y seguridad con atención personalizada.",
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" data-scroll-behavior="smooth">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 bg-slate-950">{children}</main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
