type ProductItem = { id: number; quantity: number };

export function groupCartItems<T extends ProductItem>(items: T[]) {
  const groups = new Map<number, { product: T; selections: T[]; quantity: number }>();
  for (const item of items) {
    const group = groups.get(item.id);
    if (group) {
      group.selections.push(item);
      group.quantity += item.quantity;
    } else {
      groups.set(item.id, { product: item, selections: [item], quantity: item.quantity });
    }
  }
  return [...groups.values()];
}
