"use client"
import Link from "next/link"
import { useEffect, useState, useContext } from "react"
import { CartContextValue } from "../Context/CartContext"

const FEATURES = [
    {
        title: "ارسال با تیپاکس",
        desc: "به سراسر ایران، پس‌کرایه",
        icon: (
            <path d="M3 7h11v8H3zM14 10h3.5l2.5 3v2h-6zM6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
        ),
    },
    {
        title: "مجوز سیب سلامت",
        desc: "دارای مجوز رسمی بهداشت",
        icon: (
            <path d="M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6l7-3zM9.5 12l1.8 1.8L15 10" />
        ),
    },
    {
        title: "گارانتی کیفیت",
        desc: "تضمین اصالت و طعم",
        icon: (
            <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.6 7.1 18.2l.9-5.5-4-3.9L9.5 8z" />
        ),
    },
    {
        title: "بدون نگهدارنده",
        desc: "کاملاً طبیعی و خالص",
        icon: (
            <path d="M12 20c4-2 6-5.5 6-9V6l-6-3-6 3v5c0 3.5 2 7 6 9zM12 8v6M9 11h6" />
        ),
    },
    {
        title: "بسته‌بندی توسط زنان سرپرست خانوار",
        desc: "حمایت از اشتغال پایدار",
        icon: (
            <path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
        ),
    },
    {
        title: "شکر زیر ۰.۰۱ درصد",
        desc: "همراه با نامه آزمایشگاه معتبر",
        icon: (
            <path d="M9 3h6v4l3 10a3 3 0 0 1-3 4H9a3 3 0 0 1-3-4l3-10zM9 7h6M10 14h4" />
        ),
    },
]

function ProductCard({ product, addToCart }: { product: any; addToCart: (p: any) => void }) {
    const mainImage = product.images?.[0]?.url
    const inStock = product.inStock !== false

    return (
        <div className="bg-white/5 border border-amber-900/30 rounded-2xl overflow-hidden flex flex-col hover:border-amber-700/60 transition">
            <Link href={`/products/${product.id}`} className="relative block">
                {mainImage ? (
                    <div className="w-full h-52 flex items-center justify-center bg-white/5 overflow-hidden">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className={`max-w-full max-h-full object-contain ${!inStock ? "opacity-40" : ""}`}
                        />
                    </div>
                ) : (
                    <div className="w-full h-52 bg-white/10 flex items-center justify-center text-amber-100 text-sm">
                        بدون تصویر
                    </div>
                )}
                {!inStock && (
                    <span className="absolute top-3 right-3 bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                        ناموجود
                    </span>
                )}
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-bold text-amber-100 hover:text-amber-300 transition">{product.name}</h3>
                </Link>
                {product.weight && <p className="text-xs text-amber-300 mt-1">{product.weight}</p>}
                {product.shortDesc && (
                    <p className="text-sm text-amber-50/80 mt-2 line-clamp-2 leading-6">{product.shortDesc}</p>
                )}

                <p className="text-lg font-bold text-amber-100 mt-auto pt-3">
                    {product.price.toLocaleString("fa-IR")} تومان
                </p>

                {inStock ? (
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-amber-700 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-amber-800 transition mt-3 font-semibold"
                    >
                        افزودن به سبد خرید
                    </button>
                ) : (
                    <button
                        disabled
                        className="bg-gray-600 text-white text-sm px-4 py-2.5 rounded-xl mt-3 font-semibold cursor-not-allowed opacity-60"
                    >
                        ناموجود
                    </button>
                )}
            </div>
        </div>
    )
}

export default function Home() {
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

    const bestSellers = products.slice(0, 3)

    return (
        <div>
            {/* بنر اصلی */}
            <div className="bg-gradient-to-b from-amber-900 to-amber-800 text-white text-center py-24 px-6">
                <p className="inline-block bg-white/10 text-amber-200 text-sm px-4 py-1 rounded-full mb-4">
                    عسل خالص ایرانی
                </p>
                <h1 className="text-5xl font-bold mb-4">آیگینوبی</h1>
                <p className="text-lg max-w-xl mx-auto mb-8 text-amber-100">
                    عسل طبیعی و خالص، مستقیم از کندوهای کوهستانی به خانه‌ی شما
                </p>
                <Link
                    href="/products"
                    className="bg-amber-200 text-amber-900 px-8 py-3 rounded-lg font-bold hover:bg-white transition"
                >
                    مشاهده محصولات
                </Link>
            </div>

            {/* محصولات پرفروش */}
            <div className="px-6 pt-14 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-amber-200 text-center">محصولات پرفروش</h2>

                {loading ? (
                    <p className="text-center text-amber-100 pb-6">در حال بارگذاری محصولات...</p>
                ) : bestSellers.length === 0 ? (
                    <p className="text-center text-amber-100 pb-6">هنوز محصولی ثبت نشده است</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bestSellers.map((product) => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))}
                    </div>
                )}
            </div>

            {/* نوار ویژگی‌ها */}
            <div className="my-16 py-12 bg-gradient-to-b from-amber-950/40 to-transparent border-y border-amber-900/30">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
                        {FEATURES.map((feature) => (
                            <div key={feature.title} className="flex items-start gap-4">
                                <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-800/40 border border-amber-700/40 flex items-center justify-center">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-5 h-5 text-amber-300"
                                    >
                                        {feature.icon}
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-amber-100 font-semibold text-sm leading-6">{feature.title}</p>
                                    <p className="text-amber-200/60 text-xs mt-0.5 leading-5">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* همه محصولات */}
            <div className="px-6 pb-20 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-amber-200 text-center">همه محصولات</h2>

                {loading ? (
                    <p className="text-center text-amber-100">در حال بارگذاری محصولات...</p>
                ) : products.length === 0 ? (
                    <p className="text-center text-amber-100">هنوز محصولی ثبت نشده است</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}