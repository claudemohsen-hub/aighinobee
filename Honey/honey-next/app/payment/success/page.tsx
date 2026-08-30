"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function PaymentSuccessPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("orderId")

    return (
        <div className="p-6 max-w-md mx-auto text-center py-20">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-amber-200 mb-3">پرداخت با موفقیت انجام شد</h1>
            {orderId && (
                <p className="text-amber-100 mb-6">شماره سفارش شما: <span className="font-bold">#{orderId}</span></p>
            )}
            <p className="text-amber-50 text-sm mb-8">
                جزئیات سفارش و کد پیگیری از طریق پیامک برای شما ارسال شد.
            </p>
            <Link
                href="/"
                className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition inline-block"
            >
                بازگشت به صفحه اصلی
            </Link>
        </div>
    )
}