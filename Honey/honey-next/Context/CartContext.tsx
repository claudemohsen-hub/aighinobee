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

    function addToCart(product: any) {
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
            // فقط فیلدهای لازم را نگه می‌داریم تا سبد خرید سبک بماند
            setCart([
                ...cart,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0]?.url || product.image || null,
                    quantity: 1,
                },
            ])
        }
    }

    function increaseQuantity(productId: number) {
        setCart(
            cart.map((item: any) =>
                item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        )
    }

    function decreaseQuantity(productId: number) {
        setCart(
            cart
                .map((item: any) =>
                    item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item: any) => item.quantity > 0)
        )
    }

    function removeFromCart(productId: number) {
        setCart(cart.filter((item: any) => item.id !== productId))
    }

    function clearCart() {
        setCart([])
    }

    return (
        <CartContextValue.Provider
            value={{ cart, setCart, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart }}
        >
            {children}
        </CartContextValue.Provider>
    )
}

export default CartContext