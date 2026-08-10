import {useState} from 'react'


function ProductCard(props: { name: string; price: number; onAdd: () => void }) {  
  return(
    <div>
      <h3>{props.name}</h3> 
     <p className="flex justify-center gap-1">
  <span>{props.price.toLocaleString('fa-IR')}</span>
  <span> تومان</span>
</p>
<button onClick={props.onAdd}>افزودن به سبد خرید</button>
    </div>
  )
}


function Greeting(props: { name: string }) {
  return <p>سلام {props.name}</p>
}
function App() {
  const products = [
      { name: "عسل عناب", price: 1239000},
      { name: "عسل کنار", price: 1240000},
      { name: "عسل زرشک", price: 2234000}
  ]
  const [cart, setCart] = useState<{ name: string; price: number}[]>([])
  function removeFromCart(indexToRemove: number) {
    setCart(cart.filter((item, index) => index !==indexToRemove))
  }
  return (
    <div>
      <h1> سلام از React</h1>
      <div>
  <p>تعداد اقلام سبد: {cart.length}</p>
  {cart.map((item, index) => (
    <p key={index}>{item.name} — {item.price.toLocaleString('fa-IR')} تومان
    <button onClick={() => removeFromCart(index)}>حذف</button>
    </p>
  ))}
</div>
      {products.map((product, index) => (
  <ProductCard 
  key={index}
  name={product.name} 
  price={product.price}
  onAdd={() => setCart([...cart, product])} />
      ))}
    </div>
  )
}

export default App