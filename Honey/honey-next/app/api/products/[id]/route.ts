import prisma from "../../../../lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const product = await prisma.product.findUnique({
            where: { id: Number(id), isActive: true },
            include: { images: { orderBy: { sortOrder: "asc" } } },
        })

        if (!product) {
            return Response.json({ success: false, message: "محصول یافت نشد" }, { status: 404 })
        }

        return Response.json(product)
    } catch (error) {
        console.error("GET PRODUCT ERROR:", error)
        return Response.json({ success: false, message: "خطا" }, { status: 500 })
    }
}