import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sujeito Pizza - A melhor pizzaria",
  description: "A melhor pizzaria do Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster

          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1ff3af",
              color: "#131313",
              borderColor: "#fff",
            },
          }}
        />
       
       {children}
      </body>
    </html>
  );
}
