import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import CartContext from "../Context/CartContext";
import Navbar from "./Navbar";

const vazir = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "آیگینوبی — فروشگاه عسل طبیعی",
  description: "فروش عسل طبیعی و خالص",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartContext>
          <Navbar />
          {children}
        </CartContext>
      </body>
    </html>
  );
}
