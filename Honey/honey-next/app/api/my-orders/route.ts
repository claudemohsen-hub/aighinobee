import prisma from "../../../lib/prisma"
import { cookies } from "next/headers"

export async function GET() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
        return Response.json([])
    }

    const orders = await prisma.order.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: "desc" },
    })

    return Response.json(orders)
}
