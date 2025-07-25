import { envConfig } from "@/common/configs";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = envConfig.BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    // console.log("Matching POST request to /api/proxy/signup");
    const body = await req.json();
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
