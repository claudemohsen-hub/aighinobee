"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<{
  id: number;
  phone: string;
  name: string | null;
} | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkUser() {
    try {
      const response = await fetch("/api/me");

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    setUser(null);
  }

  return (
    <nav className="flex gap-6 justify-right bg-amber-800 text-white p-4">
      <Link href="/">خانه</Link>
      <Link href="/products">محصولات</Link>
      <Link href="/contactus">تماس با ما</Link>

      <div className="mr-auto flex gap-4">
        {!loading && !user && (
          <>
            <Link href="/login">ورود</Link>
            <Link href="/register">ثبت‌نام</Link>
          </>
        )}

        {!loading && user && (
          <>
            <span>{user.name}</span>

            <button onClick={handleLogout}>
              خروج
            </button>
          </>
        )}

        <Link href="/cart">سبد خرید</Link>
      </div>
    </nav>
  );
}