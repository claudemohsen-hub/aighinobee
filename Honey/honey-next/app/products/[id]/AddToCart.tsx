"use client"

import { useContext } from "react"
import { CartContextValue } from "@/Context/CartContext"

function AddToCart(props: { product: { name: string; price: number } }) {
  console.log("AddToCart component loaded")
  const { setCart } = useContext(CartContextValue)

  return (
   <button
  type="button"
  onClick={() => {
    console.log("BUTTON CLICKED", props.product)

    setCart((prev: { name: string; price: number }[]) => {
      console.log("OLD CART:", prev)

      const updatedCart = [
        ...prev,
        props.product
      ]

      console.log("UPDATED CART:", updatedCart)

      return updatedCart
    })
  }}
  className="bg-amber-800 text-white px-4 py-2 rounded mt-4 cursor-pointer"
>
  افزودن به سبد خرید
</button>
  )
}

export default AddToCart