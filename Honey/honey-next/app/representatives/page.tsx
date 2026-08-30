"use client"
import { useEffect, useState } from "react"

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"]

function toPersianNumber(num: number): string {
    return String(num)
        .split("")
        .map((d) => PERSIAN_DIGITS[Number(d)])
        .join("")
}

export default function RepresentativesPage() {
    const [reps, setReps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/representatives")
            .then((res) => res.json())
            .then((data) => {
                setReps(Array.isArray(data) ? data : [])
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading) {
        return <div className="p-6 text-center text-amber-200">در حال بارگذاری...</div>
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-amber-200 mb-8 text-center">نمایندگان فروش</h1>

            {reps.length === 0 ? (
                <p className="text-center text-amber-100">در حال حاضر نماینده‌ای ثبت نشده است</p>
            ) : (
                <div>
                    {reps.map((rep, index) => (
                        <div
                            key={rep.id}
                            className={`py-4 ${index !== reps.length - 1 ? "border-b border-amber-100/10" : ""}`}
                        >
                            <p className="text-amber-50 leading-8">
                                <span className="text-amber-300 font-bold">{toPersianNumber(index + 1)}. </span>
                                نام نماینده: {rep.name}، آدرس: {rep.address}، شماره تماس:{" "}
                                <span className="text-amber-400 font-semibold" dir="ltr">
                                    {rep.phone}
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}