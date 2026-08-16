import { NextRequest, NextResponse } from "next/server";
import * as cookie from "cookie";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = String(body.password ?? "");

    const correctPassword = process.env.PAGE_ACCESS_PASSWORD;

    if (!correctPassword) {
      console.error(
        "PAGE_ACCESS_PASSWORD environment variable is not set",
      );

      return NextResponse.json(
        {
          success: false,
          message: "Internal server error",
        },
        { status: 500 },
      );
    }

    if (password !== correctPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Incorrect password",
        },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      {
        success: true,
      },
      { status: 200 },
    );

    response.headers.set(
      "Set-Cookie",
      cookie.serialize(
        "authToken",
        "authenticated",
        {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 30,
          sameSite: "strict",
          path: "/",
        },
      ),
    );

    return response;
  } catch (error) {
    console.error(
      "Authentication error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Invalid request",
      },
      { status: 400 },
    );
  }
}