import prisma from "../../../lib/prisma"

export async function GET() {
    try {
        const representatives = await prisma.representative.findMany({
            orderBy: [{ province: "asc" }, { city: "asc" }, { name: "asc" }],
        })
        return Response.json(representatives)
    } catch (error) {
        console.error("GET REPRESENTATIVES ERROR:", error)
        return Response.json({ success: false, message: "خطا در دریافت نمایندگان" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()

        const province = String(data.province || "").trim()
        const city = String(data.city || "").trim()
        const name = String(data.name || "").trim()
        const phone = String(data.phone || "").trim()
        const address = String(data.address || "").trim()
        const description = String(data.description || "").trim()

        if (!province || !city || !name || !phone || !address) {
            return Response.json(
                { success: false, message: "استان، شهر، نام، شماره و آدرس الزامی است" },
                { status: 400 }
            )
        }

        const representative = await prisma.representative.create({
            data: { province, city, name, phone, address, description: description || null },
        })

        return Response.json({ success: true, representative })
    } catch (error) {
        console.error("CREATE REPRESENTATIVE ERROR:", error)
        return Response.json({ success: false, message: "خطا در افزودن نماینده" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json()

        if (!data.id) {
            return Response.json({ success: false, message: "شناسه نماینده الزامی است" }, { status: 400 })
        }

        const representative = await prisma.representative.update({
            where: { id: Number(data.id) },
            data: {
                province: String(data.province || "").trim(),
                city: String(data.city || "").trim(),
                name: String(data.name || "").trim(),
                phone: String(data.phone || "").trim(),
                address: String(data.address || "").trim(),
                description: data.description ? String(data.description).trim() : null,
            },
        })

        return Response.json({ success: true, representative })
    } catch (error) {
        console.error("UPDATE REPRESENTATIVE ERROR:", error)
        return Response.json({ success: false, message: "خطا در ویرایش نماینده" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const data = await request.json()

        if (!data.id) {
            return Response.json({ success: false, message: "شناسه نماینده الزامی است" }, { status: 400 })
        }

        await prisma.representative.delete({ where: { id: Number(data.id) } })

        return Response.json({ success: true, message: "نماینده حذف شد" })
    } catch (error) {
        console.error("DELETE REPRESENTATIVE ERROR:", error)
        return Response.json({ success: false, message: "خطا در حذف نماینده" }, { status: 500 })
    }
}