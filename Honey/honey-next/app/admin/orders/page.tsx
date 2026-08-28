"use client"
import { useState, useEffect } from "react"

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [password, setPassword] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [activeTab, setActiveTab] = useState<"pending" | "shipped" | "delivered">("pending")
    const [trackingInputs, setTrackingInputs] = useState<{ [key: number]: string }>({})
    const [showSettings, setShowSettings] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const ADMIN_PASSWORD_KEY = "adminPassword"
    const DEFAULT_PASSWORD = "1234"

    function getStoredPassword() {
        if (typeof window === "undefined") return DEFAULT_PASSWORD
        return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD
    }

    useEffect(() => {
        if (isLoggedIn) fetchOrders()
    }, [isLoggedIn])

    function fetchOrders() {
        fetch("/api/order")
            .then((res) => res.json())
            .then((data) => setOrders(data))
    }

    function handleLogin() {
        if (password === getStoredPassword()) {
            setIsLoggedIn(true)
        } else {
            alert("رمز عبور اشتباه است")
        }
    }

    function handleChangePassword() {
        if (currentPassword !== getStoredPassword()) {
            alert("رمز فعلی اشتباه است")
            return
        }
        if (!newPassword.trim() || newPassword.length < 4) {
            alert("رمز جدید باید حداقل ۴ کاراکتر باشد")
            return
        }
        if (newPassword !== confirmPassword) {
            alert("رمز جدید و تکرار آن مطابقت ندارند")
            return
        }
        localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword)
        alert("رمز عبور با موفقیت تغییر کرد")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setShowSettings(false)
    }

    async function markAsShipped(orderId: number) {
        const trackingCode = trackingInputs[orderId]
        if (!trackingCode || !trackingCode.trim()) {
            alert("لطفاً کد پیگیری تیپاکس را وارد کنید")
            return
        }

        await fetch("/api/order", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: orderId, status: "ارسال شد", trackingCode }),
        })

        fetchOrders()
    }

    async function markAsDelivered(orderId: number) {
        await fetch("/api/order", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: orderId, status: "تحویل داده شد" }),
        })
        fetchOrders()
    }

    if (!isLoggedIn) {
        return (
            <div className="p-6 max-w-sm mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-amber-200">ورود به پنل مدیریت</h1>
                <input
                    type="password"
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white"
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

    const pendingOrders = orders.filter((o) => o.status !== "ارسال شد" && o.status !== "تحویل داده شد")
    const shippedOrders = orders.filter((o) => o.status === "ارسال شد")
    const deliveredOrders = orders.filter((o) => o.status === "تحویل داده شد")

    const listToShow = activeTab === "pending" ? pendingOrders : activeTab === "shipped" ? shippedOrders : deliveredOrders

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-amber-200">پنل مدیریت سفارش‌ها</h1>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-amber-200 text-sm underline"
                >
                    تنظیمات رمز عبور
                </button>
            </div>

            {showSettings && (
                <div className="bg-white rounded-lg p-4 mb-6 max-w-sm text-black">
                    <h2 className="font-bold mb-3">تغییر رمز عبور</h2>
                    <input
                        type="password"
                        placeholder="رمز فعلی"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-full mb-2 text-sm text-black bg-white"
                    />
                    <input
                        type="password"
                        placeholder="رمز جدید"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-full mb-2 text-sm text-black bg-white"
                    />
                    <input
                        type="password"
                        placeholder="تکرار رمز جدید"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 w-full mb-3 text-sm text-black bg-white"
                    />
                    <button
                        onClick={handleChangePassword}
                        className="bg-amber-800 text-white text-sm px-4 py-2 rounded-lg w-full hover:bg-amber-900 transition"
                    >
                        ذخیره رمز جدید
                    </button>
                </div>
            )}

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === "pending" ? "bg-amber-800 text-white" : "bg-white/10 text-amber-100"}`}
                >
                    در انتظار ارسال ({pendingOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab("shipped")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === "shipped" ? "bg-amber-800 text-white" : "bg-white/10 text-amber-100"}`}
                >
                    ارسال شده ({shippedOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab("delivered")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${activeTab === "delivered" ? "bg-amber-800 text-white" : "bg-white/10 text-amber-100"}`}
                >
                    تحویل داده شده ({deliveredOrders.length})
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listToShow.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow-md p-4 text-black">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-bold">سفارش #{order.id}</p>
                            <span className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                            </span>
                        </div>

                        <p className="text-sm">موبایل: {order.phone}
                            <button
                                onClick={() => navigator.clipboard.writeText(order.phone)}
                                className="text-amber-700 text-xs mr-2 underline"
                            >
                                کپی
                            </button>
                        </p>

                        <p className="text-sm">آدرس: {order.province}، {order.city}، {order.address}، پلاک {order.plate}
                            {order.floor ? `، طبقه ${order.floor}` : ""}{order.unit ? `، واحد ${order.unit}` : ""}
                        </p>
                        <p className="text-sm">کد پستی: {order.postalCode}</p>
                        {order.description && <p className="text-sm text-gray-500">توضیحات: {order.description}</p>}

                        <div className="border-t border-gray-200 mt-2 pt-2">
                            {order.items.map((item: any, index: number) => (
                                <p key={index} className="text-xs text-gray-700">
                                    {item.name} × {item.quantity}
                                </p>
                            ))}
                        </div>

                        <p className="mt-2 font-semibold">جمع کل: {order.totalPrice.toLocaleString("fa-IR")} تومان</p>

                        {activeTab === "pending" && (
                            <div className="mt-3">
                                <input
                                    type="text"
                                    placeholder="کد پیگیری تیپاکس"
                                    value={trackingInputs[order.id] || ""}
                                    onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-2 w-full mb-2 text-sm text-black bg-white"
                                />
                                <button
                                    onClick={() => markAsShipped(order.id)}
                                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
                                >
                                    بسته‌بندی و ارسال شد
                                </button>
                            </div>
                        )}

                        {activeTab === "shipped" && (
                            <div className="mt-3">
                                <p className="text-sm mb-2">کد پیگیری: <span className="font-semibold">{order.trackingCode}</span></p>
                                <button
                                    onClick={() => markAsDelivered(order.id)}
                                    className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg w-full hover:bg-green-700 transition"
                                >
                                    تحویل داده شد
                                </button>
                            </div>
                        )}

                        {activeTab === "delivered" && (
                            <p className="mt-3 text-sm text-green-700 font-semibold">✓ تحویل داده شده</p>
                        )}
                    </div>
                ))}

                {listToShow.length === 0 && (
                    <p className="text-gray-300 col-span-full text-center py-10">سفارشی در این بخش نیست</p>
                )}
            </div>
        </div>
    )
}