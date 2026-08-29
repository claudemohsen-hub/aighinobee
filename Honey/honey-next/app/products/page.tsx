"use client"
import { honeyList } from "@/data/products"
import Link from "next/link"
import Image from "next/image"
import { useContext } from "react"
import { CartContextValue } from "../../Context/CartContext"

function ProductCard(props: { id: number; name: string; price: number; image: string; onAdd: () => void }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition flex flex-col items-center text-center">
            <Image src={props.image} alt={props.name} width={220} height={160} className="rounded-lg object-cover" />
            <Link href={`/products/${props.id}`} className="mt-3">
                <h3 className="text-lg font-bold text-amber-900 hover:underline">{props.name}</h3>
            </Link>
            <p className="flex justify-center gap-1 mt-2 text-gray-700">
                <span>{props.price.toLocaleString('fa-IR')}</span>
                <span>تومان</span>
            </p>
            <button
                onClick={props.onAdd}
                className="bg-amber-800 text-white px-5 py-2 rounded-lg mt-3 hover:bg-amber-900 transition w-full"
            >
                افزودن به سبد خرید
            </button>
        </div>
    )
}

export default function Products() {
    const { cart, addToCart } = useContext(CartContextValue)

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-amber-200">محصولات</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {honeyList.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        image={product.image}
                        onAdd={() => addToCart(product)}
                    />
                ))}
            </div>
        </div>
    )
}
