"use client"
import { useState, useEffect } from "react"

export default function AccountPage() {
    const [user, setUser] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/me").then((res) => res.json()).then((data) => setUser(data))
    }, [])

    useEffect(() => {
        fetch("/api/my-orders").then((res) => res.json()).then((data) => setOrders(data))
    }, [])

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-200">حساب کاربری</h1>
            <p className="text-amber-50">نام: {user?.name}</p>
            <p className="text-amber-50">شماره موبایل: {user?.phone}</p>

            <h2 className="text-xl font-bold mt-6 mb-2 text-amber-200">سفارش‌های من</h2>
            {orders.length === 0 && <p className="text-gray-300">هنوز سفارشی ثبت نکرده‌اید</p>}
            {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-4 mb-3 text-black">
                    <p className="font-bold">سفارش #{order.id}</p>
                    <p>جمع کل: {order.totalPrice.toLocaleString("fa-IR")} تومان</p>
                    <p>وضعیت: {order.status}</p>
                </div>
            ))}
        </div>
    )
}
