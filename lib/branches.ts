export const branches = [
  {
    slug: "dorada-caldas",
    label: "Principal Dorada - Caldas",
    address: "Calle 13 No. 5-64",
    whatsapp: "573138183395",
  },
  {
    slug: "puerto-boyaca",
    label: "Sucursal - Pto. Boyaca",
    address: "Cra. 2 No. 12-07",
    whatsapp: "573209046219",
  },
] as const;

export type BranchSlug = (typeof branches)[number]["slug"];

export function getBranchBySlug(slug?: string) {
  return branches.find((branch) => branch.slug === slug) ?? null;
}

export function isBranchSlug(slug: string): slug is BranchSlug {
  return branches.some((branch) => branch.slug === slug);
}
