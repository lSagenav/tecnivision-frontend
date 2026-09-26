"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";

type ProductDescriptionFieldProps = {
  defaultValue?: string;
};

function normalizeDetail(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function splitInitialDetails(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*]\s*/, ""));
}

export default function ProductDescriptionField({ defaultValue = "" }: ProductDescriptionFieldProps) {
  const [details, setDetails] = useState(() => splitInitialDetails(defaultValue));
  const [detail, setDetail] = useState("");

  const description = useMemo(() => details.map((item) => `- ${item}`).join("\n"), [details]);

  function addDetail() {
    const nextDetail = normalizeDetail(detail);

    if (!nextDetail) {
      return;
    }

    setDetails((current) => [...current, nextDetail]);
    setDetail("");
  }

  function removeDetail(index: number) {
    setDetails((current) => current.filter((_, detailIndex) => detailIndex !== index));
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium" htmlFor="product-detail">
        Descripcion
      </label>
      <p className="text-xs text-slate-500">Agrega cada descripción por separado, por ejemplo HDMI 4K y HDMI 8K. Si hay varias, el cliente elegirá una. Agrega los tamaños en Opciones del producto.</p>

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          id="product-detail"
          type="text"
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addDetail();
            }
          }}
          className="w-full rounded-xl border border-slate-300 px-3 py-2"
          placeholder="Ej: Cable HDMI 4K"
        />
        <button
          type="button"
          onClick={addDetail}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          <Plus className="h-4 w-4" />
          Agregar detalle
        </button>
      </div>

      {details.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="space-y-2">
            {details.map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm">
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeDetail(index)}
                  aria-label={`Eliminar detalle ${item}`}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <input type="hidden" name="description" value={description} />
    </div>
  );
}
