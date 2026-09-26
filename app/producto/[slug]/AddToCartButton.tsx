"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { parseProductDescriptions, parseProductOptions } from "@/lib/product-options";
type Product = {
  id: number; name: string; slug: string; branchSlug: string;
  imageUrl?: string | null; description?: string | null; productOptions?: string | null;
};
export default function AddToCartButton({ product }: { product: Product }) {
  const router = useRouter();
  const addItems = useCartStore(state => state.addItems);
  const descriptions = parseProductDescriptions(product.description);
  const options = [...new Set(parseProductOptions(product.productOptions))];
  const [selectedDescription, setSelectedDescription] = useState(descriptions.length === 1 ? descriptions[0] : "");
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState("1");
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");
  function resetFeedback() { setAdded(false); setError(""); }
  function handleAddToCart() {
    resetFeedback();
    if (descriptions.length > 1 && !selectedDescription) { setError("Elige una descripción del producto."); return; }
    const selected = options.filter(option => Object.hasOwn(quantities, option));
    if (options.length && !selected.length) { setError("Selecciona al menos una opción del producto."); return; }
    const additions = (options.length ? selected : [null]).map(option => ({
      ...product, selectedDescription: selectedDescription || null, selectedOption: option,
      quantity: Number(option === null ? quantity : quantities[option]),
    }));
    if (additions.some(item => !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) { setError("Ingresa una cantidad entera entre 1 y 99 para cada opción."); return; }
    if (!addItems(additions)) { setError("No se agregó la selección. Usa una sola sede, máximo 20 combinaciones y hasta 99 unidades por combinación, incluyendo lo que ya tienes en el carrito."); return; }
    setAdded(true);
    router.push(`/catalogo?sede=${encodeURIComponent(product.branchSlug)}&agregado=1`);
  }
  return <div>
    {descriptions.length > 1 && <fieldset className="mb-5">
      <legend className="mb-3 text-sm font-bold text-slate-900">Elige una descripción</legend>
      <div className="grid gap-2">{descriptions.map(description => <label key={description} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${selectedDescription === description ? "border-blue-600 bg-blue-50" : "border-slate-300"}`}>
        <input type="radio" name={`description-${product.id}`} value={description} checked={selectedDescription === description} onChange={() => { setSelectedDescription(description); resetFeedback(); }} className="mt-1 accent-blue-600" />
        <span>{description}</span>
      </label>)}</div>
    </fieldset>}
    {options.length > 0 ? <fieldset className="mb-5">
      <legend className="text-sm font-bold text-slate-900">Elige una o varias opciones</legend>
      <p className="mb-3 mt-1 text-sm text-slate-600">Indica cuántas unidades quieres de cada una.</p>
      <div className="grid gap-2">{options.map(option => {
        const selected = Object.hasOwn(quantities, option);
        return <div key={option} className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3 ${selected ? "border-blue-600 bg-blue-50" : "border-slate-300"}`}>
          <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
            <input type="checkbox" checked={selected} onChange={event => {
              const checked = event.target.checked;
              setQuantities(current => { const next = { ...current }; if (checked) next[option] = "1"; else delete next[option]; return next; });
              resetFeedback();
            }} className="accent-blue-600" />{option}
          </label>
          {selected && <label className="flex items-center gap-2 text-sm">Cantidad
            <input type="number" min="1" max="99" step="1" aria-label={`Cantidad de ${option}`} value={quantities[option]} onChange={event => { setQuantities(current => ({ ...current, [option]: event.target.value })); resetFeedback(); }} className="w-20 rounded-lg border border-slate-300 bg-white px-2 py-1" />
          </label>}
        </div>;
      })}</div>
    </fieldset> : <label className="mb-5 flex items-center gap-3 text-sm font-semibold">Cantidad
      <input type="number" min="1" max="99" step="1" value={quantity} onChange={event => { setQuantity(event.target.value); resetFeedback(); }} className="w-20 rounded-lg border border-slate-300 px-2 py-1" />
    </label>}
    <button type="button" onClick={handleAddToCart} disabled={added} className="inline-flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-950 px-6 font-bold text-white transition hover:bg-blue-600 disabled:cursor-default disabled:opacity-60">
      <ShoppingBag className="h-5 w-5" />{added ? "Agregado al carrito" : "Agregar al carrito"}
    </button>
    {added && <div role="status" className="mt-3 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">Selección agregada al carrito. Volviendo al catálogo…</div>}
    {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
  </div>;
}
