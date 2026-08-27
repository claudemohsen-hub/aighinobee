import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    try {
        const data = await request.json()

        const user = await prisma.user.findUnique({
            where: { phone: data.phone },
        })

        if (!user) {
            return Response.json(
                { success: false, message: "شماره یا رمز عبور اشتباه است" },
                { status: 400 }
            )
        }

        const isValid = await bcrypt.compare(data.password, user.password)

        if (!isValid) {
            return Response.json(
                { success: false, message: "شماره یا رمز عبور اشتباه است" },
                { status: 400 }
            )
        }

        const cookieStore = await cookies()
        cookieStore.set("userId", String(user.id), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        })

        return Response.json({ success: true, message: "ورود موفقیت‌آمیز بود" })
    } catch (error) {
        console.error("LOGIN ERROR:", error)
        return Response.json(
            { success: false, message: "خطا در ورود" },
            { status: 500 }
        )
    }
}
