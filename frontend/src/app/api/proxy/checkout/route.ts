import { envConfig } from "@/common/configs";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = envConfig.BACKEND_URL;

export async function GET(req: NextRequest) {
  try {
    // console.log("Matching GET request to /api/proxy/checkout");
    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.delete("cookie");
    const access_token = req.cookies.get("access_token")?.value;
    const checkoutSessionId = req.cookies.get("checkout_session_id")?.value;

    if (access_token) headers.set("Authorization", `Bearer ${access_token}`);
    if (checkoutSessionId)
      headers.set("checkout_session_id", checkoutSessionId);

    const fetchOptions: RequestInit = {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
      redirect: "manual",
      cache: "no-store",
    };
    const url = `${BACKEND_URL}/checkout/`;
    const response = await fetch(url, fetchOptions);

    const resHeaders = new Headers(response.headers);
    resHeaders.delete("content-encoding");
    resHeaders.delete("content-length");
    resHeaders.delete("transfer-encoding");
    resHeaders.delete("connection");

    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
