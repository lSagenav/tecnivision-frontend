import { test } from "node:test";
import assert from "node:assert/strict";
import "./storage-setup";
import { useCartStore } from "../store/cart-store";
import { buildWhatsAppMessage } from "../lib/whatsapp";
import { groupCartItems } from "../lib/group-cart-items";
const base = { id: 1, name: "HDMI", slug: "hdmi", branchSlug: "dorada-caldas", description: "- 4K\n- 8K", selectedDescription: "4K", selectedOption: "4 metros", quantity: 2 };
test("carrito conserva combinaciones y las edita independientemente", () => {
  useCartStore.getState().clearCart();
  assert.equal(useCartStore.getState().addItems([base, { ...base, selectedOption: "8 metros", quantity: 1 }, { ...base, selectedDescription: "8K", quantity: 3 }]), true);
  assert.equal(useCartStore.getState().totalItems(), 6);
  useCartStore.getState().addItem({ ...base, quantity: 1 });
  useCartStore.getState().decreaseItem(1, "4 metros", "8K");
  assert.deepEqual(useCartStore.getState().items.map(item => item.quantity), [3, 1, 2]);
  useCartStore.getState().removeItem(1, "4 metros", "4K");
  assert.equal(useCartStore.getState().items.length, 2);
  useCartStore.getState().updateQuantity(1, 5, "8 metros", "4K");
  assert.deepEqual(useCartStore.getState().items.map(item => item.quantity), [5, 2]);
});
test("agregar varias opciones es atomico al superar limites o mezclar sedes", () => {
  useCartStore.getState().clearCart();
  useCartStore.getState().addItem({ ...base, quantity: 99 });
  const before = JSON.stringify(useCartStore.getState().items);
  assert.equal(useCartStore.getState().addItems([{ ...base, selectedOption: "8 metros" }, base]), false);
  assert.equal(JSON.stringify(useCartStore.getState().items), before);
  assert.equal(useCartStore.getState().addItems([{ ...base, branchSlug: "puerto-boyaca" }]), false);
  assert.equal(JSON.stringify(useCartStore.getState().items), before);
});
test("WhatsApp incluye solo la descripcion elegida y cada tamaño con su cantidad", () => {
  const message = buildWhatsAppMessage({ customerName: "Prueba", customerPhone: "3000000000", items: [base, { ...base, selectedOption: "8 metros", quantity: 1 }] });
  assert.match(message, /Cantidad: 2/);
  assert.match(message, /Cantidad: 1/);
  assert.match(message, /4 metros/);
  assert.match(message, /8 metros/);
  assert.doesNotMatch(message, /8K/);
  assert.equal((message.match(/Nombre: HDMI/g) ?? []).length, 1);
  assert.doesNotMatch(message, /Producto 2/);
  assert.match(message, /Cantidad total: 3/);
});
test("agrupa cuatro tamaños en un producto sin perder cantidades ni versiones", () => {
  const items = [base, { ...base, selectedOption: "6 metros", quantity: 1 }, { ...base, selectedOption: "8 metros", quantity: 3 }, { ...base, selectedDescription: "8K", selectedOption: "10 metros", quantity: 4 }];
  const groups = groupCartItems(items);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].quantity, 10);
  assert.equal(groups[0].selections.length, 4);
  const message = buildWhatsAppMessage({ customerName: "Prueba", customerPhone: "3000000000", items });
  for (const size of ["4 metros", "6 metros", "8 metros", "10 metros"]) assert.ok(message.includes(size));
  assert.match(message, /8K · 10 metros — Cantidad: 4/);
});
test("productos diferentes con igual nombre siguen separados", () => {
  assert.equal(groupCartItems([base, { ...base, id: 2 }]).length, 2);
});
test("conserva las selecciones al recuperar el carrito guardado", async () => {
  useCartStore.getState().clearCart();
  useCartStore.getState().addItems([base, { ...base, selectedDescription: "8K" }]);
  await useCartStore.persist.rehydrate();
  assert.deepEqual(useCartStore.getState().items.map(item => item.selectedDescription), ["4K", "8K"]);
});
