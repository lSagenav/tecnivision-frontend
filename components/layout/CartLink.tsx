"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart-store";

function subscribe() {
  return () => {};
}

export default function CartLink() {
  const totalItems = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <Link href="/carrito" className="relative">
      Carrito
      {mounted && totalItems > 0 && (
        <span className="absolute -right-4 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-900 px-1 text-xs font-bold text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
