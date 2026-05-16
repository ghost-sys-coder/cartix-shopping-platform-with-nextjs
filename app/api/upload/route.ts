import { NextRequest, NextResponse } from "next/server";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { requireAdminResponse } from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
  const adminError = await requireAdminResponse();
  if (adminError) return adminError;

  try {
    const body = await request.json();
    const { data, folder = "cartix/products" } = body;

    if (!data) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    const result = await uploadImage(data, folder);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const adminError = await requireAdminResponse();
  if (adminError) return adminError;

  try {
    const { publicId } = await request.json();
    if (!publicId) return NextResponse.json({ error: "No publicId provided" }, { status: 400 });
    await deleteImage(publicId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/upload error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
