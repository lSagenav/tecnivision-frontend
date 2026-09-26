"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { parseProductDescriptions, parseProductOptions } from "@/lib/product-options";
import { useRouter } from "next/navigation";

type QuickAddProduct = {
  id: number;
  name: string;
  slug: string;
  branchSlug: string;
  imageUrl?: string | null;
  description?: string | null;
  productOptions?: string | null;
};

export default function QuickAddToCartButton({ product }: { product: QuickAddProduct }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  function handleClick() {
    const descriptions = parseProductDescriptions(product.description);
    if (parseProductOptions(product.productOptions).length > 0 || descriptions.length > 1) {
      router.push(`/producto/${product.slug}`);
      return;
    }
    const wasAdded = addItem({ ...product, selectedDescription: descriptions[0] || null, quantity: 1 });

    if (!wasAdded) {
      alert("Usa una sola sede, máximo 20 combinaciones y hasta 99 unidades por combinación en el carrito.");
      return;
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Agregar ${product.name} al carrito`}
      className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-950/25 transition hover:bg-blue-600"
    >
      {added ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
    </button>
  );
}
