import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '../components/Navigation';

export const metadata: Metadata = {
  title: 'English World — Grades 4–5 Interactive Learning Platform',
  description:
    'Modern, engaging educational English platform for 4th and 5th-grade students with full textbook content, audio, interactive games, and progress tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-brand-bg text-brand-text antialiased selection:bg-brand-blue selection:text-white">
        <Navigation>{children}</Navigation>
      </body>
    </html>
  );
}
