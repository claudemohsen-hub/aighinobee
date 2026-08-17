"use client"

import { useState } from "react"

function ProductCard(props: { name: string; price: number; onAdd: () => void }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
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
    { name: "عسل عناب", price: 1239000 },
    { name: "عسل کنار", price: 1240000 },
    { name: "عسل زرشک", price: 2234000 }
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
            onAdd={() => setCart([...cart, product])}
          />
        ))}
      </div>
    </div>
  )
}