import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const representatives =
      await prisma.representative.findMany({
        orderBy: [
          { province: "asc" },
          { city: "asc" },
          { name: "asc" },
        ],
      });

    return NextResponse.json(representatives);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "خطا در دریافت نمایندگان" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const province = String(body.province ?? "").trim();
    const city = String(body.city ?? "").trim();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const address = String(body.address ?? "").trim();
    const description = String(
      body.description ?? ""
    ).trim();

    if (!province || !city || !name || !phone || !address) {
      return NextResponse.json(
        { error: "اطلاعات ضروری کامل نیست." },
        { status: 400 }
      );
    }

    const representative =
      await prisma.representative.create({
        data: {
          province,
          city,
          name,
          phone,
          address,
          description: description || null,
        },
      });

    return NextResponse.json(representative, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "خطا در ایجاد نماینده" },
      { status: 500 }
    );
  }
} 