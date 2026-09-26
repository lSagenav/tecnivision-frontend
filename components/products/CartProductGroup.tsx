"use client";

import { cartItemKey, useCartStore, type CartItem } from "@/store/cart-store";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-image";

export default function CartProductGroup({ product, selections, quantity }: {
  product: CartItem; selections: CartItem[]; quantity: number;
}) {
  const { addItem, decreaseItem, removeItem } = useCartStore();
  const descriptions = [...new Set(selections.map(item => item.selectedDescription).filter(Boolean))];
  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xs text-slate-400">
          {product.imageUrl ? <img src={getCloudinaryImageUrl(product.imageUrl, 120)} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : "Sin imagen"}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{product.name}</h2>
          <p className="text-sm text-slate-600">Cantidad total: {quantity}</p>
          {descriptions.length > 0 ? <p className="mt-1 text-sm font-semibold text-blue-700">Descripción: {descriptions.join(" · ")}</p> : product.description && <p className="mt-1 whitespace-pre-line text-xs text-slate-500">{product.description}</p>}
        </div>
        <button type="button" onClick={() => selections.forEach(item => removeItem(item.id, item.selectedOption, item.selectedDescription))} className="cursor-pointer rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50" aria-label={`Eliminar ${product.name} del carrito`}>Eliminar producto</button>
      </div>
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
        <p className="text-sm font-semibold text-slate-700">Selección del producto</p>
        {selections.map(item => {
          const label = [descriptions.length > 1 ? item.selectedDescription : null, item.selectedOption].filter(Boolean).join(" · ") || "Unidades";
          return <div key={cartItemKey(item)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-sm font-semibold text-blue-700">{label}</p>
            <div className="flex items-center gap-2">
              <button type="button" aria-label={`Reducir cantidad de ${label}`} onClick={() => decreaseItem(item.id, item.selectedOption, item.selectedDescription)} className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1 font-semibold hover:bg-white">−</button>
              <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
              <button type="button" aria-label={`Aumentar cantidad de ${label}`} disabled={item.quantity >= 99} onClick={() => { if (!addItem({ ...item, quantity: 1 })) alert("No se puede superar el límite de 99 unidades por combinación."); }} className="cursor-pointer rounded-lg border border-slate-300 px-3 py-1 font-semibold hover:bg-white disabled:cursor-not-allowed disabled:opacity-50">+</button>
              <button type="button" aria-label={`Quitar ${label}`} onClick={() => removeItem(item.id, item.selectedOption, item.selectedDescription)} className="cursor-pointer px-2 py-1 text-sm text-red-600 hover:underline">Quitar</button>
            </div>
          </div>;
        })}
      </div>
    </article>
  );
}
