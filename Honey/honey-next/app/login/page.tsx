"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onlyEnglishDigits } from "../../lib/digits"

export default function LoginPage() {
    const [mode, setMode] = useState<"otp" | "password">("otp")
    const router = useRouter()

    // --- حالت پیامکی ---
    const [step, setStep] = useState<"phone" | "code">("phone")
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [needsName, setNeedsName] = useState(false)
    const [countdown, setCountdown] = useState(0)

    // --- حالت رمز ---
    const [pwPhone, setPwPhone] = useState("")
    const [pwName, setPwName] = useState("")
    const [pwPassword, setPwPassword] = useState("")

    const [loading, setLoading] = useState(false)

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

    async function handlePasswordAuth() {
        if (!/^09\d{9}$/.test(pwPhone)) {
            alert("لطفاً شماره موبایل معتبر وارد کنید (مثال: 09123456789)")
            return
        }
        if (!pwPassword.trim() || pwPassword.length < 4) {
            alert("رمز عبور باید حداقل ۴ کاراکتر باشد")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/auth/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: pwPhone, name: pwName, password: pwPassword }),
            })
            const data = await res.json()

            if (data.success) {
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

    const inputClass =
        "border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-400"

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-200">ورود / ثبت‌نام</h1>

            {/* انتخاب روش ورود */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setMode("otp")}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        mode === "otp" ? "bg-amber-800 text-white" : "bg-white/10 text-amber-100"
                    }`}
                >
                    ورود با پیامک
                </button>
                <button
                    onClick={() => setMode("password")}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        mode === "password" ? "bg-amber-800 text-white" : "bg-white/10 text-amber-100"
                    }`}
                >
                    ورود با رمز
                </button>
            </div>

            {/* ---------- حالت پیامکی ---------- */}
            {mode === "otp" && step === "phone" && (
                <>
                    <p className="text-amber-50 text-sm mb-5">
                        شماره موبایل خود را وارد کنید تا کد ورود برایتان پیامک شود.
                    </p>
                    <input
                        type="tel"
                        placeholder="09123456789"
                        value={phone}
                        onChange={(e) => setPhone(onlyEnglishDigits(e.target.value))}
                        onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                        maxLength={11}
                        dir="ltr"
                        className={inputClass + " text-center"}
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

            {mode === "otp" && step === "code" && (
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
                        onChange={(e) => setCode(onlyEnglishDigits(e.target.value))}
                        onKeyDown={(e) => e.key === "Enter" && !needsName && handleVerifyCode()}
                        maxLength={5}
                        dir="ltr"
                        className={inputClass + " text-center text-lg tracking-widest"}
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
                                className={inputClass}
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

            {/* ---------- حالت رمز عبور ---------- */}
            {mode === "password" && (
                <>
                    <p className="text-amber-50 text-sm mb-5">
                        اگر حساب دارید وارد شوید، و اگر تازه‌وارد هستید نام خود را هم وارد کنید تا ثبت‌نام شوید.
                    </p>

                    <input
                        type="tel"
                        placeholder="شماره موبایل"
                        value={pwPhone}
                        onChange={(e) => setPwPhone(onlyEnglishDigits(e.target.value))}
                        maxLength={11}
                        dir="ltr"
                        className={inputClass + " text-center"}
                    />

                    <input
                        type="text"
                        placeholder="نام و نام خانوادگی (فقط برای ثبت‌نام)"
                        value={pwName}
                        onChange={(e) => setPwName(e.target.value)}
                        className={inputClass}
                    />

                    <input
                        type="password"
                        placeholder="رمز عبور"
                        value={pwPassword}
                        onChange={(e) => setPwPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handlePasswordAuth()}
                        className={inputClass}
                    />

                    <button
                        onClick={handlePasswordAuth}
                        disabled={loading}
                        className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition disabled:opacity-50 font-semibold"
                    >
                        {loading ? "در حال بررسی..." : "ورود / ثبت‌نام"}
                    </button>
                </>
            )}
        </div>
    )
}