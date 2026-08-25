"use client"

import { useContext, useState } from "react"
import { CartContextValue } from "../../Context/CartContext"
import { provincesAndCities } from "../../data/iranLocations"

export default function Checkout() {
    const { cart, setCart } = useContext(CartContextValue)
    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [description, setDescription] = useState("")

    const total = cart.reduce(
        (sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity),
        0
    )

    const totalQuantity = cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
    const shippingPrice = totalQuantity * 55000
    const finalTotal = shippingPrice + total

    async function handlePayment() {
        const response = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cart,
                total: finalTotal,
                phone,
                address,
                province: selectedProvince,
                city: selectedCity,
                postalCode,
                description,
            }),
        })

        const result = await response.json()
        alert(result.message)
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                پرداخت
            </h1>
            <div className="max-w-md">
                <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                >
                    <option value="">انتخاب استان</option>
                    {Object.keys(provincesAndCities).map((province) => (
                        <option key={province} value={province}>
                            {province}
                        </option>
                    ))}
                </select>

                <select
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                    disabled={!selectedProvince}
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                >
                    <option value="">انتخاب شهر</option>
                    {selectedProvince &&
                        provincesAndCities[selectedProvince].map((city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        ))}
                </select>

                <textarea
                    placeholder="آدرس کامل خود را وارد کنید"
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <input
                    type="tel"
                    placeholder="شماره موبایل (مثال: 09123456789)"
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="کد پستی"
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                />

                <textarea
                    placeholder="توضیحات اختیاری"
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {cart.length === 0 && (
                <p>سبد خرید خالی است</p>
            )}
            {cart.map(
                (
                    item: { name: string; price: number; quantity: number },
                    index: number
                ) => (
                    <div
                        key={index}
                        className="flex justify-between items-center border-b py-3"
                    >
                        <span>{item.name} ({item.quantity})</span>
                        <span>
                            {(item.price * item.quantity).toLocaleString("fa-IR")} تومان
                        </span>
                    </div>
                )
            )}

            {cart.length > 0 && (
                <div>
                    <div className="mt-5 font-bold">
                        جمع کل: {total.toLocaleString("fa-IR")} تومان
                    </div>
                    <div className="mt-6 font-normal">
                        هزینه پستی: {shippingPrice.toLocaleString("fa-IR")} تومان
                    </div>
                    <div className="mt-6 text-emerald-600 font-normal">
                        هزینه پرداختی: {finalTotal.toLocaleString("fa-IR")} تومان
                    </div>

                    <button
                        onClick={handlePayment}
                        className="block bg-green-700 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-800 transition"
                    >
                        پرداخت
                    </button>
                </div>
            )}
        </div>
    )
}