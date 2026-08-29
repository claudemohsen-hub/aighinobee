"use client"
import { useEffect, useState, useContext } from "react"
import Link from "next/link"
import { CartContextValue } from "../../Context/CartContext"

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { addToCart } = useContext(CartContextValue) as any

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(Array.isArray(data) ? data.filter((p) => p.isActive !== false) : [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="p-6 text-center text-amber-200">در حال بارگذاری محصولات...</div>
    }

    if (products.length === 0) {
        return <div className="p-6 text-center text-amber-200">هنوز محصولی ثبت نشده است</div>
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-amber-200 mb-6">محصولات</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                    const mainImage = product.images?.[0]?.url
                    return (
                        <div
                            key={product.id}
                            className="bg-white/5 border border-amber-900/30 rounded-xl overflow-hidden flex flex-col"
                        >
                            <Link href={`/products/${product.id}`}>
                                {mainImage ? (
                                    <img src={mainImage} alt={product.name} className="w-full h-48 object-cover" />
                                ) : (
                                    <div className="w-full h-48 bg-white/10 flex items-center justify-center text-amber-100 text-sm">
                                        بدون تصویر
                                    </div>
                                )}
                            </Link>
                            <div className="p-4 flex flex-col flex-1">
                                <Link href={`/products/${product.id}`}>
                                    <h2 className="font-bold text-amber-100 hover:text-amber-300 transition">
                                        {product.name}
                                    </h2>
                                </Link>
                                {product.weight && (
                                    <p className="text-xs text-amber-300 mt-1">{product.weight}</p>
                                )}
                                {product.shortDesc && (
                                    <p className="text-sm text-amber-50 mt-2 line-clamp-2">{product.shortDesc}</p>
                                )}
                                <p className="text-lg font-bold text-amber-100 mt-3">
                                    {product.price.toLocaleString("fa-IR")} تومان
                                </p>
                                <div className="flex gap-2 mt-3">
                                    <Link
                                        href={`/products/${product.id}`}
                                        className="flex-1 text-center bg-white/10 text-amber-100 text-sm px-3 py-2 rounded-lg hover:bg-white/20 transition"
                                    >
                                        مشاهده محصول
                                    </Link>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="flex-1 bg-amber-800 text-white text-sm px-3 py-2 rounded-lg hover:bg-amber-900 transition"
                                    >
                                        افزودن به سبد
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}