export interface ProductImageLike {
  url?: string;
  publicId: string;
  altText?: string | null;
}

export function mergeUniqueProductImages<T extends ProductImageLike>(
  currentImages: T[],
  incomingImages: T[]
): T[] {
  const seenPublicIds = new Set<string>();
  const merged: T[] = [];

  for (const image of [...currentImages, ...incomingImages]) {
    const publicId = image.publicId.trim();
    if (!publicId || seenPublicIds.has(publicId)) continue;
    seenPublicIds.add(publicId);
    merged.push({ ...image, publicId });
  }

  return merged;
}

export function getRemovedCloudinaryPublicIds(
  existingImages: Array<Pick<ProductImageLike, "publicId">>,
  nextImages: Array<Pick<ProductImageLike, "publicId">>
) {
  const nextPublicIds = new Set(
    nextImages.map((image) => image.publicId.trim()).filter(Boolean)
  );

  return [
    ...new Set(
      existingImages
        .map((image) => image.publicId.trim())
        .filter((publicId) => publicId && !nextPublicIds.has(publicId))
    ),
  ];
}
