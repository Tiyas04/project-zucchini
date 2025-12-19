import { NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { handleResponse, handleApiError } from "@repo/shared-utils/src/api-utils";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return handleApiError(new Error("Not found"), "Not found");
  }

  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return handleApiError(
        new Error("Cloudinary credentials not configured"),
        "Server configuration error"
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return handleApiError(new Error("No file provided"), "No file provided");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: "nitrutsav-2026",
      resource_type: "auto",
    });

    return handleResponse({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return handleApiError(error, "Upload failed");
  }
}
