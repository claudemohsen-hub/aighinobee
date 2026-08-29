import { honeyList } from "@/data/products"
import Image from "next/image"
import AddToCart from "./AddToCart"

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = honeyList.find((p) => p.id === Number(id))

    if (!product) {
        return <div className="p-6 text-center">محصول پیدا نشد</div>
    }

    return (
        <div className="p-6 max-w-3xl mx-auto flex flex-col items-center text-center">
            <Image src={product.image} alt={product.name} width={400} height={300} className="rounded-xl shadow-lg" />
            <h1 className="text-3xl font-bold mt-6 text-amber-200">{product.name}</h1>
            <p className="text-gray-300 mt-3 leading-7">{product.description}</p>
            <p className="flex gap-1 mt-4 text-xl font-semibold text-amber-100">
                <span>{product.price.toLocaleString('fa-IR')}</span>
                <span>تومان</span>
            </p>
            <AddToCart product={product} />
        </div>
    )
}
