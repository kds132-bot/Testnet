import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '메타인지 체크리스트',
  description: '직장인을 위한 업무 메타인지 체크리스트',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen max-w-lg mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
