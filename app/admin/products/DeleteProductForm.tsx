"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";

type DeleteProductFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  productId: number;
  productName: string;
};

export default function DeleteProductForm({ action, productId, productName }: DeleteProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg border border-red-200 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        Eliminar
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl shadow-black/30">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-red-50 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Cerrar"
                className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">Eliminar producto</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              ¿Seguro que quieres eliminar <span className="font-bold text-slate-950">{productName}</span>? Se borrará de la base de datos junto con su imagen.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <form action={action}>
                <input type="hidden" name="id" value={productId} />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
                >
                  Sí, eliminar
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
