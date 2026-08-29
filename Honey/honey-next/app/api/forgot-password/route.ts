import prisma from "../../../lib/prisma"
import { sendForgotPasswordCode } from "../../../lib/sms"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const phone = data.phone

        if (!phone) {
            return Response.json({ success: false, message: "شماره موبایل الزامی است" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { phone } })

        // برای امنیت، حتی اگه کاربر پیدا نشد، همون پیام موفقیت رو نشون می‌دیم
        // (تا کسی نفهمه چه شماره‌هایی توی سیستم ثبت‌نام کردن)
        if (!user) {
            return Response.json({ success: true, message: "اگر این شماره ثبت‌نام کرده باشد، کد برایش ارسال می‌شود" })
        }

        const code = Math.floor(10000 + Math.random() * 90000).toString() // کد ۵ رقمی
        const expiry = new Date(Date.now() + 10 * 60 * 1000) // ۱۰ دقیقه اعتبار

        await prisma.user.update({
            where: { phone },
            data: { resetCode: code, resetCodeExpiry: expiry },
        })

        await sendForgotPasswordCode(phone, code)

        return Response.json({ success: true, message: "کد تأیید برای شما پیامک شد" })
    } catch (error) {
        console.error("FORGOT PASSWORD ERROR:", error)
        return Response.json({ success: false, message: "خطا در ارسال کد" }, { status: 500 })
    }
}