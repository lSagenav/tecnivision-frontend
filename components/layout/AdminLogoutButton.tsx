"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiUrl } from "@/lib/api";

type AdminLogoutButtonProps = {
  className?: string;
  label?: string;
  onLogout?: () => void;
};

export default function AdminLogoutButton({ className, label = "Salir", onLogout }: AdminLogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const response = await fetch(apiUrl("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("No se pudo cerrar la sesión. Inténtalo nuevamente.");
      onLogout?.();

      router.push("/");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "No se pudo cerrar la sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={className ?? "rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-100 disabled:opacity-60"}
    >
      {loading ? "Saliendo..." : label}
    </button>
  );
}
