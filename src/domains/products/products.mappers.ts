import { API_CONFIG } from "@/src/config/api.config";
import type { Product, ProductMetadata } from "./products.types";

type RawProduct = Record<string, unknown>;

function readMetadata(metadata: unknown): ProductMetadata {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  const value = metadata as Record<string, unknown>;

  return {
    category: typeof value.category === "string" ? value.category : undefined,
    sku: typeof value.sku === "string" ? value.sku : undefined,
    images: Array.isArray(value.images)
      ? value.images.filter((image): image is string => typeof image === "string" && image.length > 0)
      : undefined,
  };
}

function toPrice(value: unknown): number {
  const normalized = typeof value === "string" ? parseFloat(value) : value;
  return typeof normalized === "number" && Number.isFinite(normalized) ? normalized : 0;
}

function toStatus(stock?: number | null, isAvailable?: boolean): string {
  if (isAvailable === false) return "Draft";
  if ((stock ?? 0) <= 0) return "Out of Stock";
  if ((stock ?? 0) < 10) return "Low Stock";
  return "Active";
}

function resolveImageUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (/^(https?:|data:|blob:)/i.test(normalized)) {
    return normalized;
  }

  if (normalized.startsWith("//")) {
    return `https:${normalized}`;
  }

  if (normalized.startsWith("/")) {
    const apiOrigin = API_CONFIG.BASE_URL.replace(/\/api\/?$/, "");
    return `${apiOrigin}${normalized}`;
  }

  return normalized;
}

export function mapProduct(raw: RawProduct): Product {
  const merchant = raw.merchant as { businessName?: string; isVerified?: boolean } | undefined;
  const product = raw as unknown as Partial<Product>;
  const metadata = readMetadata(raw.metadata);
  const price = toPrice(raw.price);
  const stock = typeof raw.stock === "number" ? raw.stock : null;
  const metadataImages = metadata.images
    ?.map((image) => resolveImageUrl(image))
    .filter((image): image is string => Boolean(image)) ?? [];
  const explicitImages = Array.isArray(raw.images)
    ? raw.images.map((item) => resolveImageUrl(item)).filter((item): item is string => Boolean(item))
    : Array.isArray(product.images)
      ? product.images.map((item) => resolveImageUrl(item)).filter((item): item is string => Boolean(item))
      : [];
  const image = resolveImageUrl(raw.image) || resolveImageUrl(product.image) || explicitImages[0] || metadataImages[0] || null;
  const images = explicitImages.length
    ? explicitImages
    : image
      ? [image, ...metadataImages.filter((item) => item !== image)]
      : metadataImages;
  const isAvailable = raw.isAvailable !== false;
  const merchantName = merchant?.businessName || product.merchantName || product.brand;

  return {
    ...(raw as unknown as Product),
    id: (raw.id as string) || (raw._id as string),
    price,
    stock,
    isAvailable,
    brand: merchantName,
    merchantName,
    formattedPrice: `GHc${price.toLocaleString()}`,
    category: metadata.category || product.category || "General",
    sku: metadata.sku || product.sku || "N/A",
    image,
    images,
    status: toStatus(stock, isAvailable),
    metadata: raw.metadata as Record<string, unknown> | null,
  };
}

export function toMerchantProductPayload(product: {
  name?: string;
  description?: string;
  category?: string;
  price?: string | number;
  sku?: string;
  stock?: number;
  images?: string[];
  isAvailable?: boolean;
}) {
  const parsedPrice =
    typeof product.price === "string"
      ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
      : product.price;

  return {
    name: product.name,
    description: product.description,
    category: product.category,
    price: typeof parsedPrice === "number" && Number.isFinite(parsedPrice) ? parsedPrice : undefined,
    sku: product.sku,
    stock: product.stock,
    image: product.images?.[0],
    images: product.images,
    isAvailable: product.isAvailable,
  };
}
