import prisma from "../../../lib/prisma"

export async function POST(request: Request) {
    const data = await request.json()

    const order = await prisma.order.create({
        data: {
            phone: data.phone,
            address: data.address,
            province: data.province,
            city: data.city,
            postalCode: data.postalCode,
            description: data.description,
            items: data.cart,
            totalPrice: data.total,
        },
    })

    return Response.json({ success: true, message: "سفارش شما با موفقیت ثبت شد", orderId: order.id })
}