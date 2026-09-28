"use client";

import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import pageBackground from "@/img/3.jpg";
import AdminSessionMenu from "./AdminSessionMenu";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const count = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));

  const links = [
    ["/", "Inicio"],
    ["/catalogo", "Catalogo"],
    ["/#sedes", "Sedes"],
    ["/#contacto", "Contacto"],
  ];


  return (
    <header
      className="sticky top-0 z-50 border-b border-white/15 bg-slate-950/85 bg-cover bg-center text-white shadow-lg shadow-slate-950/20 backdrop-blur-xl"
      style={{ backgroundImage: `linear-gradient(rgba(2, 6, 23, .78), rgba(2, 6, 23, .78)), url(${pageBackground.src})` }}
    >
      <div className="site-container flex h-18 items-center justify-between">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-gradient">
          TecniVision
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map(([href, label]) =>
            href.startsWith("/#") ? (
              <a key={href} href={href} className="text-sm font-semibold text-white/85 transition hover:text-white">
                {label}
              </a>
            ) : (
              <Link key={href} href={href} className="text-sm font-semibold text-white/85 transition hover:text-white">
                {label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <AdminSessionMenu />
          <Link href="/carrito" className="relative inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-slate-950 hover:bg-white/90">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          <button type="button" aria-label="Abrir menu" onClick={() => setOpen(!open)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white md:hidden">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden">
          <div className="site-container grid gap-2">
            {links.map(([href, label]) =>
              href.startsWith("/#") ? (
                <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10">
                  {label}
                </a>
              ) : (
                <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm font-semibold text-white/85 hover:bg-white/10">
                  {label}
                </Link>
              )
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
