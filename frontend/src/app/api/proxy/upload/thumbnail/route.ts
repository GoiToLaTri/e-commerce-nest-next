import { envConfig } from "@/common/configs";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = envConfig.BACKEND_URL;

export async function POST(req: NextRequest) {
  try {
    // console.log("Matching POST request to /api/proxy/upload/thumbnail");

    const formData = await req.formData();
    const file = formData.get("files");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Forward the file to the backend
    const backendRes = await fetch(`${BACKEND_URL}/upload/product-thumbnail`, {
      method: "POST",
      body: formData,
      headers: {
        // Let fetch set the correct Content-Type for multipart/form-data
      },
    });

    const data = await backendRes.json();

    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
