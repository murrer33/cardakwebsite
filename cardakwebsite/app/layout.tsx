import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Çardak',
  description: 'Testler, fotoğraflar ve forum için bir platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' https://wubahsklurblyqlurwlf.supabase.co; object-src 'none';" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-10 py-6 text-center text-gray-500 dark:text-gray-400">
          <div className="container mx-auto px-4">
            <p>© {new Date().getFullYear()} Çardak. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
