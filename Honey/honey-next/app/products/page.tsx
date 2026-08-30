"use client"
import { useEffect, useState, useContext } from "react"
import { useParams } from "next/navigation"
import { CartContextValue } from "../../../Context/CartContext"

export default function ProductDetail() {
    const params = useParams()
    const { addToCart } = useContext(CartContextValue) as any
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeImage, setActiveImage] = useState(0)

    useEffect(() => {
        fetch(`/api/products/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data && !data.message) setProduct(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [params.id])

    if (loading) return <div className="p-6 text-center text-amber-200">در حال بارگذاری...</div>
    if (!product) return <div className="p-6 text-center text-amber-200">محصول پیدا نشد</div>

    const images = product.images?.length ? product.images : []
    const inStock = product.inStock !== false

    const specs = [
        { label: "وزن", value: product.weight },
        { label: "نوع عسل", value: product.honeyType },
        { label: "سال تولید", value: product.productYear },
        { label: "تاریخ انقضا", value: product.expiry },
        { label: "خواص", value: product.benefits },
        { label: "مناسب برای", value: product.suitableFor },
    ].filter((s) => s.value)

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <div className="relative rounded-xl overflow-hidden bg-white/5 border border-amber-900/30">
                        {images.length > 0 ? (
                            <div className="w-full h-80 flex items-center justify-center overflow-hidden">
                                <img
                                    src={images[activeImage].url}
                                    alt={product.name}
                                    className={`max-w-full max-h-full object-contain ${!inStock ? "opacity-50" : ""}`}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-80 flex items-center justify-center text-amber-100">
                                بدون تصویر
                            </div>
                        )}
                        {!inStock && (
                            <div className="absolute top-3 right-3 bg-red-700 text-white text-sm font-bold px-4 py-1.5 rounded-lg">
                                ناموجود
                            </div>
                        )}
                    </div>
                    {images.length > 1 && (
                        <div className="flex gap-2 mt-3 overflow-x-auto">
                            {images.map((img: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`shrink-0 rounded-lg overflow-hidden border-2 bg-white/5 w-16 h-16 flex items-center justify-center ${
                                        activeImage === index ? "border-amber-500" : "border-transparent"
                                    }`}
                                >
                                    <img src={img.url} alt="" className="max-w-full max-h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="md:w-1/2 flex flex-col">
                    <h1 className="text-2xl font-bold text-amber-200">{product.name}</h1>

                    {product.shortDesc && (
                        <p className="text-amber-50 mt-3 leading-7 whitespace-pre-line">{product.shortDesc}</p>
                    )}

                    <p className="text-2xl font-bold text-amber-100 mt-5">
                        {product.price.toLocaleString("fa-IR")} تومان
                    </p>

                    {inStock ? (
                        <button
                            onClick={() => addToCart(product)}
                            className="bg-amber-800 text-white px-6 py-3 rounded-lg mt-4 hover:bg-amber-900 transition font-semibold"
                        >
                            افزودن به سبد خرید
                        </button>
                    ) : (
                        <button
                            disabled
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg mt-4 font-semibold cursor-not-allowed opacity-70"
                        >
                            ناموجود
                        </button>
                    )}

                    {product.description && (
                        <div className="mt-6">
                            <h2 className="font-bold text-amber-200 mb-2">توضیحات بیشتر</h2>
                            <p className="text-amber-50 leading-7 whitespace-pre-line text-sm">{product.description}</p>
                        </div>
                    )}
                </div>
            </div>

            {specs.length > 0 && (
                <div className="mt-10">
                    <h2 className="font-bold text-amber-200 text-lg mb-4 border-b border-amber-900/40 pb-2">
                        ویژگی‌های محصول
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {specs.map((spec) => (
                            <div
                                key={spec.label}
                                className="flex justify-between bg-white/5 border border-amber-900/30 rounded-lg px-4 py-3"
                            >
                                <span className="text-amber-300 text-sm font-semibold">{spec.label}</span>
                                <span className="text-amber-50 text-sm">{spec.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}