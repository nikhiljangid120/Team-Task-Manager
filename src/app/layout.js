import './globals.css';
import ClientProvider from '@/components/ClientProvider';

export const metadata = {
  title: 'Team Task Manager',
  description: 'Ethara.AI Full-Stack Assignment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProvider>
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
