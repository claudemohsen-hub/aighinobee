import prisma from "../../../../lib/prisma"
import { sendLoginCode } from "../../../../lib/sms"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const phone = String(data.phone || "").trim()

        if (!/^09\d{9}$/.test(phone)) {
            return Response.json(
                { success: false, message: "شماره موبایل معتبر وارد کنید" },
                { status: 400 }
            )
        }

        const code = Math.floor(10000 + Math.random() * 90000).toString() // کد ۵ رقمی
        const expiry = new Date(Date.now() + 5 * 60 * 1000) // ۵ دقیقه اعتبار

        // اگر کاربر هست به‌روزرسانی، اگر نیست فقط کد را نگه می‌داریم تا بعد از تأیید ساخته شود
        const existingUser = await prisma.user.findUnique({ where: { phone } })

        if (existingUser) {
            await prisma.user.update({
                where: { phone },
                data: { loginCode: code, loginCodeExpiry: expiry },
            })
        } else {
            await prisma.user.create({
                data: { phone, loginCode: code, loginCodeExpiry: expiry },
            })
        }

        const smsResult = await sendLoginCode(phone, code)

        if (!smsResult.success) {
            console.error("SEND CODE SMS FAILED:", smsResult.error)
            return Response.json(
                { success: false, message: "خطا در ارسال پیامک، دوباره تلاش کنید" },
                { status: 500 }
            )
        }

        return Response.json({ success: true, message: "کد ورود برای شما پیامک شد" })
    } catch (error) {
        console.error("SEND CODE ERROR:", error)
        return Response.json({ success: false, message: "خطا در ارسال کد" }, { status: 500 })
    }
}