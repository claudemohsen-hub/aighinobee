"use client"
import { useContext } from "react"
import { CartContextValue } from "../../../Context/CartContext"

function AddToCart(props: { product: { id: number; name: string; price: number; image: string; description: string } }) {
    const { addToCart } = useContext(CartContextValue)
    return (
        <button
            type="button"
            onClick={() => addToCart(props.product)}
            className="bg-amber-800 text-white px-6 py-3 rounded-lg mt-6 hover:bg-amber-900 transition"
        >
            افزودن به سبد خرید
        </button>
    )
}
export default AddToCart
