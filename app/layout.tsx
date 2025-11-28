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
    <html lang="pt-BR" className="h-full">
      <body className="font-inter bg-background text-identity-dark h-full m-0 p-0 overflow-x-hidden">
        <div className="min-h-full w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
