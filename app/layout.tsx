// app/layout.tsx
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

export const metadata = {
  title: 'Wakaba Tools',
  description: 'ブラウザで完結する安全・手軽なクライアントサイド・ユーティリティ・スイート',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <div style={{ display: 'flex', flex: 1 }}>
            <Sidebar />
            <main style={{ flex: 1, padding: '2rem', backgroundColor: '#f4f7f6' }}>
              {children}
            </main>
          </div>
          <Footer />
        </div>
      </body>
    </html>
  );
}