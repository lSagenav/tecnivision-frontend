"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { getBranchBySlug } from "@/lib/branches";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { groupCartItems } from "@/lib/group-cart-items";
import CartProductGroup from "@/components/products/CartProductGroup";
import pageBackground from "@/img/3.jpg";

const phonePattern = /^[+()\d\s-]{7,30}$/;

export default function CartPage() {
  const {
    items,
    clearCart,
  } = useCartStore();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const contactSummary = customerName.trim() || "cliente sin nombre";

  const handleCheckout = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert("Debes ingresar nombre del cliente o empresa y numero de contacto.");
      return;
    }

    if (!phonePattern.test(customerPhone.trim())) {
      alert("Ingresa un numero de contacto valido, minimo 7 digitos.");
      return;
    }

    if (items.length === 0) {
      alert("Tu carrito esta vacio.");
      return;
    }

    const branchSlugs = new Set(items.map((item) => item.branchSlug).filter(Boolean));

    if (branchSlugs.size > 1) {
      alert("El carrito tiene productos de sedes diferentes. Elimina productos y deja solo una sede para continuar.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "No se pudo crear la solicitud.");
      }

      const message = buildWhatsAppMessage({
        customerName,
        customerPhone,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          description: item.description,
          selectedOption: item.selectedOption,
          selectedDescription: item.selectedDescription,
        })),
      });

      const branch = getBranchBySlug(items[0]?.branchSlug ?? undefined);
      const phone = branch?.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "573001234567";
      const whatsappUrl = buildWhatsAppUrl(phone, message);

      clearCart();
      window.location.href = whatsappUrl;
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Ocurrio un error al procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-full bg-slate-950 bg-cover bg-fixed bg-center px-4 py-14 sm:px-6"
      style={{ backgroundImage: `linear-gradient(rgba(2, 6, 23, .76), rgba(2, 6, 23, .84)), url(${pageBackground.src})` }}
    >
    <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <section>
        <h1 className="mb-6 text-3xl font-bold text-white">Carrito</h1>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-slate-600">No hay productos en el carrito.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupCartItems(items).map(group => <CartProductGroup key={group.product.id} {...group} />)}
          </div>
        )}
      </section>

      <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">Datos de contacto</h2>
        <p className="mb-4 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
          Solicitud para: {contactSummary}
        </p>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nombre del cliente o empresa
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="Nombre o razon social"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Numero del cliente
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="Numero de contacto"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
          className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Procesando..." : "Solicitar informacion por WhatsApp"}
        </button>
      </aside>
    </div>
    </div>
  );
}
