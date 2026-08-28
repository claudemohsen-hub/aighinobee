"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    async function handleRegister() {
        const response = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, password }),
        })
        const data = await response.json()

        if (response.ok) {
            const loginResponse = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, password }),
            })
            if (loginResponse.ok) {
                router.push("/")
            } else {
                router.push("/login")
            }
        } else {
            alert(data.message)
        }
    }

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-200">ثبت‌نام</h1>
            <input
                placeholder="نام"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white"
            />
            <input
                type="tel"
                placeholder="شماره موبایل"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white"
            />
            <input
                type="password"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white"
            />
            <button
                onClick={handleRegister}
                className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition"
            >
                ثبت‌نام
            </button>
        </div>
    )
}