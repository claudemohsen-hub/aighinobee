import Link from "next/link"
import Image from "next/image"
import { honeyList } from "@/data/products"

export default function Home() {
    return (
        <div>
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

            <div className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-amber-200 text-center">
                    محصولات پرفروش
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {honeyList.slice(0, 3).map((product) => (
                        <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition flex flex-col items-center text-center"
                        >
                            <Image src={product.image} alt={product.name} width={220} height={160} className="rounded-lg object-cover" />
                            <h3 className="text-lg font-bold text-amber-900 mt-3">{product.name}</h3>
                            <p className="mt-2 text-gray-700">{product.price.toLocaleString('fa-IR')} تومان</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
