import Link from "next/link";
import { ArrowRight } from "lucide-react";
import QuickAddToCartButton from "@/components/products/QuickAddToCartButton";
import { getCloudinaryImageUrl } from "@/lib/cloudinary-image";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    slug: string;
    branchSlug: string;
    imageUrl?: string | null;
    categoryName?: string;
    description?: string;
    productOptions?: string | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card-elevated group relative overflow-hidden rounded-3xl border border-white bg-white">
      <QuickAddToCartButton product={product} />
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
          {product.imageUrl ? (
            <img src={getCloudinaryImageUrl(product.imageUrl, 500)} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="grid h-full place-items-center text-sm text-slate-400">Sin imagen</div>
          )}
        </div>
        <div className="p-5">
          {product.categoryName && <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{product.categoryName}</p>}
          <h2 className="mt-2 line-clamp-2 text-lg font-extrabold text-slate-900">{product.name}</h2>
          {product.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.description}</p>}
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-900">Ver producto <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
        </div>
      </Link>
    </article>
  );
}
