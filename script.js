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
for  (let i=0;i < products.length; i++) {
    console.log(products[i])
}