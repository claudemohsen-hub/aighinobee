"use client"
export default function Contact() {
return(
    <div className="p-6">
    <h1 className="text-2xl font-bold mb-4 text-amber-200">تماس با ما</h1>
    <p className="mt-2">09384836103</p>
    <p className="mt-2">Email:Info@iginobee.com</p>
    <div className="flex gap-4 mt-4">
    <a href="https://wa.me/989384836103">واتساپ</a>
    <a href="https://rubika.ir/09384836103">روبیکا</a>
    <a href="https://eitaa.com/09384836103">ایتا</a>
    </div>
    <input
    type="text"
    placeholder="نام و نام خانوادگی خود را وارد کنید"
    className="border border-gray-300 rounded-lg p-3 w-full mb-4"
/>
<input 
type="tel"
placeholder="لطفا شماره موبایل خود را وارد کنید"
className="border border-gray-300 rounded-lg p-3 w-full mb-4"
/>
<textarea
placeholder="متن پیام خود را وارد کنید"
className="border border-gray-300 rounded-lg p-3 w-full mb-4"
rows={4}
/>
<button
onClick={() => alert("تیکت شما ثبت شد")}
className="block bg-green-700 text-white px-6 py-3 rounded-lg mt-4 hover:bg-green-800 transition"
>ارسال تیکت</button>

    </div>
)
}