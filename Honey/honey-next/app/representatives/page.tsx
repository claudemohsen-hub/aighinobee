"use client"
import { useEffect, useState } from "react"

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

    // گروه‌بندی بر اساس استان
    const grouped = reps.reduce((acc: Record<string, any[]>, rep) => {
        if (!acc[rep.province]) acc[rep.province] = []
        acc[rep.province].push(rep)
        return acc
    }, {})

    if (loading) {
        return <div className="p-6 text-center text-amber-200">در حال بارگذاری...</div>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-amber-200 mb-8 text-center">نمایندگان فروش</h1>

            {reps.length === 0 ? (
                <p className="text-center text-amber-100">در حال حاضر نماینده‌ای ثبت نشده است</p>
            ) : (
                Object.keys(grouped)
                    .sort()
                    .map((province) => (
                        <div key={province} className="mb-8">
                            <h2 className="text-lg font-bold text-amber-300 mb-3 border-b border-amber-900/40 pb-2">
                                {province}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {grouped[province].map((rep) => (
                                    <div
                                        key={rep.id}
                                        className="bg-white/5 border border-amber-900/30 rounded-xl p-4"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-amber-100">{rep.name}</p>
                                            <span className="text-xs bg-amber-800/40 text-amber-200 px-2 py-1 rounded">
                                                {rep.city}
                                            </span>
                                        </div>
                                        <p className="text-sm text-amber-50 mb-1" dir="ltr">
                                            {rep.phone}
                                        </p>
                                        <p className="text-sm text-amber-50/80">{rep.address}</p>
                                        {rep.description && (
                                            <p className="text-xs text-amber-200/60 mt-2">{rep.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
            )}
        </div>
    )
}