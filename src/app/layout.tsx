import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgriYield Portal — Post-Harvest Risk Intelligence',
  description:
    'Geospatial dashboard tracking post-harvest storage risk across Rwandan districts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
