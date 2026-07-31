console.log("TEST JS");
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

let honey = {
    name: "عسل عناب",
    price: 200000,
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

let cart= JSON.parse(localStorage.getItem("cart")) || []
document.getElementById("cartCount").innerText="سبد خرید" + cart.length
document.getElementById("cartTotal").innerText="جمع: " + getTotalPrice() + "تومان"
showCart()

function addToCart(index) {
    let product=honeyList[index]
    cart.push(product)
    localStorage.setItem("cart", JSON.stringify(cart))
    document.getElementById("cartCount").innerText ="سبد خرید: " +cart.length
    document.getElementById("cartTotal").innerText ="جمع: " + getTotalPrice() + " تومان"
    showCart()
    console.log(cart)
}


function getTotalPrice() {
    let total=0
    for (let i=0;i<cart.length; i++) {
        total=total +cart[i].price
    }
    return total
}


function showCart() {
    let cartHtml=""
    for (let i=0; i < cart.length; i++) {
        cartHtml=cartHtml + "<p>" + cart[i].name + " — " + cart[i].price +"تومان <button onclick=\"removeFromCart(" + i + ")\">حذف از سبد خرید</button></p>"
    }
    document.getElementById("cartList").innerHTML=cartHtml
}

function removeFromCart(index){
    cart.splice(index, 1)
    localStorage.setItem("cart", JSON.stringify(cart))
    document.getElementById("cartCount").innerText="سبد خرید:" + cart.length
    document.getElementById("cartTotal").innerText="جمع:" + getTotalPrice() + "تومان"
    showCart()
}

document.getElementById("cartCount").innerText="سبد خرید" + cart.length
document.getElementById("cartTotal").innerText="جمع: " + getTotalPrice() + "تومان"
showCart()

let cardsHtml=""
for (let i = 0; i < honeyList.length; i++) {
    let status = honeyList[i].inStock ? "<p>موجود است</p>" : "<p>ناموجود است</p>"
    cardsHtml=cardsHtml + "<div class='card'><h3>" + honeyList[i].name +"</h3><p>" + honeyList[i].price + "تومان </p>" + status + "<button onclick=\"addToCart(" + i + ")\">افزودن به سبد خرید</button></div>"
}
document.getElementById("productList").innerHTML=cardsHtml

function clearCart() {
    cart=[]
    localStorage.removeItem("cart")
    document.getElementById("cartCount").innerText= "سبد خرید" + cart.length
    document.getElementById("cartTotal").innerText= "جمع" + getTotalPrice() + "تومان"
    showCart()
}

async function getUsers() {
    let response = await fetch("https://jsonplaceholder.typicode.com/users")
    let data = await response.json()
    alert("تعداد کاربرها: " + data.length)
}

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    console.log("دکمه ارسال زده شد");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    console.log(name);
    console.log(email);
    console.log(message);
    if (name=== "") {
        alert("فیلدها رو یره پر کن")
        return
    }
    alert("پیام شما ثبت شد");
});

