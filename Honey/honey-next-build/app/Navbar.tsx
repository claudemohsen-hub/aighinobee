"use client"

import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { CartContextValue } from "../Context/CartContext"

export default function Navbar() {
    const { cart } = useContext(CartContextValue)
    const [user, setUser] = useState<{ id: number; phone: string; name: string | null } | null>(null)
    const [loading, setLoading] = useState(true)

    async function checkUser() {
        try {
            const response = await fetch("/api/me")
            if (response.ok) {
                const data = await response.json()
                setUser(data)
            } else {
                setUser(null)
            }
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkUser()
    }, [])

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" })
        setUser(null)
        window.location.href = "/"
    }

    return (
        <nav className="flex flex-wrap items-center gap-4 sm:gap-6 justify-between bg-amber-900/90 backdrop-blur border-b border-amber-800 text-amber-50 px-4 sm:px-8 py-4 sticky top-0 z-50">
            <Link href="/" className="text-lg font-bold text-amber-200 tracking-wide">
                آیگینوبی
            </Link>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                <Link href="/" className="hover:text-amber-300 transition">خانه</Link>
                <Link href="/products" className="hover:text-amber-300 transition">محصولات</Link>
                <Link href="/contactus" className="hover:text-amber-300 transition">تماس با ما</Link>
                <Link href="/cart" className="hover:text-amber-300 transition">
                    سبد خرید ({cart?.length || 0})
                </Link>

                {!loading && !user && (
                    <>
                        <Link href="/login" className="hover:text-amber-300 transition">ورود</Link>
                        <Link href="/register" className="hover:text-amber-300 transition">ثبت‌نام</Link>
                    </>
                )}

                {!loading && user && (
                    <>
                        <Link href="/account" className="hover:text-amber-300 transition">{user.name || "حساب من"}</Link>
                        <button onClick={handleLogout} className="hover:text-amber-300 transition">خروج</button>
                    </>
                )}
            </div>
        </nav>
    )
}
