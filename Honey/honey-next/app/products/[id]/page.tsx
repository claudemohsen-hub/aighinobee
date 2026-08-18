  import { honeyList } from "@/data/products"
  import Image from "next/image"
  import AddToCart from "./AddToCart"

  export default async function ProductDetail({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params
    const product = honeyList.find((p) => p.id === Number(id))

    if (!product) {
      return <div className="p-6">محصول پیدا نشد</div>
    }

    return (
      <div className="p-6">
        <Image src={product.image} alt={product.name} width={400} height={300} className="rounded-lg" />
        <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="flex gap-1 mt-2">
          <span>{product.price.toLocaleString('fa-IR')}</span>
          <span>تومان</span>
          <AddToCart />
        </p>
      </div>
    )
  }