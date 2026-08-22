import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import CartContext from "../Context/CartContext";
import CartCount from "./CartCount";

const vazir = Vazirmatn({
  subsets: ["arabic"],
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
      className={`${vazir.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartContext>
          <nav className="flex gap-6 justify-end bg-amber-800 text-white p-4">
            <Link href="/">خانه</Link>
            <Link href="/products">محصولات</Link>
            <Link href="/contactus">تماس با ما</Link>
            <CartCount/>
          </nav>
          {children}
        </CartContext>
      </body>
    </html>
  );
}