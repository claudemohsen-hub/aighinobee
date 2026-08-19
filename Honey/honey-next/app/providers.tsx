"use client"

import CartContext from "../Context/CartContext"

export default function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <CartContext>
            {children}
        </CartContext>
    )
}