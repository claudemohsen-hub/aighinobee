function ProductCard(props: { name: string; price: number}){
  return(
    <div>
      <h3>{props.name}</h3>
     <p className="flex justify-center gap-1">
  <span>{props.price.toLocaleString('fa-IR')}</span>
  <span> تومان</span>
</p>
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
  return (
    <div>
      <h1> سلام از React</h1>
      {products.map((product) => (
  <ProductCard name={product.name} price={product.price} />
))}
    </div>
  )
}

export default App