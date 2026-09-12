import { getProductBySlug } from "@/lib/api";
import type { ProductDataType } from "@/types";
import type { ZestyMenuItem } from "@/types/zestyChat";

function menuItemToProduct(item: ZestyMenuItem): ProductDataType {
  return {
    _id: item.productId,
    id: 0,
    name: item.name,
    price: item.price,
    description: item.description,
    image: item.image,
    slug: item.slug,
    category: item.category,
    tags: item.tags,
    allergens: item.allergens,
    quantity: 1,
    width: 224,
    height: 224,
    rating: { stars: 5, reviews: 0 },
  };
}

/** Resolve a Zesty menu card item to a full ProductDataType for cart/wishlist actions. */
export async function resolveZestyMenuItemProduct(
  item: ZestyMenuItem,
): Promise<ProductDataType | null> {
  if (!item.slug) {
    return null;
  }

  const fromApi = await getProductBySlug(item.slug);
  if (fromApi) {
    return fromApi;
  }

  return menuItemToProduct(item);
}
