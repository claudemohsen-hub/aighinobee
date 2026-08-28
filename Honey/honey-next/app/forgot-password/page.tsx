"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<"phone" | "reset">("phone")
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleRequestCode() {
        if (!phone.trim() || phone.length !== 11) {
            alert("لطفاً شماره موبایل معتبر (۱۱ رقم) وارد کنید")
            return
        }
        setLoading(true)
        const response = await fetch("/api/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        })
        const data = await response.json()
        setLoading(false)
        alert(data.message)
        if (data.success) {
            setStep("reset")
        }
    }

    async function handleResetPassword() {
        if (!code.trim()) {
            alert("لطفاً کد ارسالی را وارد کنید")
            return
        }
        if (!newPassword.trim() || newPassword.length < 4) {
            alert("رمز جدید باید حداقل ۴ کاراکتر باشد")
            return
        }
        if (newPassword !== confirmPassword) {
            alert("رمز جدید و تکرار آن یکسان نیستند")
            return
        }
        setLoading(true)
        const response = await fetch("/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, code, newPassword }),
        })
        const data = await response.json()
        setLoading(false)
        alert(data.message)
        if (data.success) {
            router.push("/login")
        }
    }

    return (
        <div className="p-6 max-w-sm mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-amber-200">فراموشی رمز عبور</h1>

            {step === "phone" && (
                <>
                    <p className="text-amber-50 mb-4 text-sm">
                        شماره موبایل خود را وارد کنید تا کد تأیید برایتان پیامک شود.
                    </p>
                    <input
                        type="tel"
                        placeholder="شماره موبایل"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                        maxLength={11}
                        className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
                    />
                    <button
                        onClick={handleRequestCode}
                        disabled={loading}
                        className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition disabled:opacity-50"
                    >
                        {loading ? "در حال ارسال..." : "ارسال کد"}
                    </button>
                </>
            )}

            {step === "reset" && (
                <>
                    <p className="text-amber-50 mb-4 text-sm">
                        کد ارسالی به {phone} و رمز عبور جدید خود را وارد کنید.
                    </p>
                    <input
                        type="text"
                        placeholder="کد تأیید"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                        maxLength={5}
                        className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
                    />
                    <input
                        type="password"
                        placeholder="رمز عبور جدید"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
                    />
                    <input
                        type="password"
                        placeholder="تکرار رمز عبور جدید"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 w-full mb-4 text-black bg-white placeholder:text-gray-500"
                    />
                    <button
                        onClick={handleResetPassword}
                        disabled={loading}
                        className="bg-amber-800 text-white px-6 py-3 rounded-lg w-full hover:bg-amber-900 transition disabled:opacity-50"
                    >
                        {loading ? "در حال ثبت..." : "تغییر رمز عبور"}
                    </button>
                    <button
                        onClick={() => setStep("phone")}
                        className="text-amber-200 text-sm underline mt-3 w-full text-center"
                    >
                        شماره اشتباه است؟ بازگشت
                    </button>
                </>
            )}
        </div>
    )
}