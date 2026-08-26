"use client"

import { useState, useEffect } from "react"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [password, setPassword] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        if (isLoggedIn) {
            fetch("/api/order")
                .then((res) => res.json())
                .then((data) => setOrders(data))
        }
    }, [isLoggedIn])

    function handleLogin() {
        if (password === "1234") {
            setIsLoggedIn(true)
        } else {
            alert("رمز اشتباه است")
        }
    }

    if (!isLoggedIn) {
        return (
            <div className="p-6 max-w-sm mx-auto">
                <h1 className="text-2xl font-bold mb-4">ورود به پنل ادمین</h1>
                <input
                    type="password"
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                />
                <button
                    onClick={handleLogin}
                    className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition"
                >
                    ورود
                </button>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">سفارش‌ها</h1>
            <div className="grid grid-cols-4 gap-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-4 mb-4 text-black">
                        <p className="font-bold mb-2">سفارش #{order.id}</p>
                        <p>موبایل: {order.phone}</p>
                        <p>آدرس: {order.province}, {order.city}, {order.address}</p>
                        <p>کد پستی: {order.postalCode}</p>
                        <p className="mt-2 font-semibold">جمع کل: {order.totalPrice.toLocaleString("fa-IR")} تومان</p>
                    </div>
                ))}
            </div>
        </div>
    )
}