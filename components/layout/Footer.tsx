import Image from "next/image";
import Link from "next/link";
import contactCard from "@/img/card.png";

export default function Footer() {
  return (
    <footer id="contacto" className="scroll-mt-24 border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-4 py-3 sm:px-6 md:grid-cols-[1fr_.65fr_.82fr]">
        <div>
          <div className="font-display text-xl font-extrabold">TecniVision</div>
          <p className="mt-1.5 max-w-sm text-sm leading-5 text-slate-300">Tecnologia, accesorios y soluciones de seguridad con atencion personalizada en Colombia.</p>
        </div>
        <div>
          <h3 className="text-base font-bold">Navegacion</h3>
          <div className="mt-1.5 grid gap-1 text-sm text-slate-300">
            <Link href="/catalogo" className="hover:text-white">Catalogo</Link>
            <Link href="#sedes" className="hover:text-white">Sedes</Link>
            <Link href="/carrito" className="hover:text-white">Carrito</Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/30">
          <Image
            src={contactCard}
            loading="eager"
            alt="Tarjeta de presentacion TecniVision"
            sizes="(min-width: 768px) 26vw, 100vw"
            className="w-full"
          />
        </div>
      </div>
    </footer>
  );
}
