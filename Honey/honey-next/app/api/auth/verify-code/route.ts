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
console.log("VERIFY DEBUG:", {
    phone,
    enteredCode: code,
    savedCode: user.loginCode,
    match: user.loginCode === code,
    expiry: user.loginCodeExpiry,
})
        if (user.loginCode !== code) {
            return Response.json({ success: false, message: "کد وارد شده اشتباه است" }, { status: 400 })
        }

        if (new Date() > user.loginCodeExpiry) {
            return Response.json(
                { success: false, message: "کد منقضی شده است، دوباره درخواست دهید" },
                { status: 400 }
            )
        }

        const isNewUser = !user.name

        // اگر کاربر جدید است و هنوز نام نداده، کد را نگه می‌داریم و فقط درخواست نام می‌کنیم
        if (isNewUser && !name) {
            return Response.json({ success: true, isNewUser: true, needsName: true })
        }

        // حالا که همه‌چیز کامل است، کد را پاک و کاربر را وارد می‌کنیم
        const updatedUser = await prisma.user.update({
            where: { phone },
            data: {
                loginCode: null,
                loginCodeExpiry: null,
                ...(isNewUser && name ? { name } : {}),
            },
        })

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
            needsName: false,
        })
    } catch (error) {
        console.error("VERIFY CODE ERROR:", error)
        return Response.json({ success: false, message: "خطا در تأیید کد" }, { status: 500 })
    }
}