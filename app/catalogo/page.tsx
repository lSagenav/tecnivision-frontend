import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import ProductStatusModal from "@/app/admin/products/ProductStatusModal";
import { branches, getBranchBySlug } from "@/lib/branches";
import { getCatalogData } from "@/lib/public-catalog";
import pageBackground from "@/img/3.jpg";
import { Search } from "lucide-react";

export const revalidate = 60;

type PageProps = { searchParams: Promise<{ categoria?: string; sede?: string; q?: string; agregado?: string }> };

function catalogUrl({ sede, categoria, q }: { sede: string; categoria?: string; q?: string }) {
  const params = new URLSearchParams({ sede });
  if (categoria) params.set("categoria", categoria);
  if (q) params.set("q", q);
  return `/catalogo?${params.toString()}`;
}

function sortCategoriesWithOtherLast<T extends { slug: string; name: string }>(categories: T[]) {
  return [...categories].sort((a, b) => {
    if (a.slug === "otros") return 1;
    if (b.slug === "otros") return -1;
    return a.name.localeCompare(b.name, "es");
  });
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const { categoria, sede, q, agregado } = await searchParams;
  const activeBranch = getBranchBySlug(sede) ?? branches[0];
  const search = q?.trim().slice(0, 80) || undefined;

  const [dbCategories, products] = await getCatalogData(activeBranch.slug, categoria, search);
  const categories = sortCategoriesWithOtherLast(dbCategories);

  return (
    <section
      className="bg-slate-950 bg-cover bg-fixed bg-center px-4 py-14 sm:px-6"
      style={{ backgroundImage: `linear-gradient(rgba(2, 6, 23, .76), rgba(2, 6, 23, .82)), url(${pageBackground.src})` }}
    >
      <div className="mx-auto max-w-7xl">
      {agregado === "1" && <ProductStatusModal message="Producto agregado al carrito con éxito" returnHref={catalogUrl({ sede: activeBranch.slug, categoria, q: search })} confirmLabel="Seguir comprando" />}
      <div className="rounded-[2rem] border border-white/15 bg-white/10 px-6 py-10 text-white shadow-2xl shadow-black/20 backdrop-blur md:px-10">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-white/75">Catálogo TecniVision</p>
        <h1 className="font-display mt-2 text-4xl font-black md:text-5xl">Encuentra tu próxima tecnología</h1>
        <p className="mt-3 max-w-2xl text-white/80">Productos disponibles en {activeBranch.label}. Consulta disponibilidad y finaliza tu solicitud por WhatsApp.</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {branches.map((branch) => (
          <Link key={branch.slug} href={catalogUrl({ sede: branch.slug })} className={`rounded-full px-4 py-2 text-sm font-bold transition ${activeBranch.slug === branch.slug && !categoria ? "bg-white text-slate-950" : "border border-white/20 bg-white/10 text-white hover:bg-white/20"}`}>
            {branch.label}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-2">
          <Link href={catalogUrl({ sede: activeBranch.slug })} className={`rounded-full px-4 py-2 text-sm font-semibold ${!categoria ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white hover:bg-white/20"}`}>Todos</Link>
          {categories.map((category) => (
            <Link key={category.id} href={catalogUrl({ sede: activeBranch.slug, categoria: category.slug })} className={`rounded-full px-4 py-2 text-sm font-semibold ${categoria === category.slug ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-white hover:bg-white/20"}`}>
              {category.name}
            </Link>
          ))}
        </div>

        <form action="/catalogo" method="get" className="relative w-full shrink-0 xl:w-80">
          <input type="hidden" name="sede" value={activeBranch.slug} />
          {categoria && <input type="hidden" name="categoria" value={categoria} />}
          <input
            type="search"
            name="q"
            defaultValue={search}
            maxLength={80}
            aria-label="Buscar productos"
            placeholder="Buscar productos..."
            className="h-11 w-full rounded-full border border-white/25 bg-white/10 py-2 pl-4 pr-12 text-sm font-medium text-white outline-none backdrop-blur placeholder:text-white/55 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/25"
          />
          <button type="submit" aria-label="Buscar" className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-full bg-cyan-300 text-slate-950 transition hover:bg-white">
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      <div className="mt-10">
        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/30 bg-white/10 p-10 text-center text-white/70 backdrop-blur">
            {search ? `No encontramos productos para “${search}” en esta selección.` : "No hay productos disponibles en esta selección."}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={{ ...product, categoryName: product.category.name, description: product.description }} />
            ))}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
