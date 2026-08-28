"use client"
export default function Contact() {
    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-200">تماس با ما</h1>
            <p className="mt-2 text-amber-50">09384836103</p>
            <p className="mt-2 text-amber-50">Email: Info@iginobee.com</p>
            <div className="flex gap-3 mt-4">
                <a href="https://wa.me/989384836103" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">واتساپ</a>
                <a href="https://rubika.ir/09384836103" className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm">روبیکا</a>
                <a href="https://eitaa.com/09384836103" className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm">ایتا</a>
            </div>

            <input type="text" placeholder="نام و نام خانوادگی" className="border border-gray-300 rounded-lg p-3 w-full mt-6 mb-4 text-black bg-white placeholder:text-gray-500" />
            <input type="tel" placeholder="شماره موبایل" className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500" />
            <textarea placeholder="متن پیام" rows={4} className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500" />
            <button onClick={() => alert("پیام شما ارسال شد")} className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition">
                ارسال
            </button>
        </div>
    )
}