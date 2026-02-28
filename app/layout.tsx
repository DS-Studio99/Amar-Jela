import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

export const metadata: Metadata = {
    title: 'আমার জেলা — বাংলাদেশ জেলা তথ্য',
    description: 'বাংলাদেশের প্রতিটি জেলার সকল তথ্য এক জায়গায়',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Amar Jela',
    },
};

export const viewport = {
    themeColor: '#1a9e5c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="bn" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className="font-bengali bg-gray-100 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
                <NextTopLoader color="#39FF14" showSpinner={false} />
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
