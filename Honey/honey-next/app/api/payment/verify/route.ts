import prisma from "../../../../lib/prisma"
import { verifyPayment } from "../../../../lib/zarinpal"
import { sendOrderPlacedCustomer, sendNewOrderAdmin } from "../../../../lib/sms"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get("orderId")
    const authority = searchParams.get("Authority")
    const status = searchParams.get("Status")

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.iginobee.com"

    if (!orderId || !authority) {
        return Response.redirect(`${siteUrl}/payment/failed?reason=invalid`, 302)
    }

    try {
        const order = await prisma.order.findUnique({ where: { id: Number(orderId) } })

        if (!order) {
            return Response.redirect(`${siteUrl}/payment/failed?reason=notfound`, 302)
        }

        // اگر قبلاً پرداخت شده، دوباره پردازش نکن (جلوگیری از درخواست تکراری)
        if (order.paymentStatus === "پرداخت شده") {
            return Response.redirect(`${siteUrl}/payment/success?orderId=${order.id}`, 302)
        }

        // کاربر پرداخت را لغو کرده
        if (status !== "OK") {
            await prisma.order.update({
                where: { id: order.id },
                data: { paymentStatus: "لغو شده" },
            })
            return Response.redirect(`${siteUrl}/payment/failed?reason=cancelled`, 302)
        }

        const result = await verifyPayment(order.totalPrice, authority)

        if (!result.success) {
            await prisma.order.update({
                where: { id: order.id },
                data: { paymentStatus: "ناموفق" },
            })
            return Response.redirect(`${siteUrl}/payment/failed?reason=unverified`, 302)
        }

        // پرداخت موفق — سفارش را نهایی می‌کنیم
        await prisma.order.update({
            where: { id: order.id },
            data: { paymentStatus: "پرداخت شده" },
        })

        // همان پیامک‌های همیشگی
        await sendOrderPlacedCustomer(order.phone, String(order.id))
        if (process.env.ADMIN_PHONE) {
            await sendNewOrderAdmin(process.env.ADMIN_PHONE, String(order.id))
        }

        return Response.redirect(`${siteUrl}/payment/success?orderId=${order.id}`, 302)
    } catch (error) {
        console.error("PAYMENT VERIFY ERROR:", error)
        return Response.redirect(`${siteUrl}/payment/failed?reason=error`, 302)
    }
}