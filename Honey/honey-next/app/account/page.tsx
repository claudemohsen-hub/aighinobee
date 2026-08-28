"use client"
import { useState, useEffect } from "react"

export default function AccountPage() {
    const [user, setUser] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/me")
            .then((res) => res.json())
            .then((data) => setUser(data))
    }, [])

    useEffect(() => {
        fetch("/api/my-orders")
            .then((res) => res.json())
            .then((data) => setOrders(data))
    }, [])

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-200">حساب کاربری</h1>

            <div className="bg-white/5 rounded-lg p-4 mb-6">
                <p className="text-amber-50">نام: {user?.name || "—"}</p>
                <p className="text-amber-50">شماره موبایل: {user?.phone}</p>
            </div>

            <h2 className="text-xl font-bold mb-3 text-amber-200">سفارش‌های من</h2>

            {orders.length === 0 && (
                <p className="text-gray-300">هنوز سفارشی ثبت نکرده‌اید</p>
            )}

            {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-md p-4 mb-4 text-black">
                    <div className="flex justify-between items-center mb-2">
                        <p className="font-bold">سفارش #{order.id}</p>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                            {order.status}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                        تاریخ ثبت: {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </p>

                    <div className="border-t border-gray-200 pt-2 mb-2">
                        {order.items.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm py-1">
                                <span>{item.name} × {item.quantity}</span>
                                <span>{(item.price * item.quantity).toLocaleString("fa-IR")} تومان</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-2 text-sm text-gray-700">
                        <p>آدرس: {order.province}، {order.city}، {order.address}</p>
                        <p>کد پستی: {order.postalCode}</p>
                        <p>شماره تماس: {order.phone}</p>
                    </div>

                    <p className="mt-3 font-bold text-amber-800">
                        مبلغ پرداختی: {order.totalPrice.toLocaleString("fa-IR")} تومان
                    </p>
                </div>
            ))}
        </div>
    )
}