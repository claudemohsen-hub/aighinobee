import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.UPLOAD_SECRET;

    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          message: "UPLOAD_SECRET is not configured",
        },
        { status: 500 }
      );
    }

    const contentType =
      request.headers.get("content-type") || "";

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid image type",
        },
        { status: 400 }
      );
    }

    const contentLength =
      request.headers.get("content-length");

    if (
      contentLength &&
      Number(contentLength) > 5 * 1024 * 1024
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "File too large. Maximum size is 5MB.",
        },
        { status: 413 }
      );
    }

    const body = await request.arrayBuffer();

    if (body.byteLength === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Empty file",
        },
        { status: 400 }
      );
    }

    if (body.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "File too large. Maximum size is 5MB.",
        },
        { status: 413 }
      );
    }

    const response = await fetch(
      "https://media.iginobee.com/api.php",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": contentType,
        },
        body,
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from image server",
          response: text,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
      },
      { status: 500 }
    );
  }
} 