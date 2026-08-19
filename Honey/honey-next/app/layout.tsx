import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import CartContext from "../Context/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "آیگینوبی — فروشگاه عسل طبیعی",
  description: "فروش عسل طبیعی و خالص",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartContext>
          <nav className="flex gap-6 justify-end bg-amber-800 text-white p-4">
            <Link href="/">خانه</Link>
            <Link href="/products">محصولات</Link>
            <Link href="/contactus">تماس با ما</Link>
          </nav>
          {children}
        </CartContext>
      </body>
    </html>
  );
}