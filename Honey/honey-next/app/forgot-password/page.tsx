"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    async function handleLogin() {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password }),
        })
        const data = await response.json()
        if (response.ok) {
            router.push("/")
        } else {
            alert(data.message)
        }
    }

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-200">ورود</h1>
            <input type="tel" placeholder="شماره موبایل" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500" />
            <input type="password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500" />
            <button onClick={handleLogin} className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition">
                ورود
            </button>
            <Link href="/forgot-password" className="text-amber-200 text-sm underline mt-4 block text-center">
                رمز عبور را فراموش کرده‌اید؟
            </Link>
        </div>
    )
}