"use client"

import { useContext } from "react"
import { CartContextValue } from "../Context/CartContext"
import Link from "next/link"

export default function CartCount() {
  const { cart } = useContext(CartContextValue)

  return (
    <Link href="/cart" className="hover:underline">
      سبد خرید ({cart.length})
    </Link>
  )
}