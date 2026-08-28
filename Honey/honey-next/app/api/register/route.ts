import prisma from "../../../lib/prisma"
import bcrypt from "bcryptjs"
import { sendRegisterSuccess } from "../../../lib/sms"

export async function POST(request: Request) {
    try {
        const data = await request.json()

        const existing = await prisma.user.findUnique({
            where: { phone: data.phone },
        })

        if (existing) {
            return Response.json(
                { success: false, message: "این شماره قبلاً ثبت‌نام کرده است" },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const user = await prisma.user.create({
            data: {
                phone: data.phone,
                password: hashedPassword,
                name: data.name,
            },
        })

        sendRegisterSuccess(data.phone, data.name)

        return Response.json({ success: true, message: "ثبت‌نام با موفقیت انجام شد" })
    } catch (error) {
        console.error("REGISTER ERROR:", error)
        return Response.json(
            { success: false, message: "خطا در ثبت‌نام" },
            { status: 500 }
        )
    }
}