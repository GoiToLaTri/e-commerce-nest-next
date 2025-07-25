import { envConfig } from "@/common/configs";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = envConfig.BACKEND_URL;

async function handleProxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  // console.log("Matching request to /api/proxy/[...path]");
  const { path } = await context.params;
  const query = req.nextUrl.search;
  const url = `${BACKEND_URL}/${path.join("/")}${query}`;
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("cookie");

  const access_token = req.cookies.get("access_token")?.value;

  if (access_token) headers.set("Authorization", `Bearer ${access_token}`);

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
    redirect: "manual",
  };

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
}

// Expose các HTTP methods
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
