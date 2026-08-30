"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [step, setStep] = useState<"phone" | "code">("phone")
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [needsName, setNeedsName] = useState(false)
    const [loading, setLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const router = useRouter()

    // شمارش معکوس برای ارسال مجدد کد
    useEffect(() => {
        if (countdown <= 0) return
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
        return () => clearTimeout(timer)
    }, [countdown])

    async function handleSendCode() {
        if (!/^09\d{9}$/.test(phone)) {
            alert("لطفاً شماره موبایل معتبر وارد کنید (مثال: 09123456789)")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/auth/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            })
            const data = await res.json()

            if (data.success) {
                setStep("code")
                setCountdown(60)
            } else {
                alert(data.message)
            }
        } catch {
            alert("خطا در ارتباط با سرور")
        } finally {
            setLoading(false)
        }
    }

        async function handleVerifyCode() {
        if (!code.trim()) {
            alert("لطفاً کد ارسال‌شده را وارد کنید")
            return
        }

        if (needsName && !name.trim()) {
            alert("لطفاً نام خود را وارد کنید")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone, code, name }),
            })
            const data = await res.json()

            if (data.success) {
                if (data.needsName) {
                    setNeedsName(true)
                    setLoading(false)
                    return
                }
                router.push("/")
                router.refresh()
            } else {
                alert(data.message)
            }
        } catch {
            alert("خطا در ارتباط با سرور")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-2 text-amber-200">ورود / ثبت‌نام</h1>

            {step === "phone" && (
                <>
                    <p className="text-amber-50 text-sm mb-5">
                        شماره موبایل خود را وارد کنید تا کد ورود برایتان پیامک شود.
                    </p>
                    <input
                        type="tel"
                        placeholder="09123456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                        onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                        maxLength={11}
                        dir="ltr"
                        className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white text-center placeholder:text-gray-400"
                    />
                    <button
                        onClick={handleSendCode}
                        disabled={loading}
                        className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition disabled:opacity-50 font-semibold"
                    >
                        {loading ? "در حال ارسال..." : "دریافت کد"}
                    </button>
                </>
            )}

            {step === "code" && (
                <>
                    <p className="text-amber-50 text-sm mb-1">
                        کد ارسال‌شده به {phone} را وارد کنید.
                    </p>
                    <button
                        onClick={() => {
                            setStep("phone")
                            setCode("")
                            setNeedsName(false)
                        }}
                        className="text-amber-300 text-xs underline mb-5"
                    >
                        تغییر شماره
                    </button>

                    <input
                        type="text"
                        placeholder="کد ۵ رقمی"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                        onKeyDown={(e) => e.key === "Enter" && !needsName && handleVerifyCode()}
                        maxLength={5}
                        dir="ltr"
                        className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white text-center text-lg tracking-widest placeholder:text-gray-400 placeholder:tracking-normal placeholder:text-base"
                    />

                    {needsName && (
                        <>
                            <p className="text-amber-50 text-sm mb-2">
                                خوش آمدید! لطفاً نام خود را وارد کنید.
                            </p>
                            <input
                                type="text"
                                placeholder="نام و نام خانوادگی"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
                                className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-400"
                            />
                        </>
                    )}

                    <button
                        onClick={handleVerifyCode}
                        disabled={loading}
                        className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition disabled:opacity-50 font-semibold"
                    >
                        {loading ? "در حال بررسی..." : needsName ? "تکمیل ثبت‌نام" : "تأیید و ورود"}
                    </button>

                    <div className="mt-4 text-center">
                        {countdown > 0 ? (
                            <p className="text-amber-300 text-sm">
                                ارسال مجدد کد تا {countdown} ثانیه دیگر
                            </p>
                        ) : (
                            <button
                                onClick={handleSendCode}
                                disabled={loading}
                                className="text-amber-200 text-sm underline disabled:opacity-50"
                            >
                                ارسال مجدد کد
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}