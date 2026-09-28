"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, ShieldCheck } from "lucide-react";
import { browserApi } from "@/lib/api";
import AdminLogoutButton from "./AdminLogoutButton";

export default function AdminSessionMenu() {
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const requestVersion = useRef(0);

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    async function checkSession() {
      controller?.abort();
      controller = new AbortController();
      const version = ++requestVersion.current;
      try {
        const result = await browserApi<{ admin?: { id: number } }>("/auth/me", { cache: "no-store", signal: controller.signal });
        if (active && version === requestVersion.current) setAuthenticated(Boolean(result.admin));
      } catch {
        if (active && version === requestVersion.current) setAuthenticated(false);
      }
    }
    function checkWhenVisible() {
      if (document.visibilityState === "visible") void checkSession();
    }
    function closeOutside(event: PointerEvent) {
      if (menu.current && event.target instanceof Node && !menu.current.contains(event.target)) menu.current.open = false;
    }
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && menu.current?.open) {
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      }
    }
    void checkSession();
    window.addEventListener("focus", checkWhenVisible);
    document.addEventListener("visibilitychange", checkWhenVisible);
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener("focus", checkWhenVisible);
      document.removeEventListener("visibilitychange", checkWhenVisible);
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [pathname]);

  if (!authenticated) return null;

  return (
    <details key={pathname} ref={menu} className="group relative">
      <summary aria-label="Opciones de administrador" className="flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-full border border-cyan-200/30 bg-white/5 px-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 sm:px-3 sm:text-sm [&::-webkit-details-marker]:hidden">
        <ShieldCheck aria-hidden="true" className="hidden h-4 w-4 sm:block" />
        Admin
        <ChevronDown aria-hidden="true" className="hidden h-3.5 w-3.5 transition group-open:rotate-180 sm:block" />
      </summary>
      <div className="absolute right-0 top-full z-50 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-slate-950 p-2 text-sm text-white shadow-xl shadow-black/40">
        <Link href="/admin/products" onClick={() => { if (menu.current) menu.current.open = false; }} className="flex items-center gap-2 rounded-xl px-3 py-3 font-medium hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-cyan-200">
          <LayoutDashboard aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-200" />
          Panel de administración
        </Link>
        <AdminLogoutButton label="Cerrar sesión" onLogout={() => { ++requestVersion.current; setAuthenticated(false); }} className="w-full cursor-pointer rounded-xl px-3 py-3 text-left font-medium text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-200 disabled:cursor-wait disabled:opacity-60" />
      </div>
    </details>
  );
}
