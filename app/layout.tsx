import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokefinder",
  description: "1gen pokedex",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-red-500">{children}</body>
    </html>
  );
}
