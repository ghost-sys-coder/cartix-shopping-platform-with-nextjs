import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export function normalizeCloudinaryFolderSegment(value: string) {
  return value
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) =>
      segment
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
    )
    .filter(Boolean)
    .join("/");
}

export function getCloudinaryFolder(subfolder = "products") {
  const baseFolder =
    normalizeCloudinaryFolderSegment(
      process.env.CLOUDINARY_FOLDER_NAME ?? "cartix"
    ) || "cartix";
  const childFolder = normalizeCloudinaryFolderSegment(subfolder);

  if (!childFolder || childFolder === baseFolder) return baseFolder;
  if (childFolder.startsWith(`${baseFolder}/`)) return childFolder;

  return `${baseFolder}/${childFolder}`;
}

export async function uploadImage(
  file: string,
  folder = getCloudinaryFolder("products")
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string } = {}
): string {
  return cloudinary.url(publicId, {
    fetch_format: "auto",
    quality: "auto",
    ...options,
  });
}
