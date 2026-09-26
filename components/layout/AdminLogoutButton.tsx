"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiUrl } from "@/lib/api";

export default function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      await fetch(apiUrl("/auth/logout"), {
        method: "POST",
        credentials: "include",
      });

      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 hover:bg-slate-100 disabled:opacity-60"
    >
      {loading ? "Saliendo..." : "Salir"}
    </button>
  );
}
