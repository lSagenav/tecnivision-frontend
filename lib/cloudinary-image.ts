/** Generates a delivery URL only; callers keep the original URL in product/cart data. */
export function getCloudinaryImageUrl(url: string, width: number): string {
  if (!Number.isSafeInteger(width) || width <= 0) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "res.cloudinary.com" || !["https:", "http:"].includes(parsed.protocol)) return url;
    const match = parsed.pathname.match(/^(\/[^/]+\/image\/upload\/)(.+)$/);
    if (!match) return url;
    const [, prefix, asset] = match;
    // Signed URLs must be delivered unchanged: modifying their path invalidates the signature.
    if (asset.startsWith("s--") || parsed.searchParams.has("__cld_token__")) return url;
    const transformation = `f_auto,q_auto,c_limit,w_${width}`;
    // Replace this helper's transformation if called again, rather than stacking sizes.
    const originalAsset = asset.replace(/^f_auto,q_auto,c_limit,w_\d+\//, "");
    parsed.pathname = `${prefix}${transformation}/${originalAsset}`;
    return parsed.toString();
  } catch {
    return url;
  }
}
