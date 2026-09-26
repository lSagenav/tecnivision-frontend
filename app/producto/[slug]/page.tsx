import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { getBranchBySlug } from "@/lib/branches";
import { getPublicProductBySlug } from "@/lib/public-catalog";
import AddToCartButton from "./AddToCartButton";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-image";

export const revalidate = 60;

type PageProps = { params: Promise<{ slug: string }> };

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);
  if (!product || !product.available) notFound();
  const branch = getBranchBySlug(product.branchSlug);

  return (
    <div className="site-container py-12">
      <Link href={`/catalogo?sede=${product.branchSlug}`} className="text-sm font-bold text-blue-600">← Volver al catálogo</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-white to-blue-50 shadow-xl shadow-blue-100/60">
          {product.imageUrl ? <img src={getCloudinaryImageUrl(product.imageUrl, 1200)} alt={product.name} className="aspect-square h-full w-full object-cover" /> : <div className="grid aspect-square place-items-center text-slate-400">Sin imagen</div>}
        </div>
        <section className="self-center rounded-[2rem] bg-white p-7 shadow-xl shadow-slate-200/60 md:p-10">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">{product.category.name}</span>
          <h1 className="font-display mt-5 text-4xl font-black leading-tight md:text-5xl">{product.name}</h1>
          <p className="mt-5 whitespace-pre-line text-base leading-7 text-slate-600">{product.description}</p>
          <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <Info icon={<CheckCircle2 />} text="Disponible para solicitud" />
            <Info icon={<ShieldCheck />} text="Atención personalizada" />
            <Info icon={<Truck />} text={`Sede: ${branch?.label ?? product.branchSlug}`} />
            <Info icon={<MessageCircle />} text="Confirmación por WhatsApp" />
          </div>
          <div className="mt-8"><AddToCartButton product={product} /></div>
        </section>
      </div>
    </div>
  );
}

function Info({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <div className="flex items-center gap-2">{<span className="text-blue-600 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}<span>{text}</span></div>;
}
