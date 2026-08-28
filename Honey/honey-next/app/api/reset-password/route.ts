import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { phone, code, newPassword } = data

        if (!phone || !code || !newPassword) {
            return Response.json({ success: false, message: "اطلاعات ناقص است" }, { status: 400 })
        }

        if (newPassword.length < 4) {
            return Response.json({ success: false, message: "رمز جدید باید حداقل ۴ کاراکتر باشد" }, { status: 400 })
        }

        const user = await prisma.user.findUnique({ where: { phone } })

        if (!user || !user.resetCode || !user.resetCodeExpiry) {
            return Response.json({ success: false, message: "کد نامعتبر است" }, { status: 400 })
        }

        if (user.resetCode !== code) {
            return Response.json({ success: false, message: "کد وارد شده اشتباه است" }, { status: 400 })
        }

        if (new Date() > user.resetCodeExpiry) {
            return Response.json({ success: false, message: "کد منقضی شده است، دوباره درخواست دهید" }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { phone },
            data: { password: hashedPassword, resetCode: null, resetCodeExpiry: null },
        })

        return Response.json({ success: true, message: "رمز عبور با موفقیت تغییر کرد" })
    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error)
        return Response.json({ success: false, message: "خطا در تغییر رمز عبور" }, { status: 500 })
    }
}