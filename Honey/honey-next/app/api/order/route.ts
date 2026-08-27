import prisma from "../../../lib/prisma"

export async function POST(request: Request) {
    try {
        const data = await request.json()

        console.log("ORDER DATA:", data)

        const order = await prisma.order.create({
            data: {
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

        console.log("ORDER CREATED:", order.id)

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
            {
                success: false,
                message: "خطا در دریافت سفارش‌ها",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json()

        const updatedOrder = await prisma.order.update({
            where: {
                id: data.id,
            },
            data: {
                status: data.status,
            },
        })

        return Response.json({
            success: true,
            order: updatedOrder,
        })
    } catch (error) {
        console.error("UPDATE ORDER ERROR:", error)

        return Response.json(
            {
                success: false,
                message: "خطا در تغییر وضعیت سفارش",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        )
    }
}