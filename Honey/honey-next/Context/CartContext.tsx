"use client"

import { useState, createContext, useEffect } from "react"

console.log("MY CART CONTEXT LOADED")

export const CartContextValue = createContext<any>(null)

function CartContext({ children }: { children: React.ReactNode }) {

    const [cart, setCart] = useState<any[]>([])
    const [loaded, setLoaded] = useState(false)


    // خواندن اولیه
    useEffect(() => {

        const savedCart = localStorage.getItem("cart")

        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }

        setLoaded(true)

    }, [])



    // ذخیره فقط بعد از خواندن اولیه
    useEffect(() => {

        if (!loaded) return

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        )

        console.log("SAVED CART:", cart)

    }, [cart, loaded])


    console.log("PROVIDER RENDER CART:", cart)


    return (
        <CartContextValue.Provider value={{ cart, setCart }}>
            {children}
        </CartContextValue.Provider>
    )
}

export default CartContext