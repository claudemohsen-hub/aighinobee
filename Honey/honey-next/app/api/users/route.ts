import prisma from "../../../lib/prisma"

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { id: "desc" },
            select: {
                id: true,
                phone: true,
                name: true,
                orders: { select: { id: true } },
            },
        })
        return Response.json(users)
    } catch (error) {
        console.error("GET USERS ERROR:", error)
        return Response.json({ success: false, message: "خطا در دریافت کاربران" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const data = await request.json()
        const userId = Number(data.id)

        if (!userId) {
            return Response.json({ success: false, message: "شناسه کاربر نامعتبر است" }, { status: 400 })
        }

        // قبل از حذف کاربر، سفارش‌هایش را از او جدا می‌کنیم تا سفارش‌ها حذف نشوند
        await prisma.order.updateMany({
            where: { userId },
            data: { userId: null },
        })

        await prisma.user.delete({ where: { id: userId } })

        return Response.json({ success: true, message: "کاربر با موفقیت حذف شد" })
    } catch (error) {
        console.error("DELETE USER ERROR:", error)
        return Response.json({ success: false, message: "خطا در حذف کاربر" }, { status: 500 })
    }
}
