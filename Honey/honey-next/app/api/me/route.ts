import prisma from "../../../lib/prisma"
import { cookies } from "next/headers"

export async function GET() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
        return Response.json({ message: "not logged in" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { id: true, phone: true, name: true },
    })

    if (!user) {
        return Response.json({ message: "not found" }, { status: 401 })
    }

    return Response.json(user)
}
