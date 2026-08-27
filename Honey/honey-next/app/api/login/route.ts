import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { phone, password } = await request.json();

  if (!phone || !password) {
    return NextResponse.json(
      { error: "شماره موبایل و رمز عبور الزامی است" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: "شماره موبایل یا رمز عبور اشتباه است" },
      { status: 401 }
    );
  }

  const passwordIsCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordIsCorrect) {
    return NextResponse.json(
      { error: "شماره موبایل یا رمز عبور اشتباه است" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
  message: "ورود با موفقیت انجام شد",
  userId: user.id,
});

response.cookies.set("userId", String(user.id), {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
});

return response;
}