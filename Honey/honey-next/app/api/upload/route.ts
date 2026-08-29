export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            return Response.json({ success: false, message: "فایلی انتخاب نشده" }, { status: 400 })
        }

        // ارسال به PHP API روی media.iginobee.com
        const uploadForm = new FormData()
        uploadForm.append("file", file)

        const res = await fetch(process.env.MEDIA_UPLOAD_URL!, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.UPLOAD_SECRET}`,
            },
            body: uploadForm,
        })

        const data = await res.json()
        return Response.json(data, { status: res.status })
    } catch (error) {
        console.error("UPLOAD PROXY ERROR:", error)
        return Response.json({ success: false, message: "خطا در آپلود تصویر" }, { status: 500 })
    }
}