"use client"

import { useContext } from "react"
import { CartContextValue } from "../../Context/CartContext"

export default function Checkout() {
    const { cart, setCart } = useContext(CartContextValue)

    const total = cart.reduce(
        (sum: number, item: { price: number }) => sum + item.price,
        0
    )

    const shippingPrice = cart.length * 550000
    const finalTotal = shippingPrice + total

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                پرداخت
            </h1>


            <textarea
             placeholder="آدرس کامل خود را وارد کنید"
             className="border border-gray-300 rounded-lg p-3 w-full mb-4"
             rows={3}
              />

            <input
                type="tel"
                placeholder="شماره موبایل (مثال: 09123456789)"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4"
            />

            <input
                type="text"
                placeholder="کد پستی"
                className="border border-gray-300 rounded-lg p-3 w-full mb-4"
            />

          <textarea
                 placeholder="توضیحات اختیاری"
                 className="border border-gray-300 rounded-lg p-3 w-full mb-4"
/>


            {cart.length === 0 && (
                <p>سبد خرید خالی است</p>
            )}

            {cart.map(
                (
                    item: { name: string; price: number },
                    index: number
                ) => (
                    <div
                        key={index}
                        className="flex justify-between items-center border-b py-3"
                    >
                        <span>{item.name}</span>
                        <span>
                            {item.price.toLocaleString("fa-IR")} تومان
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
                        onClick={() => alert("سفارش شما ثبت شد")}
                        className="block bg-green-700 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-800 transition"
                    >
                        پرداخت
                    </button>
                </div>
            )}
        </div>
    )
}