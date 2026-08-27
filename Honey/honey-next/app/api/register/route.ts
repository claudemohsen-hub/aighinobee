import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { name, phone, password } = await request.json();

  if (!name || !phone || !password) {
    return NextResponse.json(
      { error: "نام، شماره موبایل و رمز عبور الزامی است" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "این شماره موبایل قبلاً ثبت شده است" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
    },
  });

  return NextResponse.json({
    message: "ثبت‌نام با موفقیت انجام شد",
    userId: user.id,
  });
}