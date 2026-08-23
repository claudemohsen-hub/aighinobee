"use client"

import { useContext } from "react"
import { CartContextValue } from "../../Context/CartContext"
import Link from "next/link"

export default function CartPage() {
    const { cart, setCart } = useContext(CartContextValue)
    

    

    function removeFromCart(indexToRemove: number) {
        setCart(
            cart.filter((_: any, index: number) => index !== indexToRemove)
        )
    }

    const total = cart.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity),
    0
)
    
console.log("CART PAGE DATA:", cart)
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                سبد خرید شما
            </h1>

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
                        <span>{item.name} ({item.quantity})</span>
                        <span>{(item.price * item.quantity).toLocaleString("fa-IR")} تومان</span>

                        <button
                            onClick={() => removeFromCart(index)}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                            حذف
                        </button>
                    </div>
                )
            )}

          {cart.length > 0 && (
    <div className="mt-5">
        <p className="font-bold mb-3">
            جمع کل: {total.toLocaleString("fa-IR")} تومان
        </p>
        <Link
            href="/checkout"
            className="bg-amber-800 text-white px-6 py-3 rounded-lg inline-block hover:bg-amber-900 transition"
        >
            تسویه‌حساب
        </Link>
    </div>
)}
        </div>
    )
}