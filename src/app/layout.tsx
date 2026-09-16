import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css"; // Add this line

export const metadata: Metadata = {
  title: "AgriYield Portal",
  description: "NISR Hackathon 2026 - Post-Harvest Risk Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}