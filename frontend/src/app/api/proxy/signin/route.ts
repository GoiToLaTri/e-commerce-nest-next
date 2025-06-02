import { envConfig } from "@/common/configs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = envConfig.BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    console.log("Matching POST request to /api/proxy/signin");
    const body = await req.json();
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const { access_token } = await response.clone().json();
    if (access_token) {
      //   const res = NextResponse.next();
      //   res.cookies.set("access_token", access_token, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === "production",
      //     sameSite: "lax",
      //     path: "/",
      //   });
      (await cookies()).set("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      console.log("Token:", access_token);
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
