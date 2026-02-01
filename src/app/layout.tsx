import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Token Safety Check API',
  description: 'Pre-trade safety analysis for tokens across multiple chains',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
