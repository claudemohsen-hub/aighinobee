import prisma from "../../../lib/prisma"

export async function POST(request: Request) {
    try {
        const data = await request.json()

        if (!data.name || !data.name.trim()) {
            return Response.json({ success: false, message: "نام الزامی است" }, { status: 400 })
        }
        if (!data.phone || !data.phone.trim()) {
            return Response.json({ success: false, message: "شماره موبایل الزامی است" }, { status: 400 })
        }
        if (!data.message || !data.message.trim()) {
            return Response.json({ success: false, message: "متن پیام الزامی است" }, { status: 400 })
        }

        await prisma.contactMessage.create({
            data: {
                name: data.name,
                phone: data.phone,
                message: data.message,
            },
        })

        return Response.json({ success: true, message: "پیام شما با موفقیت ارسال شد" })
    } catch (error) {
        console.error("CONTACT MESSAGE ERROR:", error)
        return Response.json({ success: false, message: "خطا در ارسال پیام" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: "desc" },
        })
        return Response.json(messages)
    } catch (error) {
        console.error("GET CONTACT MESSAGES ERROR:", error)
        return Response.json({ success: false, message: "خطا در دریافت پیام‌ها" }, { status: 500 })
    }
}