import prisma from "../../../lib/prisma"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    try {
        const data = await request.json()

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
            data: { status: data.status },
        })

        return Response.json({ success: true, order: updatedOrder })
    } catch (error) {
        console.error("UPDATE ORDER ERROR:", error)
        return Response.json(
            { success: false, message: "خطا در تغییر وضعیت سفارش" },
            { status: 500 }
        )
    }
}
