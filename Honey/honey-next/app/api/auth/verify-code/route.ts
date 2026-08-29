import prisma from "../../../../lib/prisma"
import { cookies } from "next/headers"
import { sendRegisterSuccess } from "../../../../lib/sms"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const phone = String(data.phone || "").trim()
        const code = String(data.code || "").trim()
        const name = String(data.name || "").trim()

        if (!phone || !code) {
            return Response.json({ success: false, message: "اطلاعات ناقص است" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { phone } })

        if (!user || !user.loginCode || !user.loginCodeExpiry) {
            return Response.json(
                { success: false, message: "کد نامعتبر است، دوباره درخواست دهید" },
                { status: 400 }
            )
        }

        if (user.loginCode !== code) {
            return Response.json({ success: false, message: "کد وارد شده اشتباه است" }, { status: 400 })
        }

        if (new Date() > user.loginCodeExpiry) {
            return Response.json(
                { success: false, message: "کد منقضی شده است، دوباره درخواست دهید" },
                { status: 400 }
            )
        }

        // کاربر جدید محسوب می‌شود اگر هنوز نامی ثبت نکرده باشد
        const isNewUser = !user.name

        const updatedUser = await prisma.user.update({
            where: { phone },
            data: {
                loginCode: null,
                loginCodeExpiry: null,
                ...(isNewUser && name ? { name } : {}),
            },
        })

        // پیامک خوش‌آمد فقط برای کاربر تازه‌ثبت‌نام‌شده
        if (isNewUser && name) {
            await sendRegisterSuccess(phone, name)
        }

        const cookieStore = await cookies()
        cookieStore.set("userId", String(updatedUser.id), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        })

        return Response.json({
            success: true,
            message: "ورود موفقیت‌آمیز بود",
            isNewUser,
        })
    } catch (error) {
        console.error("VERIFY CODE ERROR:", error)
        return Response.json({ success: false, message: "خطا در تأیید کد" }, { status: 500 })
    }
}