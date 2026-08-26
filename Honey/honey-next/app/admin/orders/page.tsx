"use client"

import { useState, useEffect } from "react"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        fetch("/api/order")
            .then((res) => res.json())
            .then((data) => setOrders(data))
    }, [])

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">سفارش‌ها</h1>

            {orders.map((order) => (
                <div key={order.id} className="border-b py-4">
                    <p className="font-bold">سفارش #{order.id}</p>
                    <p>موبایل: {order.phone}</p>
                    <p>آدرس: {order.province}, {order.city}, {order.address}</p>
                    <p>کد پستی: {order.postalCode}</p>
                    <p>جمع کل: {order.totalPrice.toLocaleString("fa-IR")} تومان</p>
                </div>
            ))}
        </div>
    )
}