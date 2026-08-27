"use client"

import { useState, useEffect } from "react"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])

    useEffect(() => {
        fetchOrders()
    }, [])

    function fetchOrders() {
        fetch("/api/order")
            .then((res) => res.json())
            .then((data) => setOrders(data))
    }

    async function handleStatusChange(orderId: number, newStatus: string) {
        await fetch("/api/order", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: orderId,
                status: newStatus,
            }),
        })

        fetchOrders()
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                سفارش‌ها
            </h1>

            <div className="grid grid-cols-4 gap-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-lg shadow-md p-4 mb-4 text-black"
                    >
                        <p className="font-bold mb-2">
                            سفارش #{order.id}
                        </p>

                        <p>
                            موبایل: {order.phone}
                        </p>

                        <p>
                            آدرس: {order.province}, {order.city},{" "}
                            {order.address}
                        </p>

                        <p>
                            کد پستی: {order.postalCode}
                        </p>

                        <p className="mt-2 font-semibold">
                            جمع کل:{" "}
                            {order.totalPrice.toLocaleString("fa-IR")} تومان
                        </p>

                        <select
                            value={order.status}
                            onChange={(e) =>
                                handleStatusChange(
                                    order.id,
                                    e.target.value
                                )
                            }
                            className="border border-gray-300 rounded-lg p-2 w-full mt-3"
                        >
                            <option value="در حال بررسی">
                                در حال بررسی
                            </option>

                            <option value="در حال پردازش">
                                در حال پردازش
                            </option>

                            <option value="ارسال شد">
                                ارسال شد
                            </option>

                            <option value="تحویل داده شد">
                                تحویل داده شد
                            </option>
                        </select>
                    </div>
                ))}
            </div>
        </div>
    )
}
    