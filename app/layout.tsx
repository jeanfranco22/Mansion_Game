import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C & J House",
  description: "Un prototipo de exploración en primera persona dentro de una mansión.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
