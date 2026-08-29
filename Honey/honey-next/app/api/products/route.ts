import prisma from "../../../lib/prisma"

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            include: { images: { orderBy: { sortOrder: "asc" } } },
        })
        return Response.json(products)
    } catch (error) {
        console.error("GET PRODUCTS ERROR:", error)
        return Response.json({ success: false, message: "خطا در دریافت محصولات" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()

        if (!data.name || !data.price) {
            return Response.json({ success: false, message: "نام و قیمت محصول الزامی است" }, { status: 400 })
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                price: Number(data.price),
                shortDesc: data.shortDesc || null,
                description: data.description || null,
                weight: data.weight || null,
                honeyType: data.honeyType || null,
                productYear: data.productYear || null,
                expiry: data.expiry || null,
                benefits: data.benefits || null,
                suitableFor: data.suitableFor || null,
                images: data.images?.length ? {
                    create: data.images.map((img: any, index: number) => ({
                        url: img.url,
                        alt: img.alt || data.name,
                        filename: img.filename || null,
                        sortOrder: index,
                        isPrimary: index === 0,
                    })),
                } : undefined,
            },
            include: { images: true },
        })

        return Response.json({ success: true, product })
    } catch (error) {
        console.error("CREATE PRODUCT ERROR:", error)
        return Response.json({ success: false, message: "خطا در ایجاد محصول" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json()

        if (!data.id) {
            return Response.json({ success: false, message: "شناسه محصول الزامی است" }, { status: 400 })
        }

        const product = await prisma.product.update({
            where: { id: Number(data.id) },
            data: {
                name: data.name,
                price: Number(data.price),
                shortDesc: data.shortDesc || null,
                description: data.description || null,
                weight: data.weight || null,
                honeyType: data.honeyType || null,
                productYear: data.productYear || null,
                expiry: data.expiry || null,
                benefits: data.benefits || null,
                suitableFor: data.suitableFor || null,
                isActive: data.isActive !== undefined ? data.isActive : true,
            },
        })

        // آپدیت تصاویر: حذف قبلی‌ها و اضافه‌ی جدید
        if (data.images) {
            await prisma.productImage.deleteMany({ where: { productId: product.id } })
            if (data.images.length > 0) {
                await prisma.productImage.createMany({
                    data: data.images.map((img: any, index: number) => ({
                        productId: product.id,
                        url: img.url,
                        alt: img.alt || product.name,
                        filename: img.filename || null,
                        sortOrder: index,
                        isPrimary: index === 0,
                    })),
                })
            }
        }

        const updated = await prisma.product.findUnique({
            where: { id: product.id },
            include: { images: { orderBy: { sortOrder: "asc" } } },
        })

        return Response.json({ success: true, product: updated })
    } catch (error) {
        console.error("UPDATE PRODUCT ERROR:", error)
        return Response.json({ success: false, message: "خطا در ویرایش محصول" }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const data = await request.json()

        if (!data.id) {
            return Response.json({ success: false, message: "شناسه محصول الزامی است" }, { status: 400 })
        }

        // دریافت تصاویر برای حذف از storage
        const product = await prisma.product.findUnique({
            where: { id: Number(data.id) },
            include: { images: true },
        })

        if (!product) {
            return Response.json({ success: false, message: "محصول یافت نشد" }, { status: 404 })
        }

        // حذف فایل‌های تصویر از storage
        for (const img of product.images) {
            if (img.filename) {
                try {
                    await fetch(process.env.MEDIA_UPLOAD_URL!, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.UPLOAD_SECRET}`,
                        },
                        body: JSON.stringify({ filename: img.filename }),
                    })
                } catch (e) {
                    console.error("Failed to delete image file:", img.filename, e)
                }
            }
        }

        // حذف محصول (تصاویر هم cascade حذف می‌شن)
        await prisma.product.delete({ where: { id: Number(data.id) } })

        return Response.json({ success: true, message: "محصول حذف شد" })
    } catch (error) {
        console.error("DELETE PRODUCT ERROR:", error)
        return Response.json({ success: false, message: "خطا در حذف محصول" }, { status: 500 })
    }
}