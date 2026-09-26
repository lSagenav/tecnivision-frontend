import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Headphones, ShieldCheck, Truck, Wrench } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { branches } from "@/lib/branches";
import { getHomeCatalogData } from "@/lib/public-catalog";
import heroBackground from "../img/fondo.jpg";
import pageBackground from "../img/3.jpg";
import boyacaImage from "../img/boyaca.jpeg";
import doradaImage from "../img/dorada.jpeg";

const branchImages = {
  "dorada-caldas": doradaImage,
  "puerto-boyaca": boyacaImage,
};

export const revalidate = 60;

function sortCategoriesWithOtherLast<T extends { slug: string; name: string }>(categories: T[]) {
  return [...categories].sort((a, b) => {
    if (a.slug === "otros") return 1;
    if (b.slug === "otros") return -1;
    return a.name.localeCompare(b.name, "es");
  });
}

export default async function HomePage() {
  const [featured, dbCategories] = await getHomeCatalogData();
  const categories = sortCategoriesWithOtherLast(dbCategories);

  return (
    <div
      className="bg-slate-950 bg-cover bg-fixed bg-center"
      style={{ backgroundImage: `url(${pageBackground.src})` }}
    >
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <Image
          src={heroBackground}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
        <div className="site-container relative pt-20 md:pt-28">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-bold backdrop-blur">Tecnología y seguridad en un solo lugar</span>
            <h1 className="font-display mt-6 text-5xl font-black leading-[.96] md:text-7xl">Tecnología que <span className="font-normal italic">conecta</span> contigo.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">Accesorios para celulares, cámaras de vigilancia, alarmas de seguridad y soluciones tecnológicas con acompañamiento personalizado.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalogo" className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-slate-900 hover:bg-white/90">Ver catálogo <ArrowRight className="h-4 w-4" /></Link>
              <Link href="#sedes" className="inline-flex h-12 items-center rounded-full border border-white/35 px-6 font-bold hover:bg-white/10">Elegir sede</Link>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-6 border-t border-white/15 py-8 md:grid-cols-4">
            <Benefit icon={<Truck className="h-5 w-5" />} title="Cobertura nacional" desc="Envios a Colombia" />
            <Benefit icon={<ShieldCheck className="h-5 w-5" />} title="Compra confiable" desc="Atencion real" />
            <Benefit icon={<Wrench className="h-5 w-5" />} title="Soporte tecnico" desc="Instalacion y mantenimiento" />
            <Benefit icon={<Headphones className="h-5 w-5" />} title="Asesoria" desc="Por WhatsApp" />
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="site-container pb-20 pt-0">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-200">Explora</p>
          <h2 className="font-display mt-2 text-3xl font-black text-white md:text-4xl">Compra por categoría</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/catalogo?categoria=${category.slug}`}
                className="card-elevated grid min-h-32 place-items-center rounded-2xl border border-cyan-200/25 bg-slate-950/70 p-6 text-center text-lg font-extrabold text-white shadow-black/20 backdrop-blur transition hover:border-cyan-200/70 hover:bg-cyan-950/75 hover:text-cyan-100"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="site-container pb-20">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-200">Selección especial</p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display mt-2 text-3xl font-black text-white md:text-4xl">Productos destacados</h2>
            <Link href="/catalogo" className="hidden text-sm font-bold text-cyan-200 hover:text-white sm:block">Ver todos</Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => <ProductCard key={product.id} product={{ ...product, categoryName: product.category.name }} />)}
          </div>
        </section>
      )}

      <section id="sedes" className="scroll-mt-24 pb-12">
        <div className="site-container">
        <div className="overflow-hidden rounded-[2rem] surface-hero p-8 text-white md:p-14">
          <h2 className="font-display text-3xl font-black md:text-5xl">Elige tu sede</h2>
          <p className="mt-3 max-w-2xl text-white/80">Cada sede maneja su catálogo y atención independiente.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {branches.map((branch) => (
              <div key={branch.slug} className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
                <Image
                  src={branchImages[branch.slug]}
                  alt={branch.label}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="p-6">
                <h3 className="text-xl font-bold">{branch.label}</h3>
                <p className="mt-2 text-sm text-white/75">{branch.address}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={`/catalogo?sede=${branch.slug}`} className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900">Ver catálogo</Link>
                  <a href={`https://wa.me/${branch.whatsapp}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-4 py-2 text-sm font-bold">WhatsApp</a>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}

function Benefit({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-cyan-200 ring-1 ring-white/15">{icon}</span><div><p className="text-sm font-bold text-white">{title}</p><p className="text-xs text-white/65">{desc}</p></div></div>;
}
