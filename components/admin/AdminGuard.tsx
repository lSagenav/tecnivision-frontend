"use client";
import { useEffect,useState } from "react";import { useRouter } from "next/navigation";import { browserApi } from "@/lib/api";
export default function AdminGuard({children}:{children:React.ReactNode}){const router=useRouter();const[ok,setOk]=useState(false);useEffect(()=>{browserApi("/auth/me").then(()=>setOk(true)).catch(()=>router.replace("/login"));},[router]);if(!ok)return <div className="min-h-[60vh] grid place-items-center text-slate-300">Verificando sesión...</div>;return <>{children}</>;}
