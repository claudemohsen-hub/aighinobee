"use client"

import { useContext, useState } from "react"
import { CartContextValue } from "../../Context/CartContext"
import { provincesAndCities } from "../../data/iranLocations"
import { onlyEnglishDigits } from "../../lib/digits"

export default function Checkout() {
    const { cart, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(
        CartContextValue
    ) as any
    const [selectedProvince, setSelectedProvince] = useState("")
    const [selectedCity, setSelectedCity] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [plate, setPlate] = useState("")
    const [floor, setFloor] = useState("")
    const [unit, setUnit] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [description, setDescription] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const total = cart.reduce(
        (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
        0
    )

    // هر عدد فارسی/عربی که تایپ شود، همان لحظه به انگلیسی تبدیل می‌شود
    function digitsOnly(setter: (v: string) => void) {
        return (e: React.ChangeEvent<HTMLInputElement>) => setter(onlyEnglishDigits(e.target.value))
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

        setSubmitting(true)
        try {
            const response = await fetch("/api/payment/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cart,
                    total,
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

            if (result.success && result.paymentUrl) {
                window.location.href = result.paymentUrl
            } else {
                alert(result.message || "خطا در اتصال به درگاه پرداخت")
                setSubmitting(false)
            }
        } catch (err) {
            alert("خطا در ثبت سفارش، لطفاً دوباره تلاش کنید")
            setSubmitting(false)
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-amber-200">تکمیل سفارش</h1>

            <div className="mb-8">
                <h2 className="font-bold text-amber-200 mb-3">سبد خرید شما</h2>

                {cart.length === 0 ? (
                    <p className="text-amber-100 bg-white/5 border border-amber-900/30 rounded-xl p-6 text-center">
                        سبد خرید شما خالی است
                    </p>
                ) : (
                    <div className="space-y-3">
                        {cart.map((item: any) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 bg-white/5 border border-amber-900/30 rounded-xl p-3"
                            >
                                {item.image ? (
                                    <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-white/5 rounded-lg overflow-hidden">
                                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 shrink-0 bg-white/10 rounded-lg flex items-center justify-center text-[10px] text-amber-100">
                                        بدون تصویر
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-amber-100 truncate">{item.name}</p>
                                    <p className="text-sm text-amber-300">
                                        {item.price.toLocaleString("fa-IR")} تومان
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => increaseQuantity(item.id)}
                                        className="w-8 h-8 rounded-lg bg-amber-800 text-white hover:bg-amber-900 transition flex items-center justify-center text-lg font-bold"
                                    >
                                        +
                                    </button>
                                    <span className="w-8 text-center text-amber-100 font-semibold">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => decreaseQuantity(item.id)}
                                        className="w-8 h-8 rounded-lg bg-amber-800 text-white hover:bg-amber-900 transition flex items-center justify-center text-lg font-bold"
                                    >
                                        −
                                    </button>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="w-8 h-8 rounded-lg bg-red-700 text-white hover:bg-red-800 transition flex items-center justify-center"
                                    >
                                        🗑
                                    </button>
                                </div>

                                <div className="w-28 text-left shrink-0 hidden sm:block">
                                    <p className="text-amber-100 font-semibold text-sm">
                                        {(item.price * item.quantity).toLocaleString("fa-IR")}
                                    </p>
                                    <p className="text-[11px] text-amber-300">تومان</p>
                                </div>
                            </div>
                        ))}

                        <div className="bg-white/5 border border-amber-900/30 rounded-xl p-4 mt-4">
                            <div className="flex justify-between font-bold text-amber-100">
                                <span>جمع کل</span>
                                <span>{total.toLocaleString("fa-IR")} تومان</span>
                            </div>
                            <p className="text-sm text-amber-300 mt-2">ارسال با تیپاکس بصورت پس‌کرایه</p>
                        </div>
                    </div>
                )}
            </div>

            {cart.length > 0 && (
                <>
                    <h2 className="font-bold text-amber-200 mb-3">اطلاعات ارسال</h2>
                    <div className="max-w-md">
                        <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white"
                        >
                            <option value="">انتخاب استان</option>
                            {Object.keys(provincesAndCities).map((province) => (
                                <option key={province} value={province}>
                                    {province}
                                </option>
                            ))}
                        </select>

                        <select
                            className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white"
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
                            className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
                            rows={3}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="پلاک"
                                className="border border-gray-300 rounded-lg p-3 w-full text-center text-black bg-white placeholder:text-gray-500"
                                value={plate}
                                onChange={digitsOnly(setPlate)}
                                maxLength={4}
                            />
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="طبقه"
                                className="border border-gray-300 rounded-lg p-3 w-full text-center text-black bg-white placeholder:text-gray-500"
                                value={floor}
                                onChange={digitsOnly(setFloor)}
                                maxLength={3}
                            />
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="واحد"
                                className="border border-gray-300 rounded-lg p-3 w-full text-center text-black bg-white placeholder:text-gray-500"
                                value={unit}
                                onChange={digitsOnly(setUnit)}
                                maxLength={3}
                            />
                        </div>

                        <input
                            type="tel"
                            inputMode="numeric"
                            placeholder="شماره موبایل (مثال: 09123456789)"
                            className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
                            value={phone}
                            onChange={digitsOnly(setPhone)}
                            maxLength={11}
                        />

                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="کد پستی"
                            className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
                            value={postalCode}
                            onChange={digitsOnly(setPostalCode)}
                            maxLength={10}
                        />

                        <textarea
                            placeholder="توضیحات اختیاری"
                            className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button
                            onClick={handlePayment}
                            disabled={submitting}
                            className="block w-full bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50 font-semibold"
                        >
                            {submitting ? "در حال انتقال به درگاه پرداخت..." : "پرداخت و ثبت سفارش"}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}