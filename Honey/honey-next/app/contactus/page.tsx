"use client"
import { useState } from "react"

export default function Contact() {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSend() {
        if (!name.trim() || !phone.trim() || !message.trim()) {
            alert("لطفاً همه‌ی فیلدها را پر کنید")
            return
        }
        setLoading(true)
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, phone, message }),
        })
        const data = await response.json()
        setLoading(false)
        alert(data.message)
        if (data.success) {
            setName("")
            setPhone("")
            setMessage("")
        }
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-200">تماس با ما</h1>
            <p className="mt-2 text-amber-50">09384836103</p>
            <p className="mt-2 text-amber-50">Email: Info@iginobee.com</p>
            <div className="flex gap-3 mt-4">
                <a href="https://wa.me/989384836103" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">واتساپ</a>
                <a href="https://rubika.ir/09384836103" className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm">روبیکا</a>
                <a href="https://eitaa.com/09384836103" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">ایتا</a>
            </div>

            <input
                type="text"
                placeholder="نام و نام خانوادگی"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mt-6 mb-4 text-black bg-white placeholder:text-gray-500"
            />
            <input
                type="tel"
                placeholder="شماره موبایل"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
            />
            <textarea
                placeholder="متن پیام"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
            />
            <button
                onClick={handleSend}
                disabled={loading}
                className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition disabled:opacity-50"
            >
                {loading ? "در حال ارسال..." : "ارسال"}
            </button>
        </div>
    )
}