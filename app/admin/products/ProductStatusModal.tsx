"use client";

import { CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";

type ProductStatusModalProps = {
  message: string;
  returnHref?: string;
  confirmLabel?: string;
};

export default function ProductStatusModal({ message, returnHref = "/admin/products", confirmLabel = "Aceptar" }: ProductStatusModalProps) {
  const router = useRouter();

  function goToProducts() {
    router.replace(returnHref, { scroll: false });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl shadow-black/30">
        <div className="flex items-start justify-between gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <button
            type="button"
            onClick={goToProducts}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-5 text-2xl font-black text-slate-950">{message}</h2>

        <button
          type="button"
          onClick={goToProducts}
          className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
