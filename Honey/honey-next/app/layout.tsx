import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa" dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <nav className="flex gap-6 justify-end bg-amber-800 text-white p-4">
    <a href="/">خانه</a>
    <a href="/products">محصولات</a>
    <a href="/contactus">تماس با ما</a>
  </nav>
  {children}
</body>
    </html>
  );
}
