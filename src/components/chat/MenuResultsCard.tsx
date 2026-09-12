"use client";

import Link from "next/link";
import { useState } from "react";
import { useCustomContext } from "@/context/context";
import { resolveZestyMenuItemProduct } from "@/lib/zestyMenuItem";
import type { ZestyMenuItem } from "@/types/zestyChat";

interface Props {
  items: ZestyMenuItem[];
}

function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

function truncate(text: string, maxLength = 120): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength).trim()}…`;
}

function MenuItemActions({ item }: { item: ZestyMenuItem }) {
  const { addToCart, addToWishlist } = useCustomContext();
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [isAddingWishlist, setIsAddingWishlist] = useState(false);

  const handleAddToCart = async () => {
    if (isAddingCart) return;
    setIsAddingCart(true);
    try {
      const product = await resolveZestyMenuItemProduct(item);
      if (!product) return;
      addToCart(product);
    } finally {
      setIsAddingCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (isAddingWishlist) return;
    setIsAddingWishlist(true);
    try {
      const product = await resolveZestyMenuItemProduct(item);
      if (!product) return;
      addToWishlist(product);
    } finally {
      setIsAddingWishlist(false);
    }
  };

  const actionsDisabled = !item.slug;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={actionsDisabled || isAddingCart}
        className="rounded-full bg-zPink px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAddingCart ? "Adding…" : "Add to Cart"}
      </button>
      <button
        type="button"
        onClick={handleAddToWishlist}
        disabled={actionsDisabled || isAddingWishlist}
        className="rounded-full border border-pink-200 bg-white px-3 py-1.5 text-xs font-semibold text-zPink transition-colors hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAddingWishlist ? "Saving…" : "Add to Wishlist"}
      </button>
    </div>
  );
}

const MenuResultsCard = ({ items }: Props) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 rounded-2xl border border-pink-100 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-pink-50 bg-pink-50/60">
        <p className="text-sm font-semibold text-gray-900">Menu picks for you</p>
      </div>

      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li key={item.productId} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-900">{item.name}</p>
                {item.dietary ? (
                  <p className="mt-0.5 text-xs font-medium text-green-700">
                    {item.dietary}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-gray-600">
                  {truncate(item.description)}
                </p>

                {(item.tags.length > 0 || item.allergens.length > 0) && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={`tag-${item.productId}-${tag}`}
                        className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-800"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.allergens.map((allergen) => (
                      <span
                        key={`allergen-${item.productId}-${allergen}`}
                        className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900"
                      >
                        Contains {allergen}
                      </span>
                    ))}
                  </div>
                )}

                <MenuItemActions item={item} />
              </div>

              <p className="shrink-0 text-sm font-bold text-zPink">
                {formatPrice(item.price)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/80">
        <Link
          href="/menu"
          className="text-sm font-semibold text-zPink hover:text-pink-600 transition-colors"
        >
          View full menu →
        </Link>
      </div>
    </div>
  );
};

export default MenuResultsCard;
