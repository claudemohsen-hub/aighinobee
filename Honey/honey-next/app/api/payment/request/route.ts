import prisma from "../../../../lib/prisma"
import { cookies } from "next/headers"
import { requestPayment } from "../../../../lib/zarinpal"

export async function POST(request: Request) {
    try {
        const data = await request.json()

        // همان اعتبارسنجی‌های سفارش قبلی
        if (!Array.isArray(data.cart) || data.cart.length === 0) {
            return Response.json({ success: false, message: "سبد خرید خالی است" }, { status: 400 })
        }
        if (!data.province || !String(data.province).trim()) {
            return Response.json({ success: false, message: "استان الزامی است" }, { status: 400 })
        }
        if (!data.city || !String(data.city).trim()) {
            return Response.json({ success: false, message: "شهر الزامی است" }, { status: 400 })
        }
        if (!data.address || !String(data.address).trim()) {
            return Response.json({ success: false, message: "آدرس الزامی است" }, { status: 400 })
        }
        if (!data.plate || !String(data.plate).trim()) {
            return Response.json({ success: false, message: "پلاک الزامی است" }, { status: 400 })
        }
        if (!data.phone || !/^\d{11}$/.test(String(data.phone))) {
            return Response.json({ success: false, message: "شماره موبایل معتبر (۱۱ رقم) الزامی است" }, { status: 400 })
        }
        if (typeof data.total !== "number" || data.total <= 0) {
            return Response.json({ success: false, message: "مبلغ سفارش نامعتبر است" }, { status: 400 })
        }

        const cookieStore = await cookies()
        const userId = cookieStore.get("userId")?.value

        // سفارش را با وضعیت «پرداخت نشده» می‌سازیم
        const order = await prisma.order.create({
            data: {
                userId: userId ? Number(userId) : null,
                phone: data.phone,
                address: data.address,
                province: data.province,
                city: data.city,
                postalCode: data.postalCode,
                description: data.description || null,
                items: data.cart,
                totalPrice: data.total,
                plate: data.plate,
                floor: data.floor || null,
                unit: data.unit || null,
                paymentStatus: "پرداخت نشده",
            },
        })

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.iginobee.com"
        const callbackUrl = `${siteUrl}/api/payment/verify?orderId=${order.id}`

        const result = await requestPayment(
            data.total,
            `پرداخت سفارش شماره ${order.id} - آیگینوبی`,
            callbackUrl,
            data.phone
        )

        if (!result.success || !result.url) {
            return Response.json(
                { success: false, message: result.error || "خطا در اتصال به درگاه پرداخت" },
                { status: 500 }
            )
        }

        // authority را روی سفارش ذخیره می‌کنیم تا در verify پیدایش کنیم
        await prisma.order.update({
            where: { id: order.id },
            data: { authority: result.authority },
        })

        return Response.json({ success: true, paymentUrl: result.url })
    } catch (error) {
        console.error("PAYMENT REQUEST ERROR:", error)
        return Response.json({ success: false, message: "خطا در ایجاد سفارش" }, { status: 500 })
    }
}