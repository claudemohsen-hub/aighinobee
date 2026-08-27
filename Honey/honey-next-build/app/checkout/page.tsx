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
    const totalQuantity = cart.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
    const shippingPrice = totalQuantity * 55000
    const finalTotal = shippingPrice + total

    function onlyDigits(setter: (v: string) => void) {
        return (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value.replace(/[^0-9]/g, ""))
    }

    async function handlePayment() {
        if (!selectedProvince) return alert("لطفاً استان را انتخاب کنید")
        if (!selectedCity) return alert("لطفاً شهر را انتخاب کنید")
        if (!address.trim()) return alert("لطفاً آدرس را وارد کنید")
        if (!plate.trim()) return alert("لطفاً پلاک را وارد کنید")
        if (!phone.trim()) return alert("لطفاً شماره موبایل را وارد کنید")
        if (!postalCode.trim()) return alert("لطفاً کد پستی را وارد کنید")
        if (cart.length === 0) return alert("سبد خرید شما خالی است")

        const response = await fetch("/api/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cart, total: finalTotal, phone, address, plate, floor, unit,
                province: selectedProvince, city: selectedCity, postalCode, description,
            }),
        })
        const result = await response.json()
        alert(result.message)
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-200">پرداخت</h1>

            <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black">
                <option value="">انتخاب استان</option>
                {Object.keys(provincesAndCities).map((p) => <option key={p} value={p}>{p}</option>)}
            </select>

            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedProvince}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black">
                <option value="">انتخاب شهر</option>
                {selectedProvince && provincesAndCities[selectedProvince].map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <textarea placeholder="آدرس کامل" value={address} onChange={(e) => setAddress(e.target.value)} rows={3}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black" />

            <div className="flex gap-2 mb-4">
                <input placeholder="پلاک" value={plate} onChange={onlyDigits(setPlate)} maxLength={4}
                    className="border border-gray-300 rounded-lg p-3 w-full text-center text-black" />
                <input placeholder="طبقه" value={floor} onChange={onlyDigits(setFloor)} maxLength={3}
                    className="border border-gray-300 rounded-lg p-3 w-full text-center text-black" />
                <input placeholder="واحد" value={unit} onChange={onlyDigits(setUnit)} maxLength={3}
                    className="border border-gray-300 rounded-lg p-3 w-full text-center text-black" />
            </div>

            <input type="tel" placeholder="شماره موبایل" value={phone} onChange={onlyDigits(setPhone)} maxLength={11}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black" />

            <input placeholder="کد پستی" value={postalCode} onChange={onlyDigits(setPostalCode)} maxLength={10}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black" />

            <textarea placeholder="توضیحات اختیاری" value={description} onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black" />

            {cart.map((item: { name: string; price: number; quantity: number }, index: number) => (
                <div key={index} className="flex justify-between items-center border-b border-white/10 py-3 text-amber-50">
                    <span>{item.name} ({item.quantity})</span>
                    <span>{(item.price * item.quantity).toLocaleString("fa-IR")} تومان</span>
                </div>
            ))}

            {cart.length > 0 && (
                <div>
                    <div className="mt-5 font-bold text-amber-100">جمع کل: {total.toLocaleString("fa-IR")} تومان</div>
                    <div className="mt-2 text-amber-100">هزینه پستی: {shippingPrice.toLocaleString("fa-IR")} تومان</div>
                    <div className="mt-2 text-emerald-400 font-semibold">هزینه پرداختی: {finalTotal.toLocaleString("fa-IR")} تومان</div>
                    <button onClick={handlePayment}
                        className="block bg-green-700 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-800 transition w-full">
                        پرداخت
                    </button>
                </div>
            )}
        </div>
    )
}
