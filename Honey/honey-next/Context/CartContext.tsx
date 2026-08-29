"use client"

import { useState, createContext, useEffect } from "react"

export const CartContextValue = createContext<any>(null)

function CartContext({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<any[]>([])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        }
        setLoaded(true)
    }, [])

    useEffect(() => {
        if (!loaded) return
        localStorage.setItem("cart", JSON.stringify(cart))
    }, [cart, loaded])

    function addToCart(product: { id: number; name: string; price: number; image: string; description: string }) {
        const existing = cart.find((item: any) => item.id === product.id)

        if (existing) {
            setCart(
                cart.map((item: any) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            )
        } else {
            setCart([...cart, { ...product, quantity: 1 }])
        }
    }

    return (
        <CartContextValue.Provider value={{ cart, setCart, addToCart }}>
            {children}
        </CartContextValue.Provider>
    )
}

export default CartContext
