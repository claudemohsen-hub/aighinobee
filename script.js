let productName = "عسل طبیعی"
console.log(productName)
let price = 150000
console.log(price)
let inStock = true
console.log(inStock)
function showProduct(name) {
    console.log(name)
}
showProduct("عسل عناب")
if (inStock) {   
    console.log("موجود است") 
    }
        else { console.log("ن   اموجود است")
            }
console.log(document.getElementById("title"))
document.getElementById("myButton").addEventListener("click", function() {
document.getElementById("title").innerText="خوش آمدید به آیگینوبی؛ فروشگاه عسل طبیعی"})
let products=["عسل عناب","عسل کنار","عسل زرشک"]
console.log(products[1])

let productListHtml = ""
for (let i=0;i < products.length; i++) {
    productListHtml=productListHtml +  "<p>" + products[i]+ "</p>"
}
document.getElementById("productList").innerHTML=productListHtml

let honey = {
    name: "عسل عناب",
    price: "200000",
    inStock: true
}
console.log(honey.price)

let honeyList = [
    {name:"عسل عناب", price: 1239000, inStock: true},
    {name:"عسل کنار", price:1240000, inStock: true},
    {name:"عسل زرشک", price: 2230000, inStock: true}
]
console.log(honeyList[0])
console.log(honeyList[0].name)
console.log(honeyList[1].price)

let cart=[]

function addToCart(index) {
    let product=honeyList[index]
    cart.push(product)
    document.getElementById("cartCount").innerText ="سبد خرید: " +cart.length
    console.log(cart)
}

let cardsHtml=""
for (let i = 0; i < honeyList.length; i++) {
    let status = honeyList[i].inStock ? "<p>موجود است</p>" : "<p>ناموجود است</p>"
    cardsHtml=cardsHtml + "<div class='card'><h3>" + honeyList[i].name +"</h3><p>" + honeyList[i].price + "تومان </p>" + status + "<button onclick=\"addToCart(" + i + ")\">افزودن به سبد خرید</button></div>"
}
document.getElementById("productList").innerHTML=cardsHtml