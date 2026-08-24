export async function POST(request: Request) {
    const data = await request.json()
    console.log("سفارش ثبت شد", data)
    return Response.json({ success: true, message: "سفارش شما با موفقیت ثبت شد" })
}