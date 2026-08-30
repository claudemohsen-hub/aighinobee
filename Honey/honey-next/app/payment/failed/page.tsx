"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const REASON_MESSAGES: Record<string, string> = {
    cancelled: "پرداخت توسط شما لغو شد.",
    unverified: "پرداخت تأیید نشد. در صورت کسر وجه، مبلغ ظرف ۷۲ ساعت بازگردانده می‌شود.",
    invalid: "درخواست پرداخت نامعتبر است.",
    notfound: "سفارش مورد نظر یافت نشد.",
    error: "خطایی در بررسی پرداخت رخ داد.",
}

export default function PaymentFailedPage() {
    const searchParams = useSearchParams()
    const reason = searchParams.get("reason") || "error"

    return (
        <div className="p-6 max-w-md mx-auto text-center py-20">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-amber-200 mb-3">پرداخت ناموفق بود</h1>
            <p className="text-amber-50 text-sm mb-8">
                {REASON_MESSAGES[reason] || REASON_MESSAGES.error}
            </p>
            <Link
                href="/checkout"
                className="bg-amber-800 text-white px-6 py-3 rounded-lg hover:bg-amber-900 transition inline-block"
            >
                تلاش مجدد
            </Link>
        </div>
    )
}   