import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLudo - Blockchain Ludo Game",
  description: "A Ludo game built with React and Next.js, integrated with Flare network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
