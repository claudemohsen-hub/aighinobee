"use client"
import { useState, useEffect } from "react"

const EMPTY_FORM = {
    id: null as number | null,
    province: "",
    city: "",
    name: "",
    phone: "",
    address: "",
    description: "",
}

export default function AdminRepresentativesPage() {
    const [reps, setReps] = useState<any[]>([])
    const [password, setPassword] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [checkingSession, setCheckingSession] = useState(true)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)

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
        if (isLoggedIn) fetchReps()
    }, [isLoggedIn])

    function fetchReps() {
        fetch("/api/representatives")
            .then((res) => res.json())
            .then((data) => setReps(Array.isArray(data) ? data : []))
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
    }

    function startEdit(rep: any) {
        setForm({
            id: rep.id,
            province: rep.province,
            city: rep.city,
            name: rep.name,
            phone: rep.phone,
            address: rep.address,
            description: rep.description || "",
        })
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    async function handleSave() {
        if (!form.province.trim() || !form.city.trim() || !form.name.trim() || !form.phone.trim() || !form.address.trim()) {
            alert("استان، شهر، نام، شماره و آدرس الزامی است")
            return
        }

        setSaving(true)
        const method = form.id ? "PUT" : "POST"
        const body = form.id ? form : { ...form }

        const res = await fetch("/api/representatives", {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
        const data = await res.json()
        setSaving(false)

        if (data.success) {
            resetForm()
            fetchReps()
        } else {
            alert("خطا: " + (data.message || "نامشخص"))
        }
    }

    async function handleDelete(id: number, name: string) {
        if (!confirm(`آیا از حذف نماینده «${name}» مطمئن هستید؟`)) return

        const res = await fetch("/api/representatives", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        })
        const data = await res.json()
        if (data.success) {
            fetchReps()
        } else {
            alert("خطا: " + (data.message || "نامشخص"))
        }
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

    const inputClass = "border border-gray-300 rounded-lg p-2 w-full text-black bg-white"

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-amber-200 mb-6">مدیریت نمایندگان فروش</h1>

            <div className="bg-white rounded-xl shadow-md p-5 mb-8 text-black">
                <h2 className="font-bold text-lg mb-4">{form.id ? "ویرایش نماینده" : "افزودن نماینده جدید"}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-semibold block mb-1">استان *</label>
                        <input
                            type="text"
                            value={form.province}
                            onChange={(e) => setForm({ ...form, province: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold block mb-1">شهر *</label>
                        <input
                            type="text"
                            value={form.city}
                            onChange={(e) => setForm({ ...form, city: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold block mb-1">نام نماینده *</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold block mb-1">شماره تماس *</label>
                        <input
                            type="text"
                            dir="ltr"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-sm font-semibold block mb-1">آدرس *</label>
                        <textarea
                            rows={2}
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label className="text-sm font-semibold block mb-1">توضیحات (اختیاری)</label>
                        <textarea
                            rows={2}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
                    >
                        {saving ? "در حال ذخیره..." : form.id ? "ذخیره تغییرات" : "افزودن"}
                    </button>
                    {form.id && (
                        <button
                            onClick={resetForm}
                            className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                            انصراف از ویرایش
                        </button>
                    )}
                </div>
            </div>

            <h2 className="font-bold text-amber-200 mb-4">لیست نمایندگان ({reps.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reps.map((rep) => (
                    <div key={rep.id} className="bg-white rounded-xl shadow-md p-4 text-black">
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-bold">{rep.name}</p>
                            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-1 rounded">
                                {rep.province} - {rep.city}
                            </span>
                        </div>
                        <p className="text-sm" dir="ltr">{rep.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">{rep.address}</p>
                        {rep.description && <p className="text-xs text-gray-500 mt-1">{rep.description}</p>}
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={() => startEdit(rep)}
                                className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex-1"
                            >
                                ویرایش
                            </button>
                            <button
                                onClick={() => handleDelete(rep.id, rep.name)}
                                className="bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-700 transition flex-1"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                ))}

                {reps.length === 0 && (
                    <p className="text-gray-300 col-span-full text-center py-10">هنوز نماینده‌ای ثبت نشده</p>
                )}
            </div>
        </div>
    )
}