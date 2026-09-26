import { groupCartItems } from "./group-cart-items";

export type WhatsAppItem = {
  id: number;
  name: string;
  quantity: number;
  description?: string | null;
  selectedOption?: string | null;
  selectedDescription?: string | null;
};

type BuildMessageParams = {
  customerName: string;
  customerPhone: string;
  items: WhatsAppItem[];
};

export function buildWhatsAppMessage({ customerName, customerPhone, items }: BuildMessageParams) {
  const lines = groupCartItems(items).flatMap(({ product, selections, quantity }, index) => {
    const descriptions = [...new Set(selections.map(item => item.selectedDescription).filter(Boolean))];
    const details = (descriptions.length ? descriptions.join("\n") : product.description)
      ?.split("\n")
      .map((detail) => detail.trim())
      .filter(Boolean)
      .map((detail) => `- ${detail.replace(/^[-*]\s*/, "")}`);

    return [
      `Producto ${index + 1}`,
      `Nombre: ${product.name}`,
      `Cantidad total: ${quantity}`,
      ...(details?.length ? ["Detalles:", ...details] : []),
      "Selección:",
      ...selections.map(item => {
        const label = [descriptions.length > 1 ? item.selectedDescription : null, item.selectedOption].filter(Boolean).join(" · ") || "Unidades";
        return `- ${label} — Cantidad: ${item.quantity}`;
      }),
      "",
    ];
  });

  return [
    "Hola, quiero recibir información sobre estos productos:",
    "",
    `Cliente o empresa: ${customerName}`,
    `Número de contacto: ${customerPhone}`,
    "",
    "Productos:",
    ...lines,
  ].join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
