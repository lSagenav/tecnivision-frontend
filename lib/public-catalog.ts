import { apiFetch } from "@/lib/api";
export type Category={id:number;name:string;slug:string};
export type Product={id:number;name:string;slug:string;description:string;productOptions:string|null;imageUrl:string|null;featured:boolean;available:boolean;branchSlug:string;categoryId:number;category:Category;createdAt:string;updatedAt:string};
export async function getHomeCatalogData(){const [featured,categories]=await Promise.all([apiFetch<Product[]>("/products/featured"),apiFetch<Category[]>("/categories")]);return [featured,categories] as const;}
export async function getCatalogData(branch:string,category?:string,search?:string){const p=new URLSearchParams({sede:branch});if(category)p.set("categoria",category);if(search)p.set("q",search);const [categories,products]=await Promise.all([apiFetch<Category[]>("/categories"),apiFetch<Product[]>(`/products?${p}`)]);return [categories,products] as const;}
export async function getPublicProductBySlug(slug:string){try{return await apiFetch<Product>(`/products/slug/${encodeURIComponent(slug)}`);}catch{return null;}}
