"use client"
import Image from "next/image"

import { useState } from "react"

function ProductCard(props: { name: string; price: number; image: string; onAdd: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
     <Image src={props.image} alt={props.name} width={300} height={200} className="rounded" />
      <h3>{props.name}</h3>
      <p className="flex justify-center gap-1">
        <span>{props.price.toLocaleString('fa-IR')}</span>
        <span>تومان</span>
      </p>
      <button
        onClick={props.onAdd}
        className="bg-amber-800 text-white px-4 py-2 rounded hover:bg-amber-900 transition"
      >
        افزودن به سبد خرید
      </button>
    </div>
  )
}

export default function Products() {
  const honeyList = [
  { name: "عسل عناب", price: 1239000, image: "https://dkstatics-public.digikala.com/digikala-products/92408d5e99b7424116cc2efdf176a9526986754e_1649869838.jpg" },
  { name: "عسل کنار", price: 1240000, image: "https://dkstatics-public.digikala.com/digikala-products/92408d5e99b7424116cc2efdf176a9526986754e_1649869838.jpg" },
  { name: "عسل زرشک", price: 2234000, image: "https://dkstatics-public.digikala.com/digikala-products/92408d5e99b7424116cc2efdf176a9526986754e_1649869838.jpg" }
]

  const [cart, setCart] = useState<{ name: string; price: number }[]>([])

  function removeFromCart(indexToRemove: number) {
    setCart(cart.filter((item, index) => index !== indexToRemove))
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">محصولات</h1>

      <div className="mb-6">
        <p>تعداد اقلام سبد: {cart.length}</p>
        {cart.map((item, index) => (
          <p key={index}>
            {item.name} — {item.price.toLocaleString('fa-IR')} تومان
            <button onClick={() => removeFromCart(index)}>حذف</button>
          </p>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {honeyList.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            price={product.price}
            image={product.image}
            onAdd={() => setCart([...cart, product])}
          />
        ))}
      </div>
    </div>
  )
}