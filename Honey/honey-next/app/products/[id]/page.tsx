import { honeyList } from "@/data/products"

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
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.price.toLocaleString('fa-IR')} تومان</p>
    </div>
  )
}   