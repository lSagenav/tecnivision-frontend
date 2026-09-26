"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { parseProductOptions } from "@/lib/product-options";

export default function ProductOptionsField({ defaultValue }: { defaultValue?: string | null }) {
  const [options, setOptions] = useState(() => parseProductOptions(defaultValue));
  const [option, setOption] = useState("");
  const serializedOptions = useMemo(() => JSON.stringify(options), [options]);

  function addOption() {
    const nextOption = option.trim().replace(/\s+/g, " ");

    if (!nextOption || options.some((item) => item.toLocaleLowerCase("es") === nextOption.toLocaleLowerCase("es"))) return;

    setOptions((current) => [...current, nextOption]);
    setOption("");
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium" htmlFor="product-option">Opciones del producto (opcional)</label>
      <p className="text-xs text-slate-500">El cliente podrá elegir una o varias opciones y una cantidad para cada una. Ejemplo: 4 metros, 6 metros, 8 metros.</p>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          id="product-option"
          value={option}
          onChange={(event) => setOption(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addOption();
            }
          }}
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
          placeholder="Ej: 4 metros"
        />
        <button type="button" onClick={addOption} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Agregar opción
        </button>
      </div>
      {options.length > 0 && (
        <div className="space-y-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
          {options.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm">
              <span>{item}</span>
              <button type="button" onClick={() => setOptions((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Eliminar opción ${item}`} className="grid h-7 w-7 place-items-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <input type="hidden" name="productOptions" value={serializedOptions} />
    </div>
  );
}
