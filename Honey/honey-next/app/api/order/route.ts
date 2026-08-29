import prisma from "../../../lib/prisma"
import { cookies } from "next/headers"
import { sendOrderPlacedCustomer, sendNewOrderAdmin, sendOrderShipped } from "../../../lib/sms"

export async function POST(request: Request) {
    try {
        const data = await request.json()

        // اعتبارسنجی سمت سرور
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
            },
        })

        // پیامک به مشتری و ادمین
        await sendOrderPlacedCustomer(data.phone, String(order.id))
        if (process.env.ADMIN_PHONE) {
            await sendNewOrderAdmin(process.env.ADMIN_PHONE, String(order.id))
        }

        return Response.json({
            success: true,
            message: "سفارش شما با موفقیت ثبت شد",
            orderId: order.id,
        })
    } catch (error) {
        console.error("ORDER ERROR:", error)
        return Response.json(
            {
                success: false,
                message: "خطا در ثبت سفارش",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        })
        return Response.json(orders)
    } catch (error) {
        console.error("GET ORDERS ERROR:", error)
        return Response.json(
            { success: false, message: "خطا در دریافت سفارش‌ها" },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json()

        const updatedOrder = await prisma.order.update({
            where: { id: data.id },
            data: {
                status: data.status,
                ...(data.trackingCode !== undefined && { trackingCode: data.trackingCode }),
            },
        })

        // وقتی وضعیت "ارسال شد" می‌شه، پیامک کد رهگیری برای مشتری
        if (data.status === "ارسال شد" && data.trackingCode) {
            let customerName = "مشتری گرامی"
            if (updatedOrder.userId) {
                const user = await prisma.user.findUnique({ where: { id: updatedOrder.userId } })
                if (user?.name) customerName = user.name
            }
            await sendOrderShipped(updatedOrder.phone, customerName, data.trackingCode)
        }

        return Response.json({ success: true, order: updatedOrder })
    } catch (error) {
        console.error("UPDATE ORDER ERROR:", error)
        return Response.json(
            { success: false, message: "خطا در تغییر وضعیت سفارش" },
            { status: 500 }
        )
    }
}