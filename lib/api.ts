const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000";
const apiOrigin = configuredApiUrl.trim().replace(/\/+$/, "").replace(/\/api$/i, "");

export const API_URL = `${apiOrigin}/api`;

export function apiUrl(path: string): string {
  const endpoint = path.replace(/^\/+/, "").replace(/^api(?:\/|$)/i, "");
  return endpoint ? `${API_URL}/${endpoint}` : API_URL;
}

export async function apiFetch<T>(path:string, init?:RequestInit):Promise<T>{const r=await fetch(apiUrl(path),{...init,cache:init?.cache??"no-store"});if(!r.ok){let m=`Error API (${r.status})`;try{const d=await r.json();m=d.error||m;}catch{}throw new Error(m);}return r.json();}
export async function browserApi<T>(path:string,init?:RequestInit):Promise<T>{const r=await fetch(apiUrl(path),{...init,credentials:"include"});if(!r.ok){let m=`Error API (${r.status})`;try{const d=await r.json();m=d.error||m;}catch{}throw new Error(m);}return r.json();}
