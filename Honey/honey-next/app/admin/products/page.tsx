"use client"
import { useState, useEffect } from "react"

type ImageItem = { url: string; filename?: string; alt?: string }

const EMPTY_FORM = {
    id: null as number | null,
    name: "",
    price: "",
    shortDesc: "",
    description: "",
    weight: "",
    honeyType: "",
    productYear: "",
    expiry: "",
    benefits: "",
    suitableFor: "",
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([])
    const [password, setPassword] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [checkingSession, setCheckingSession] = useState(true)
    const [form, setForm] = useState(EMPTY_FORM)
    const [images, setImages] = useState<ImageItem[]>([])
    const [newImageUrl, setNewImageUrl] = useState("")
    const [saving, setSaving] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const ADMIN_PASSWORD_KEY = "adminPassword"
    const ADMIN_SESSION_KEY = "adminLoggedIn"
    const DEFAULT_PASSWORD = "1234"

    function getStoredPassword() {
        if (typeof window === "undefined") return DEFAULT_PASSWORD
        return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD
    }

    useEffect(() => {
        const session = localStorage.getItem(ADMIN_SESSION_KEY)
        if (session === "true") setIsLoggedIn(true)
        setCheckingSession(false)
    }, [])

    useEffect(() => {
        if (isLoggedIn) fetchProducts()
    }, [isLoggedIn])

    function fetchProducts() {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data))
    }

    function handleLogin() {
        if (password === getStoredPassword()) {
            setIsLoggedIn(true)
            localStorage.setItem(ADMIN_SESSION_KEY, "true")
        } else {
            alert("رمز عبور اشتباه است")
        }
    }

    function resetForm() {
        setForm(EMPTY_FORM)
        setImages([])
        setNewImageUrl("")
        setShowForm(false)
    }

    function startEdit(product: any) {
        setForm({
            id: product.id,
            name: product.name,
            price: String(product.price),
            shortDesc: product.shortDesc || "",
            description: product.description || "",
            weight: product.weight || "",
            honeyType: product.honeyType || "",
            productYear: product.productYear || "",
            expiry: product.expiry || "",
            benefits: product.benefits || "",
            suitableFor: product.suitableFor || "",
        })
        setImages(product.images.map((img: any) => ({ url: img.url, filename: img.filename, alt: img.alt })))
        setShowForm(true)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    function addImageLink() {
        const url = newImageUrl.trim()
        if (!url) return
        if (!url.startsWith("http")) {
            alert("لطفاً یک لینک معتبر وارد کنید (با http شروع شود)")
            return
        }
        setImages((prev) => [...prev, { url, alt: form.name }])
        setNewImageUrl("")
    }

    function removeImage(index: number) {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    function moveImage(index: number, direction: -1 | 1) {
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= images.length) return
        const copy = [...images]
        ;[copy[index], copy[newIndex]] = [copy[newIndex], copy[index]]
        setImages(copy)
    }

    async function handleSave() {
        if (!form.name.trim() || !form.price.trim()) {
            alert("نام و قیمت محصول الزامی است")
            return
        }

        setSaving(true)
        const payload = { ...form, images }
        const method = form.id ? "PUT" : "POST"
        const body = form.id ? { ...payload, id: form.id } : payload

        const res = await fetch("/api/products", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        const data = await res.json()
        setSaving(false)

        if (data.success) {
            alert(form.id ? "محصول ویرایش شد" : "محصول اضافه شد")
            resetForm()
            fetchProducts()
        } else {
            alert("خطا: " + (data.message || "نامشخص"))
        }
    }

    async function handleDeleteProduct(id: number, name: string) {
        if (!confirm(`آیا از حذف محصول «${name}» مطمئن هستید؟`)) return

        const res = await fetch("/api/products", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        alert(data.message)
        if (data.success) fetchProducts()
    }

    if (checkingSession) return null

    if (!isLoggedIn) {
        return (
            <div className="p-6 max-w-sm mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-amber-200">ورود به پنل مدیریت</h1>
                <input
                    type="password"
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white"
                />
                <button
                    onClick={handleLogin}
                    className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition"
                >
                    ورود
                </button>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-amber-200">مدیریت محصولات</h1>
                <button
                    onClick={() => (showForm ? resetForm() : setShowForm(true))}
                    className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-900 transition"
                >
                    {showForm ? "بستن فرم" : "+ افزودن محصول جدید"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-md p-5 mb-8 text-black">
                    <h2 className="font-bold text-lg mb-4">{form.id ? "ویرایش محصول" : "افزودن محصول جدید"}</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold block mb-1">نام محصول *</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold block mb-1">قیمت (تومان) *</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="text-sm font-semibold block mb-1">ویژگی‌های کوتاه (حداکثر ۳ خط)</label>
                        <textarea
                            rows={3}
                            value={form.shortDesc}
                            onChange={(e) => setForm({ ...form, shortDesc: e.target.value })}
                            className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                            placeholder="مثلاً: عسل طبیعی، بدون افزودنی، برداشت مستقیم از کندو"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-sm font-semibold block mb-1">توضیحات بیشتر (حداکثر ۵ خط)</label>
                        <textarea
                            rows={5}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                        />
                    </div>

                    <h3 className="font-bold mt-6 mb-2 text-amber-800">ویژگی‌های محصول</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold block mb-1">وزن</label>
                            <input
                                type="text"
                                value={form.weight}
                                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                placeholder="مثلاً: 800 گرم"
                                className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold block mb-1">نوع عسل</label>
                            <input
                                type="text"
                                value={form.honeyType}
                                onChange={(e) => setForm({ ...form, honeyType: e.target.value })}
                                placeholder="مثلاً: عسل عناب"
                                className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold block mb-1">سال تولید</label>
                            <input
                                type="text"
                                value={form.productYear}
                                onChange={(e) => setForm({ ...form, productYear: e.target.value })}
                                placeholder="مثلاً: 1405"
                                className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold block mb-1">تاریخ انقضا</label>
                            <input
                                type="text"
                                value={form.expiry}
                                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                                placeholder="مثلاً: بدون انقضا"
                                className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-semibold block mb-1">خواص</label>
                            <textarea
                                rows={2}
                                value={form.benefits}
                                onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                                className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-semibold block mb-1">مناسب برای</label>
                            <input
                                type="text"
                                value={form.suitableFor}
                                onChange={(e) => setForm({ ...form, suitableFor: e.target.value })}
                                placeholder="مثلاً: میانسالان، افراد دیابتی"
                                className="border border-gray-300 rounded-lg p-2 w-full text-black bg-white"
                            />
                        </div>
                    </div>

                    <h3 className="font-bold mt-6 mb-2 text-amber-800">تصاویر محصول (درج لینک)</h3>
                    <p className="text-xs text-gray-500 mb-2">
                        عکس را در هاست خود آپلود کنید و لینک کامل آن را اینجا وارد کنید (مثلاً https://media.iginobee.com/uploads/products/name.jpg)
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addImageLink()}
                            placeholder="لینک عکس..."
                            className="border border-gray-300 rounded-lg p-2 flex-1 text-black bg-white"
                            dir="ltr"
                        />
                        <button
                            onClick={addImageLink}
                            className="bg-amber-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-900 transition whitespace-nowrap"
                        >
                            افزودن لینک
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                        {images.map((img, index) => (
                            <div key={index} className="relative border rounded-lg overflow-hidden">
                                <img src={img.url} alt="" className="w-full h-24 object-cover" />
                                {index === 0 && (
                                    <span className="absolute top-1 right-1 bg-amber-800 text-white text-[10px] px-2 py-0.5 rounded">
                                        اصلی
                                    </span>
                                )}
                                <div className="flex justify-between bg-gray-100 p-1">
                                    <button onClick={() => moveImage(index, -1)} className="text-xs px-1" title="جابجایی">↑</button>
                                    <button onClick={() => moveImage(index, 1)} className="text-xs px-1" title="جابجایی">↓</button>
                                    <button onClick={() => removeImage(index)} className="text-xs text-red-600 px-1">حذف</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {images.length > 0 && (
                        <p className="text-xs text-gray-500 mt-2">اولین تصویر به‌عنوان تصویر اصلی نمایش داده می‌شود. با فلش‌ها ترتیب را عوض کنید.</p>
                    )}

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
                        >
                            {saving ? "در حال ذخیره..." : form.id ? "ذخیره تغییرات" : "افزودن محصول"}
                        </button>
                        <button onClick={resetForm} className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition">
                            انصراف
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden text-black">
                        {product.images?.[0] ? (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-40 object-cover" />
                        ) : (
                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                                بدون تصویر
                            </div>
                        )}
                        <div className="p-4">
                            <p className="font-bold">{product.name}</p>
                            <p className="text-sm text-amber-800 font-semibold mt-1">
                                {product.price.toLocaleString("fa-IR")} تومان
                            </p>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => startEdit(product)}
                                    className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex-1"
                                >
                                    ویرایش
                                </button>
                                <button
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                    className="bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-700 transition flex-1"
                                >
                                    حذف
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {products.length === 0 && (
                    <p className="text-gray-300 col-span-full text-center py-10">هنوز محصولی اضافه نشده</p>
                )}
            </div>
        </div>
    )
}