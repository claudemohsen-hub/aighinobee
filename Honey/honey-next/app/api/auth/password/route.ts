import prisma from "../../../../lib/prisma"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { sendRegisterSuccess } from "../../../../lib/sms"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const phone = String(data.phone || "").trim()
        const name = String(data.name || "").trim()
        const password = String(data.password || "")

        if (!/^09\d{9}$/.test(phone)) {
            return Response.json(
                { success: false, message: "شماره موبایل معتبر وارد کنید" },
                { status: 400 }
            )
        }

        if (!password || password.length < 4) {
            return Response.json(
                { success: false, message: "رمز عبور باید حداقل ۴ کاراکتر باشد" },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({ where: { phone } })

        // حالت ۱: کاربر وجود دارد و رمز دارد → تلاش برای ورود
        if (user && user.password) {
            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) {
                return Response.json(
                    { success: false, message: "رمز عبور اشتباه است" },
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
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // حالت ۲: کاربر وجود دارد ولی رمز ندارد (قبلاً با پیامک ثبت‌نام کرده)
        // → رمز جدید برایش تنظیم می‌شود و از این پس هر دو روش کار می‌کند
        if (user && !user.password) {
            const updated = await prisma.user.update({
                where: { phone },
                data: {
                    password: hashedPassword,
                    ...(name && !user.name ? { name } : {}),
                },
            })

            const cookieStore = await cookies()
            cookieStore.set("userId", String(updated.id), {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
            })

            return Response.json({
                success: true,
                message: "رمز عبور برای حساب شما تنظیم شد و وارد شدید",
            })
        }

        // حالت ۳: کاربر جدید → ثبت‌نام کامل
        if (!name) {
            return Response.json(
                { success: false, message: "برای ثبت‌نام، نام خود را وارد کنید" },
                { status: 400 }
            )
        }

        const newUser = await prisma.user.create({
            data: { phone, name, password: hashedPassword },
        })

        await sendRegisterSuccess(phone, name)

        const cookieStore = await cookies()
        cookieStore.set("userId", String(newUser.id), {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
        })

        return Response.json({ success: true, message: "ثبت‌نام با موفقیت انجام شد" })
    } catch (error) {
        console.error("PASSWORD AUTH ERROR:", error)
        return Response.json({ success: false, message: "خطا در ورود/ثبت‌نام" }, { status: 500 })
    }
}