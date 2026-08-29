"use client"

import { useContext, useState } from "react"
import { CartContextValue } from "../../Context/CartContext"
import { provincesAndCities } from "../../data/iranLocations"

export default function Checkout() {
    const { cart } = useContext(CartContextValue)
    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [plate, setPlate] = useState("")
    const [floor, setFloor] = useState("")
    const [unit, setUnit] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [description, setDescription] = useState("")

    const total = cart.reduce(
        (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
        0
    )
    const finalTotal = total

    function onlyDigits(setter: (v: string) => void) {
        return (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value.replace(/[^0-9]/g, ""))
    }

    async function handlePayment() {
        if (cart.length === 0) {
            alert("سبد خرید شما خالی است")
            return
        }

        if (!selectedProvince) {
            alert("لطفاً استان را انتخاب کنید")
            return
        }
        if (!selectedCity) {
            alert("لطفاً شهر را انتخاب کنید")
            return
        }
        if (!address.trim()) {
            alert("لطفاً آدرس را وارد کنید")
            return
        }
        if (!plate.trim()) {
            alert("لطفاً پلاک را وارد کنید")
            return
        }
        if (!phone.trim() || phone.length !== 11) {
            alert("لطفاً شماره موبایل معتبر (۱۱ رقم) وارد کنید")
            return
        }

        const response = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cart,
                total: finalTotal,
                phone,
                address,
                plate,
                floor,
                unit,
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
            <h1 className="text-2xl font-bold mb-4">پرداخت</h1>

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

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="پلاک"
                        className="border border-gray-300 rounded-lg p-3 w-full text-center"
                        value={plate}
                        onChange={onlyDigits(setPlate)}
                        maxLength={4}
                    />
                    <input
                        type="text"
                        placeholder="طبقه"
                        className="border border-gray-300 rounded-lg p-3 w-full text-center"
                        value={floor}
                        onChange={onlyDigits(setFloor)}
                        maxLength={3}
                    />
                    <input
                        type="text"
                        placeholder="واحد"
                        className="border border-gray-300 rounded-lg p-3 w-full text-center"
                        value={unit}
                        onChange={onlyDigits(setUnit)}
                        maxLength={3}
                    />
                </div>

                <input
                    type="tel"
                    placeholder="شماره موبایل (مثال: 09123456789)"
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                    value={phone}
                    onChange={onlyDigits(setPhone)}
                    maxLength={11}
                />

                <input
                    type="text"
                    placeholder="کد پستی"
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                    value={postalCode}
                    onChange={onlyDigits(setPostalCode)}
                    maxLength={10}
                />

                <textarea
                    placeholder="توضیحات اختیاری"
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            {cart.length === 0 && <p>سبد خرید خالی است</p>}

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
                    <div className="mt-6 font-normal text-amber-200">
                        ارسال با تیپاکس بصورت پس‌کرایه
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